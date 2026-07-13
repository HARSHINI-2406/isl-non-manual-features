import cv2
import numpy as np
import base64
import os
from typing import Dict, Any, List, Tuple
from app.ml.extractor import FeatureExtractor
from app.ml.classifier import ISLClassifier

class ISLPipeline:
    def __init__(self):
        self.extractor = FeatureExtractor()
        self.classifier = ISLClassifier()

    def decode_image(self, image_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

    def predict_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Process a single image and return features, landmarks, and classification.
        """
        frame = self.decode_image(image_bytes)
        if frame is None:
            return {
                "success": False,
                "error": "Invalid image data"
            }
        
        features = self.extractor.extract_features(frame)
        marker, translation, confidence = self.classifier.classify_frame(features)
        
        # Clean raw landmarks from return features to keep response size light
        landmarks = features.pop("landmarks_raw", [])
        
        return {
            "success": True,
            "marker": marker,
            "translation": translation,
            "confidence": confidence,
            "features": features,
            "landmarks": landmarks
        }

    def predict_video(self, video_path: str) -> Dict[str, Any]:
        """
        Process a video file, extracting landmarks across all frames,
        and classifying temporal movements (nodding, shaking, etc.).
        """
        if not os.path.exists(video_path):
            return {
                "success": False,
                "error": "Video file not found"
            }

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {
                "success": False,
                "error": "Could not open video file"
            }

        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        # Determine downsampling rate to process roughly 30 frames maximum (keeps it fast and responsive)
        step = max(1, frame_count // 30)

        sequence_features = []
        representative_landmarks = []
        
        idx = 0
        success = True
        while success:
            success, frame = cap.read()
            if not success or frame is None:
                break
            
            if idx % step == 0:
                features = self.extractor.extract_features(frame)
                if features["face_detected"]:
                    # Keep raw landmarks of the middle frame for visual representation
                    if len(sequence_features) == 15 or (not representative_landmarks and features["landmarks_raw"]):
                        representative_landmarks = features.get("landmarks_raw", [])
                    sequence_features.append(features)
            idx += 1

        cap.release()

        if not sequence_features:
            return {
                "success": False,
                "error": "No faces or features detected in video frames"
            }

        # If we didn't capture a middle frame's landmarks, pick the first available
        if not representative_landmarks and sequence_features:
            # We must fetch the landmarks before popping them in cleanup
            representative_landmarks = sequence_features[0].get("landmarks_raw", [])

        # Temporal classification
        marker, translation, confidence = self.classifier.classify_sequence(sequence_features)

        # Cleanup raw landmarks from items in sequence features before returning
        for feat in sequence_features:
            feat.pop("landmarks_raw", None)

        # Calculate averages for reporting
        avg_mar = float(np.mean([f["mouth"]["mar"] for f in sequence_features]))
        avg_left_brow = float(np.mean([f["eyebrows"]["left_height_ratio"] for f in sequence_features]))
        avg_right_brow = float(np.mean([f["eyebrows"]["right_height_ratio"] for f in sequence_features]))
        
        summary_features = {
            "eyebrows": {"left_height_ratio": avg_left_brow, "right_height_ratio": avg_right_brow, "state": sequence_features[-1]["eyebrows"]["state"]},
            "mouth": {"mar": avg_mar, "state": sequence_features[-1]["mouth"]["state"]},
            "gaze": sequence_features[-1]["gaze"],
            "head_pose": sequence_features[-1]["head_pose"],
            "body": sequence_features[-1]["body"]
        }

        return {
            "success": True,
            "marker": marker,
            "translation": translation,
            "confidence": confidence,
            "features": summary_features,
            "landmarks": representative_landmarks,
            "frame_stats": {
                "total_processed": len(sequence_features),
                "total_video_frames": frame_count
            }
        }

    def predict_live_frame(self, image_data_url: str, history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Process a base64 encoded data url frame from a live webcam feed.
        """
        # Decode Data URL
        try:
            header, encoded = image_data_url.split(",", 1)
            image_bytes = base64.b64decode(encoded)
        except Exception:
            return {
                "success": False,
                "error": "Invalid base64 image encoding"
            }

        frame = self.decode_image(image_bytes)
        if frame is None:
            return {
                "success": False,
                "error": "Could not decode frame image"
            }

        features = self.extractor.extract_features(frame)
        landmarks = features.pop("landmarks_raw", [])

        # If a temporal history of previous frames is provided, use it
        if history and len(history) > 0:
            # Combine current frame features with historical features
            # Limit history to last 20 frames
            full_sequence = history[-20:] + [features]
            marker, translation, confidence = self.classifier.classify_sequence(full_sequence)
        else:
            marker, translation, confidence = self.classifier.classify_frame(features)

        return {
            "success": True,
            "marker": marker,
            "translation": translation,
            "confidence": confidence,
            "features": features,
            "landmarks": landmarks
        }
