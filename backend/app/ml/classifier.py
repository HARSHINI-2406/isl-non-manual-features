import numpy as np
from typing import List, Dict, Any, Tuple

class ISLClassifier:
    def __init__(self):
        pass

    def classify_frame(self, features: Dict[str, Any]) -> Tuple[str, str, float]:
        """
        Classifies non-manual features for a single static image frame.
        Returns: (grammatical_marker, translation_text, confidence)
        """
        if not features.get("face_detected"):
            return "No Face Detected", "Unable to detect facial landmarks.", 0.0

        # Extract values
        eyebrow_state = features["eyebrows"]["state"]
        mouth_state = features["mouth"]["state"]
        mar = features["mouth"]["mar"]
        gaze = features["gaze"]["left_gaze"]
        pitch = features["head_pose"]["pitch"]
        yaw = features["head_pose"]["yaw"]
        body_lean = features["body"]["lean"]
        
        # 1. Yes/No Question marker: Raised eyebrows + forward tilt
        # For our pitch angles, positive pitch usually means tilting down/forward, negative up/backward
        if eyebrow_state == "raised" and pitch > 3.0:
            return "Yes/No Question Marker", "Is it? (Question)", 0.88
            
        # 2. Wh- Question marker: Furrowed eyebrows + tilted head
        if eyebrow_state == "furrowed" and abs(pitch) > 3.0:
            return "Wh- Question Marker", "What? / Why? / Who?", 0.85

        # 3. Negation: Furrowed eyebrows + head turned or body lean
        if eyebrow_state == "furrowed" and (abs(yaw) > 10.0 or body_lean != "center"):
            return "Negation Marker", "No / I disagree", 0.82

        # 4. Role Shift: Gaze left/right + head turn (yaw) + body lean
        if body_lean != "center" and gaze != "center" and abs(yaw) > 12.0:
            direction = "Left" if body_lean == "left" else "Right"
            return f"Role Shift ({direction})", f"[Switch to person on the {direction}]", 0.90

        # 5. Emphasis / Focus: Wide open mouth + forward body shift
        if mouth_state == "open" and mar > 0.22:
            return "Emphasis / Intensive Marker", "Indeed! (Intense / Focus)", 0.80

        # 6. Doubt / Surprise: Raised eyebrows + open mouth
        if eyebrow_state == "raised" and mouth_state == "open":
            return "Surprise / Question", "Really? / What!", 0.83

        # Default Neutral
        return "Neutral", "Neutral sign expression", 0.70

    def classify_sequence(self, feature_sequence: List[Dict[str, Any]]) -> Tuple[str, str, float]:
        """
        Classifies non-manual features over a sequence of video frames (temporal tracking).
        Returns: (grammatical_marker, translation_text, confidence)
        """
        if not feature_sequence:
            return "No Frames", "No frame data provided.", 0.0

        # Check face detection rate
        detected_frames = [f for f in feature_sequence if f.get("face_detected")]
        if len(detected_frames) / len(feature_sequence) < 0.4:
            return "No Face Detected", "Unable to track face across the video.", 0.0

        # Extract temporal arrays
        pitches = [f["head_pose"]["pitch"] for f in detected_frames]
        yaws = [f["head_pose"]["yaw"] for f in detected_frames]
        rolls = [f["head_pose"]["roll"] for f in detected_frames]
        mars = [f["mouth"]["mar"] for f in detected_frames]
        
        eyebrow_states = [f["eyebrows"]["state"] for f in detected_frames]
        body_leans = [f["body"]["lean"] for f in detected_frames]
        gazes = [f["gaze"]["left_gaze"] for f in detected_frames]

        # Calculate standard deviations for head movement oscillations
        std_pitch = np.std(pitches)
        std_yaw = np.std(yaws)
        
        # Count frequency of sign reversals (oscillations) for nodding/shaking
        pitch_diffs = np.diff(pitches)
        yaw_diffs = np.diff(yaws)
        
        # Zero crossing rate of derivatives indicates oscillation
        pitch_crossings = np.sum(np.diff(np.sign(pitch_diffs)) != 0)
        yaw_crossings = np.sum(np.diff(np.sign(yaw_diffs)) != 0)

        # 1. Negation: Active head shaking (yaw changes back and forth) or persistent shake
        # High yaw standard deviation + yaw crossings
        if std_yaw > 6.0 and yaw_crossings >= 2 and std_pitch < std_yaw:
            return "Negation (Head Shake)", "No / Not / I do not", 0.91

        # 2. Affirmation/Assertion: Active head nodding (pitch changes back and forth)
        # High pitch standard deviation + pitch crossings
        if std_pitch > 5.0 and pitch_crossings >= 2 and std_yaw < std_pitch:
            return "Affirmation (Head Nod)", "Yes / Correct / Indeed", 0.89

        # 3. Role Shift: Check if head yaw and body lean are shifted to one side consistently
        # Let's count lean distribution
        left_leans = body_leans.count("left")
        right_leans = body_leans.count("right")
        total_valid = len(detected_frames)
        
        if left_leans / total_valid > 0.5 and np.mean(yaws) > 8.0:
            return "Role Shift (Left)", "[Quotes Person A / Side A]", 0.87
        if right_leans / total_valid > 0.5 and np.mean(yaws) < -8.0:
            return "Role Shift (Right)", "[Quotes Person B / Side B]", 0.87

        # 4. Yes/No Question: Eyebrows raised consistently + head tilts forward
        raised_count = eyebrow_states.count("raised")
        if raised_count / total_valid > 0.5 and np.mean(pitches) > 3.0:
            return "Yes/No Question Marker", "Is that true? / Are you sure?", 0.86

        # 5. Wh- Question: Eyebrows furrowed consistently + head tilts
        furrowed_count = eyebrow_states.count("furrowed")
        if furrowed_count / total_valid > 0.5 and np.mean(pitches) < -2.0:
            return "Wh- Question Marker", "What? / Why? / How?", 0.88

        # 6. Surprise: Eyebrows raised + Mouth open (MAR > 0.15)
        open_mouth_count = sum(1 for m in mars if m > 0.15)
        if raised_count / total_valid > 0.5 and open_mouth_count / total_valid > 0.4:
            return "Doubt / Surprise Marker", "Is it?! (Surprised)", 0.84

        # Fallback to single frame analysis on the middle frame
        mid_idx = len(detected_frames) // 2
        return self.classify_frame(detected_frames[mid_idx])
