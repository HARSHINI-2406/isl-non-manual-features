import cv2
import numpy as np
import base64

from typing import Dict, Any, List

from app.ml.extractor import FeatureExtractor
from app.ml.classifier import ISLClassifier
from app.ml.hand_detector import HandDetector


class ISLPipeline:

    def __init__(self):

        self.extractor = FeatureExtractor()

        self.classifier = ISLClassifier()

        self.hand_detector = HandDetector()

        # stores recent frames for live sequence analysis
        self.live_history = []

        self.max_history = 15



    def decode_image(self, image_bytes):

        nparr = np.frombuffer(
            image_bytes,
            np.uint8
        )

        return cv2.imdecode(
            nparr,
            cv2.IMREAD_COLOR
        )



    def process_frame(
            self,
            frame,
            use_history=True
    ):

        # -----------------------
        # FACE FEATURES
        # -----------------------

        features = (
            self.extractor.extract_features(frame)
        )


        # -----------------------
        # HAND FEATURES
        # -----------------------

        hand_result = (
            self.hand_detector.detect(frame)
        )


        # keep history for temporal analysis

        if use_history:

            clean_features = features.copy()

            clean_features.pop(
                "landmarks_raw",
                None
            )

            self.live_history.append(
                clean_features
            )


            if len(self.live_history) > self.max_history:

                self.live_history.pop(0)



        # -----------------------
        # NON MANUAL CLASSIFICATION
        # -----------------------

        if (
            len(self.live_history) >= 5
            and use_history
        ):

            marker,text,confidence = (
                self.classifier.classify_sequence(
                    self.live_history
                )
            )

        else:

            marker,text,confidence = (
                self.classifier.classify_frame(
                    features
                )
            )



        landmarks = features.get(
            "landmarks_raw",
            []
        )


        features.pop(
            "landmarks_raw",
            None
        )



        # -----------------------
        # FUSION
        # -----------------------

        final_text = (
            self.classifier.fuse_translation(
                hand_result.get(
                    "gesture",
                    "Unknown"
                ),
                marker
            )
        )



        if (
            hand_result.get("gesture")
            not in [
                "Unknown",
                "No Hand"
            ]
        ):

            confidence = (
                confidence * 0.4
                +
                hand_result.get(
                    "confidence",
                    0
                ) * 0.6
            )



        return {

            "success": True,

            "hand_gesture": hand_result,

            "marker": marker,

            "translation": final_text,

            "confidence": round(
                confidence * 100,
                2
            ),

            "features": features,

            "landmarks": landmarks

        }





    def predict_live_frame(
            self,
            image_data_url: str,
            history: List[Dict[str,Any]]=None
    ):


        try:

            header, encoded = (
                image_data_url.split(
                    ",",
                    1
                )
            )


            image_bytes = base64.b64decode(
                encoded
            )


        except Exception:


            return {

                "success": False,

                "error": "Invalid image"

            }



        frame = self.decode_image(
            image_bytes
        )


        if frame is None:


            return {

                "success": False,

                "error": "Image decode failed"

            }



        return self.process_frame(
            frame,
            use_history=True
        )






    def predict_image(
            self,
            image_bytes: bytes
    ):


        frame = self.decode_image(
            image_bytes
        )


        if frame is None:

            return {

                "success":False,

                "error":"Image decode failed"

            }


        return self.process_frame(
            frame,
            use_history=False
        )






    def predict_video(
            self,
            video_path:str
    ) -> Dict[str,Any]:


        cap = cv2.VideoCapture(
            video_path
        )


        if not cap.isOpened():

            return {

                "success":False,

                "error":"Could not open video file"

            }



        frames_features = []

        hand_gestures = []


        frame_count = 0

        max_frames = 150

        sample_rate = 5



        while frame_count < max_frames:


            ret, frame = cap.read()


            if not ret:

                break



            if frame_count % sample_rate == 0:


                features = (
                    self.extractor.extract_features(
                        frame
                    )
                )


                hand_result = (
                    self.hand_detector.detect(
                        frame
                    )
                )


                frames_features.append(
                    features
                )


                hand_gestures.append(
                    hand_result
                )


            frame_count += 1



        cap.release()



        if not frames_features:


            return {

                "success":False,

                "error":"No frames extracted"

            }




        marker,text,confidence = (

            self.classifier.classify_sequence(
                frames_features
            )

        )



        valid_gestures = [

            g.get("gesture")

            for g in hand_gestures

            if g.get("gesture")
            not in [
                "No Hand",
                "Unknown"
            ]

        ]



        if valid_gestures:


            from collections import Counter


            most_common_gesture = (

                Counter(
                    valid_gestures
                )
                .most_common(1)[0][0]

            )


            matching = [

                g.get(
                    "confidence",
                    0
                )

                for g in hand_gestures

                if g.get("gesture")
                ==
                most_common_gesture

            ]


            avg_confidence = (

                sum(matching)
                /
                len(matching)

            )



            finger_state = [

                0,0,0,0,0

            ]


            for g in hand_gestures:


                if g.get("gesture") == most_common_gesture:


                    finger_state = g.get(
                        "finger_state",
                        [
                            0,0,0,0,0
                        ]
                    )

                    break



            hand_result = {

                "gesture":
                most_common_gesture,

                "confidence":
                avg_confidence,

                "finger_state":
                finger_state

            }


        else:


            hand_result = {

                "gesture":"No Hand",

                "confidence":0.0,

                "finger_state":[
                    0,0,0,0,0
                ]

            }




        rep_features = (
            frames_features[-1].copy()
        )


        landmarks = rep_features.get(
            "landmarks_raw",
            []
        )


        rep_features.pop(
            "landmarks_raw",
            None
        )



        final_text = (

            self.classifier.fuse_translation(

                hand_result.get(
                    "gesture",
                    "Unknown"
                ),

                marker

            )

        )



        confidence = (

            confidence * 0.4
            +
            hand_result.get(
                "confidence",
                0
            ) * 0.6

        )



        return {


            "success":True,

            "hand_gesture":hand_result,

            "marker":marker,

            "translation":final_text,

            "confidence":round(
                confidence*100,
                2
            ),

            "features":rep_features,

            "landmarks":landmarks

        }