import cv2
import numpy as np
import base64
import os

from typing import Dict, Any, List


from app.ml.extractor import FeatureExtractor
from app.ml.classifier import ISLClassifier
from app.ml.hand_detector import HandDetector



class ISLPipeline:


    def __init__(self):

        self.extractor = FeatureExtractor()

        self.classifier = ISLClassifier()

        self.hand_detector = HandDetector()



    def decode_image(self, image_bytes):

        nparr = np.frombuffer(
            image_bytes,
            np.uint8
        )


        return cv2.imdecode(
            nparr,
            cv2.IMREAD_COLOR
        )



    def predict_live_frame(
            self,
            image_data_url:str,
            history:List[Dict[str,Any]]=None
    ):


        try:

            header,encoded = (
                image_data_url.split(",",1)
            )


            image_bytes = base64.b64decode(
                encoded
            )


        except:

            return {

                "success":False,

                "error":"Invalid image"

            }



        frame = self.decode_image(
            image_bytes
        )


        if frame is None:

            return {

                "success":False,

                "error":"Image decode failed"

            }



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



        # -----------------------
        # NON MANUAL CLASSIFIER
        # -----------------------

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
        # FUSION LOGIC
        # -----------------------
        final_text = self.classifier.fuse_translation(
            hand_result.get("gesture", "Unknown"),
            marker
        )

        if hand_result["gesture"] != "Unknown" and \
           hand_result["gesture"] != "No Hand":
            confidence = max(
                confidence,
                hand_result["confidence"]
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


            "features":features,


            "landmarks":landmarks

        }

    def predict_image(self, image_bytes: bytes) -> Dict[str, Any]:
        frame = self.decode_image(image_bytes)
        if frame is None:
            return {"success": False, "error": "Image decode failed"}
        features = self.extractor.extract_features(frame)
        hand_result = self.hand_detector.detect(frame)
        marker, text, confidence = self.classifier.classify_frame(features)
        
        landmarks = features.get("landmarks_raw", [])
        features.pop("landmarks_raw", None)
        
        final_text = self.classifier.fuse_translation(
            hand_result.get("gesture", "Unknown"),
            marker
        )
        if hand_result["gesture"] != "Unknown" and hand_result["gesture"] != "No Hand":
            confidence = max(confidence, hand_result["confidence"])
            
        return {
            "success": True,
            "hand_gesture": hand_result,
            "marker": marker,
            "translation": final_text,
            "confidence": round(confidence * 100, 2),
            "features": features,
            "landmarks": landmarks
        }

    def predict_video(self, video_path: str) -> Dict[str, Any]:
        import cv2
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"success": False, "error": "Could not open video file"}
            
        frames_features = []
        hand_gestures = []
        
        frame_count = 0
        max_frames = 150
        sample_rate = 5
        
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret or frame is None:
                break
                
            if frame_count % sample_rate == 0:
                features = self.extractor.extract_features(frame)
                hand_result = self.hand_detector.detect(frame)
                frames_features.append(features)
                hand_gestures.append(hand_result)
                
            frame_count += 1
            
        cap.release()
        
        if not frames_features:
            return {"success": False, "error": "No frames could be extracted from video"}
            
        marker, text, confidence = self.classifier.classify_sequence(frames_features)
        
        valid_gestures = [g.get("gesture") for g in hand_gestures if g.get("gesture") not in ["No Hand", "Unknown"]]
        if valid_gestures:
            from collections import Counter
            most_common_gesture = Counter(valid_gestures).most_common(1)[0][0]
            matching_confidences = [g.get("confidence") for g in hand_gestures if g.get("gesture") == most_common_gesture]
            avg_gesture_confidence = sum(matching_confidences) / len(matching_confidences)
            hand_result = {
                "gesture": most_common_gesture,
                "confidence": avg_gesture_confidence,
                "finger_state": next(g.get("finger_state") for g in hand_gestures if g.get("gesture") == most_common_gesture)
            }
        else:
            hand_result = {"gesture": "No Hand", "confidence": 0.0, "finger_state": [0,0,0,0,0]}
            
        rep_idx = -1
        for i in range(len(frames_features)-1, -1, -1):
            if frames_features[i].get("face_detected"):
                rep_idx = i
                break
        if rep_idx == -1:
            rep_idx = 0
            
        rep_features = frames_features[rep_idx].copy()
        landmarks = rep_features.get("landmarks_raw", [])
        rep_features.pop("landmarks_raw", None)
        
        final_text = self.classifier.fuse_translation(
            hand_result.get("gesture", "Unknown"),
            marker
        )
        if hand_result["gesture"] != "Unknown" and hand_result["gesture"] != "No Hand":
            confidence = max(confidence, hand_result["confidence"])
            
        return {
            "success": True,
            "hand_gesture": hand_result,
            "marker": marker,
            "translation": final_text,
            "confidence": round(confidence * 100, 2),
            "features": rep_features,
            "landmarks": landmarks
        }