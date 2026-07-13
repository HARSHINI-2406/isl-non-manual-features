import cv2
import numpy as np
import mediapipe as mp
import math
from typing import Dict, Any, Tuple, Optional
from app.ml.landmarks import (
    LEFT_EYEBROW_INDEXES, RIGHT_EYEBROW_INDEXES,
    LEFT_EYE_TOP, LEFT_EYE_BOTTOM, RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM,
    LEFT_IRIS, RIGHT_IRIS, LEFT_EYE_LEFT_CORNER, LEFT_EYE_RIGHT_CORNER,
    RIGHT_EYE_LEFT_CORNER, RIGHT_EYE_RIGHT_CORNER,
    LIP_UPPER_INNER, LIP_LOWER_INNER, LIP_LEFT_CORNER, LIP_RIGHT_CORNER,
    PNP_FACE_LANDMARKS, SHOULDER_LEFT, SHOULDER_RIGHT
)

class FeatureExtractor:
    def __init__(self):
        # Initialize MediaPipe models
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True, # Required for Iris detection
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # 3D Canonical Face Model Points for Head Pose Estimation (SolvePnP)
        # Coordinates in millimeters
        self.model_points = np.array([
            (0.0, 0.0, 0.0),             # Nose tip
            (0.0, -330.0, -65.0),        # Chin
            (-225.0, 170.0, -135.0),     # Left eye outer corner
            (225.0, 170.0, -135.0),      # Right eye outer corner
            (-150.0, -150.0, -125.0),    # Left mouth corner
            (150.0, -150.0, -125.0)      # Right mouth corner
        ], dtype=np.float32)

    def _euclidean_distance(self, p1: Tuple[float, float, float], p2: Tuple[float, float, float]) -> float:
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2 + (p1[2] - p2[2])**2)

    def _get_landmark_coords(self, landmarks, idx: int, w: int, h: int) -> Tuple[float, float, float]:
        lm = landmarks[idx]
        return (lm.x * w, lm.y * h, lm.z * w)

    def extract_features(self, frame: np.ndarray) -> Dict[str, Any]:
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        face_results = self.face_mesh.process(rgb_frame)
        pose_results = self.pose.process(rgb_frame)
        
        features = {
            "face_detected": False,
            "pose_detected": False,
            "eyebrows": {"left_height_ratio": 0.0, "right_height_ratio": 0.0, "state": "normal"},
            "mouth": {"mar": 0.0, "state": "closed"},
            "gaze": {"left_gaze": "center", "right_gaze": "center", "horizontal_ratio": 0.5},
            "head_pose": {"pitch": 0.0, "yaw": 0.0, "roll": 0.0, "nodding": False, "shaking": False},
            "body": {"shoulder_slope": 0.0, "lean": "center", "lean_ratio": 0.0},
            "landmarks_raw": [] # Used for drawing on frontend
        }

        if face_results.multi_face_landmarks:
            features["face_detected"] = True
            face_landmarks = face_results.multi_face_landmarks[0]
            landmarks_list = face_landmarks.landmark
            
            # Save raw landmarks for frontend visualization (select a subset to minimize payload size)
            # We will send key landmarks for face mesh outline, eyebrows, eyes, nose, lips
            sampled_indices = list(range(0, 468, 4)) + LEFT_EYEBROW_INDEXES + RIGHT_EYEBROW_INDEXES + [
                LEFT_EYE_TOP, LEFT_EYE_BOTTOM, RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM,
                LEFT_EYE_LEFT_CORNER, LEFT_EYE_RIGHT_CORNER, RIGHT_EYE_LEFT_CORNER, RIGHT_EYE_RIGHT_CORNER,
                LIP_UPPER_INNER, LIP_LOWER_INNER, LIP_LEFT_CORNER, LIP_RIGHT_CORNER
            ] + PNP_FACE_LANDMARKS
            # Include iris if available
            if len(landmarks_list) > 468:
                sampled_indices += LEFT_IRIS + RIGHT_IRIS

            features["landmarks_raw"] = [
                {"x": int(landmarks_list[i].x * w), "y": int(landmarks_list[i].y * h)}
                for i in sorted(list(set(sampled_indices)))
            ]

            # 1. Eyebrow Height Ratios
            # Left: distance between left eyebrow center (105) and left eye top (159)
            # Normalized by left eye width (33 to 133)
            p_le_top = self._get_landmark_coords(landmarks_list, LEFT_EYE_TOP, w, h)
            p_le_brow = self._get_landmark_coords(landmarks_list, 105, w, h)
            p_le_left = self._get_landmark_coords(landmarks_list, LEFT_EYE_LEFT_CORNER, w, h)
            p_le_right = self._get_landmark_coords(landmarks_list, LEFT_EYE_RIGHT_CORNER, w, h)
            
            le_width = self._euclidean_distance(p_le_left, p_le_right)
            le_brow_height = self._euclidean_distance(p_le_top, p_le_brow)
            left_brow_ratio = le_brow_height / max(le_width, 1.0)

            # Right: distance between right eyebrow center (334) and right eye top (386)
            # Normalized by right eye width (362 to 263)
            p_re_top = self._get_landmark_coords(landmarks_list, RIGHT_EYE_TOP, w, h)
            p_re_brow = self._get_landmark_coords(landmarks_list, 334, w, h)
            p_re_left = self._get_landmark_coords(landmarks_list, RIGHT_EYE_LEFT_CORNER, w, h)
            p_re_right = self._get_landmark_coords(landmarks_list, RIGHT_EYE_RIGHT_CORNER, w, h)
            
            re_width = self._euclidean_distance(p_re_left, p_re_right)
            re_brow_height = self._euclidean_distance(p_re_top, p_re_brow)
            right_brow_ratio = re_brow_height / max(re_width, 1.0)
            
            features["eyebrows"]["left_height_ratio"] = float(round(left_brow_ratio, 3))
            features["eyebrows"]["right_height_ratio"] = float(round(right_brow_ratio, 3))
            
            # Categorize Eyebrow State
            avg_brow_ratio = (left_brow_ratio + right_brow_ratio) / 2.0
            if avg_brow_ratio > 0.40:
                features["eyebrows"]["state"] = "raised"
            elif avg_brow_ratio < 0.23:
                features["eyebrows"]["state"] = "furrowed"
            else:
                features["eyebrows"]["state"] = "normal"

            # 2. Mouth Aspect Ratio (MAR)
            # Ratio of vertical opening (inner lips 13 to 14) and horizontal width (corners 61 to 291)
            p_lip_top = self._get_landmark_coords(landmarks_list, LIP_UPPER_INNER, w, h)
            p_lip_bottom = self._get_landmark_coords(landmarks_list, LIP_LOWER_INNER, w, h)
            p_lip_left = self._get_landmark_coords(landmarks_list, LIP_LEFT_CORNER, w, h)
            p_lip_right = self._get_landmark_coords(landmarks_list, LIP_RIGHT_CORNER, w, h)
            
            lip_height = self._euclidean_distance(p_lip_top, p_lip_bottom)
            lip_width = self._euclidean_distance(p_lip_left, p_lip_right)
            mar = lip_height / max(lip_width, 1.0)
            features["mouth"]["mar"] = float(round(mar, 3))
            
            if mar > 0.18:
                features["mouth"]["state"] = "open"
            elif mar > 0.08:
                features["mouth"]["state"] = "relaxed"
            else:
                features["mouth"]["state"] = "closed"

            # 3. Eye Gaze (Iris tracking if available)
            if len(landmarks_list) > 468:
                # Left eye horizontal position: position of left iris center (468) relative to corners (33 and 133)
                p_l_iris = self._get_landmark_coords(landmarks_list, 468, w, h)
                l_dist_inner = self._euclidean_distance(p_l_iris, p_le_right) # corner 133
                l_dist_outer = self._euclidean_distance(p_l_iris, p_le_left)  # corner 33
                left_ratio = l_dist_outer / max((l_dist_inner + l_dist_outer), 1.0)
                
                # Right eye horizontal position: position of right iris center (473) relative to corners (362 and 263)
                p_r_iris = self._get_landmark_coords(landmarks_list, 473, w, h)
                r_dist_inner = self._euclidean_distance(p_r_iris, p_re_left)  # corner 362
                r_dist_outer = self._euclidean_distance(p_r_iris, p_re_right) # corner 263
                right_ratio = r_dist_inner / max((r_dist_inner + r_dist_outer), 1.0)
                
                avg_gaze_ratio = (left_ratio + right_ratio) / 2.0
                features["gaze"]["horizontal_ratio"] = float(round(avg_gaze_ratio, 3))
                
                # Categorize gaze
                if avg_gaze_ratio < 0.40:
                    features["gaze"]["left_gaze"] = "right"  # looking right (from subject's view)
                    features["gaze"]["right_gaze"] = "right"
                elif avg_gaze_ratio > 0.60:
                    features["gaze"]["left_gaze"] = "left"   # looking left
                    features["gaze"]["right_gaze"] = "left"
                else:
                    features["gaze"]["left_gaze"] = "center"
                    features["gaze"]["right_gaze"] = "center"

            # 4. Head Pose Estimation (SolvePnP)
            image_points = np.array([
                self._get_landmark_coords(landmarks_list, idx, w, h)[:2]
                for idx in PNP_FACE_LANDMARKS
            ], dtype=np.float32)

            # Camera matrix estimate
            focal_length = w
            center = (w / 2, h / 2)
            camera_matrix = np.array([
                [focal_length, 0, center[0]],
                [0, focal_length, center[1]],
                [0, 0, 1]
            ], dtype=np.float32)
            
            dist_coeffs = np.zeros((4, 1)) # Assuming no lens distortion
            
            success, rvec, tvec = cv2.solvePnP(self.model_points, image_points, camera_matrix, dist_coeffs)
            if success:
                # Rodrigues rotation vector to matrix
                rmat, _ = cv2.Rodrigues(rvec)
                
                # Euler angles from rotation matrix
                # projection matrix
                proj_matrix = np.hstack((rmat, tvec))
                _, _, _, _, _, _, euler_angles = cv2.decomposeProjectionMatrix(proj_matrix)
                
                pitch = float(euler_angles[0][0]) # Up/down
                yaw = float(euler_angles[1][0])   # Left/right
                roll = float(euler_angles[2][0])  # Tilt

                # Calibrate angles relative to front camera view
                # Standard range mapping
                features["head_pose"]["pitch"] = float(round(pitch, 2))
                features["head_pose"]["yaw"] = float(round(yaw, 2))
                features["head_pose"]["roll"] = float(round(roll, 2))

        # 5. Body Posture & Lean
        if pose_results.pose_landmarks:
            features["pose_detected"] = True
            pose_landmarks = pose_results.pose_landmarks.landmark
            
            # Left shoulder (11), Right shoulder (12)
            p_ls = pose_landmarks[SHOULDER_LEFT]
            p_rs = pose_landmarks[SHOULDER_RIGHT]
            
            # Slope/tilt of shoulders
            dx = (p_ls.x - p_rs.x) * w
            dy = (p_ls.y - p_rs.y) * h
            
            slope = dy / max(abs(dx), 1.0)
            features["body"]["shoulder_slope"] = float(round(slope, 3))
            
            # Lean left/right
            # If shoulder mid-point is shifted relative to nose
            if features["face_detected"]:
                # Nose landmark in 2D
                nose_x = features["landmarks_raw"][0]["x"] if len(features["landmarks_raw"]) > 0 else (w / 2)
                shoulder_mid_x = ((p_ls.x + p_rs.x) / 2.0) * w
                
                lean_diff = (shoulder_mid_x - nose_x) / w
                features["body"]["lean_ratio"] = float(round(lean_diff, 3))
                
                if lean_diff > 0.05:
                    features["body"]["lean"] = "left"
                elif lean_diff < -0.05:
                    features["body"]["lean"] = "right"
                else:
                    features["body"]["lean"] = "center"
            
        return features

    def close(self):
        self.face_mesh.close()
        self.pose.close()
