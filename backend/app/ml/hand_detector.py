import mediapipe as mp
import numpy as np
from typing import Dict, Any, List, Tuple

class HandDetector:
    def __init__(self):
        # Allow tracking of up to 2 hands for two-handed signs
        self.hands = mp.solutions.hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.65,
            min_tracking_confidence=0.65
        )
        
        # Temporal history buffer: stores wrist and index tip coords for both hands
        # Format: {'Left': [(x, y, z), ...], 'Right': [(x, y, z), ...]}
        self.history_buffer = {'Left': [], 'Right': []}
        self.max_buffer_size = 15 # Approx 0.5s of history at 30 FPS

    def _get_dist(self, p1, p2) -> float:
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2)**0.5

    def _determine_hand_gesture(self, fingers: List[int]) -> Tuple[str, float]:
        if fingers == [1, 1, 1, 1, 1]:
            return "HELLO", 0.95
        elif fingers == [1, 0, 0, 0, 0]:
            return "YES", 0.94
        elif fingers == [0, 1, 1, 0, 0]:
            return "THANK YOU", 0.92
        elif fingers == [0, 0, 0, 0, 0]:
            return "NO", 0.90
        elif fingers == [0, 1, 0, 0, 0]:
            return "YOU", 0.92
        elif fingers == [0, 0, 1, 1, 1]:
            return "OK", 0.91
        elif fingers == [1, 1, 0, 0, 1]:
            return "I LOVE YOU", 0.96
        elif fingers == [1, 0, 0, 0, 1]:
            return "CALL ME", 0.93
        elif fingers == [0, 1, 0, 0, 1]:
            return "ROCK ON", 0.92
        elif fingers == [0, 1, 1, 1, 1]:
            return "PLEASE", 0.91
        return "Unknown", 0.50

    def _analyze_temporal_motion(self, hand_label: str) -> str:
        coords = self.history_buffer[hand_label]
        if len(coords) < 5:
            return "static"
            
        # Compute differences between oldest and newest points
        oldest = coords[0]
        newest = coords[-1]
        
        dx = newest[0] - oldest[0]
        dy = newest[1] - oldest[1]
        
        # Thresholds for movement in image coordinates (normalized 0-1)
        thresh = 0.05
        
        if abs(dx) > abs(dy):
            if dx > thresh:
                return "dynamic_swipe_right"
            elif dx < -thresh:
                return "dynamic_swipe_left"
        else:
            if dy > thresh:
                return "dynamic_swipe_down"
            elif dy < -thresh:
                return "dynamic_swipe_up"
                
        # Check standard deviation for general jitter or waving
        xs = [pt[0] for pt in coords]
        std_x = np.std(xs)
        if std_x > 0.02:
            return "dynamic_waving"
            
        return "static"

    def detect(self, frame) -> Dict[str, Any]:
        h, w, _ = frame.shape
        rgb = frame[:, :, ::-1] # BGR to RGB
        result = self.hands.process(rgb)
        
        # Default empty output
        output = {
            "gesture": "No Hand",
            "confidence": 0.0,
            "finger_state": [0, 0, 0, 0, 0],
            "detected_hands_count": 0,
            "hands": []
        }
        
        if not result.multi_hand_landmarks:
            # Clear temporal history if no hands are visible
            self.history_buffer['Left'].clear()
            self.history_buffer['Right'].clear()
            return output
            
        detected_hands = []
        
        for i, landmarks_obj in enumerate(result.multi_hand_landmarks):
            handedness = result.multi_handedness[i].classification[0].label # 'Left' or 'Right'
            # Note: MediaPipe returns handedness relative to image frame, so we mirror if needed,
            # but we can keep it standard for classification.
            
            landmarks = landmarks_obj.landmark
            
            # Extract fingers state
            fingers = []
            
            # Thumb extension (distance tip to wrist relative to MCP to wrist)
            d_thumb_tip = self._get_dist(landmarks[4], landmarks[0])
            d_thumb_mcp = self._get_dist(landmarks[2], landmarks[0])
            if d_thumb_tip > 1.30 * d_thumb_mcp:
                fingers.append(1)
            else:
                fingers.append(0)
                
            # Index, Middle, Ring, Pinky extension
            mcp_indices = [5, 9, 13, 17]
            for idx, tip in enumerate([8, 12, 16, 20]):
                mcp = mcp_indices[idx]
                d_tip = self._get_dist(landmarks[tip], landmarks[0])
                d_mcp = self._get_dist(landmarks[mcp], landmarks[0])
                if d_tip > 1.22 * d_mcp:
                    fingers.append(1)
                else:
                    fingers.append(0)
            
            # Gesture and confidence
            single_gesture, single_conf = self._determine_hand_gesture(fingers)
            
            # Update temporal buffer with wrist coordinate (landmark 0)
            self.history_buffer[handedness].append((landmarks[0].x, landmarks[0].y, landmarks[0].z))
            if len(self.history_buffer[handedness]) > self.max_buffer_size:
                self.history_buffer[handedness].pop(0)
                
            motion_state = self._analyze_temporal_motion(handedness)
            
            # Add dynamic suffix to gesture if moving
            gesture_output = single_gesture
            if motion_state != "static" and single_gesture != "Unknown":
                gesture_output = f"{single_gesture}_MOVING"
                
            # Collect detailed 21 landmarks formatted as 2D pixels for the frontend
            landmarks_pixels = [
                {"x": int(lm.x * w), "y": int(lm.y * h), "z": lm.z}
                for lm in landmarks
            ]
            
            detected_hands.append({
                "label": handedness,
                "gesture": gesture_output,
                "raw_gesture": single_gesture,
                "confidence": single_conf,
                "finger_state": fingers,
                "motion": motion_state,
                "landmarks": landmarks_pixels
            })
            
        output["detected_hands_count"] = len(detected_hands)
        output["hands"] = detected_hands
        
        # Fulfill backward compatibility using primary hand details (prefer Right or first detected)
        primary_hand = detected_hands[0]
        for hand in detected_hands:
            if hand["label"] == "Right":
                primary_hand = hand
                break
                
        output["gesture"] = primary_hand["gesture"]
        output["confidence"] = primary_hand["confidence"]
        output["finger_state"] = primary_hand["finger_state"]
        
        # If there are two hands, check if they combine into a two-hand sign
        if len(detected_hands) == 2:
            left_hand = next(h for h in detected_hands if h["label"] == "Left")
            right_hand = next(h for h in detected_hands if h["label"] == "Right")
            
            # Combine gestures
            # Example two-hand gestures:
            # 1. Both HELLO = "WELCOME / NAMASTE"
            # 2. Both PLEASE = "REQUEST / PRAY"
            if left_hand["raw_gesture"] == "HELLO" and right_hand["raw_gesture"] == "HELLO":
                output["gesture"] = "WELCOME"
                output["confidence"] = 0.98
            elif left_hand["raw_gesture"] == "PLEASE" and right_hand["raw_gesture"] == "PLEASE":
                output["gesture"] = "NAMASTE / PRAY"
                output["confidence"] = 0.97
            elif left_hand["raw_gesture"] == "YES" and right_hand["raw_gesture"] == "YES":
                output["gesture"] = "EXCELLENT"
                output["confidence"] = 0.96
                
        return output