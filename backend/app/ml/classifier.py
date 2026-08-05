import numpy as np
from typing import Dict, Any, List, Tuple


class ISLClassifier:

    """
    ISL Non-Manual Feature Classifier

    Detects:
    - Yes/No questions
    - WH questions
    - Negation
    - Affirmation
    - Role shift
    - Emphasis
    - Neutral expressions

    Combines:
    - Eyebrows
    - Mouth movement
    - Head pose
    - Eye gaze
    - Body lean
    """


    def __init__(self):

        self.previous_states = []

        self.history_size = 10



    # =====================================================
    # SINGLE FRAME CLASSIFICATION
    # =====================================================

    def classify_frame(
        self,
        features: Dict[str, Any]
    ) -> Tuple[str, str, float]:


        if not features.get("face_detected"):

            return (
                "No Face",
                "Face not detected",
                0.0
            )


        eyebrows = features.get(
            "eyebrows",
            {}
        )


        mouth = features.get(
            "mouth",
            {}
        )


        head_pose = features.get(
            "head_pose",
            {}
        )


        gaze = features.get(
            "gaze",
            {}
        )


        body = features.get(
            "body",
            {}
        )



        eyebrow_state = eyebrows.get(
            "state",
            "normal"
        )


        mouth_state = mouth.get(
            "state",
            "closed"
        )


        mar = float(
            mouth.get(
                "mar",
                0
            )
        )


        pitch = float(
            head_pose.get(
                "pitch",
                0
            )
        )


        yaw = float(
            head_pose.get(
                "yaw",
                0
            )
        )


        roll = float(
            head_pose.get(
                "roll",
                0
            )
        )


        lean = body.get(
            "lean",
            "center"
        )


        left_gaze = gaze.get(
            "left_gaze",
            "center"
        )


        right_gaze = gaze.get(
            "right_gaze",
            "center"
        )



        # Store current state for smoothing

        current = {

            "eyebrow": eyebrow_state,

            "pitch": pitch,

            "yaw": yaw,

            "mouth": mar

        }


        self.previous_states.append(
            current
        )


        if len(self.previous_states) > self.history_size:

            self.previous_states.pop(0)



        # =================================================
        # YES / NO QUESTION
        # Raised eyebrows + slight head movement
        # =================================================


        if (

            eyebrow_state == "raised"

            and pitch > -15

        ) or (

            eyebrow_state == "raised"

            and mar > 0.05

        ):


            return (

                "Yes/No Question Marker",

                "Question detected",

                0.90

            )



        # =================================================
        # WH QUESTION
        # Furrowed eyebrows + head movement
        # =================================================


        if (

            eyebrow_state == "furrowed"

            and abs(yaw) > 3

        ) or (

            eyebrow_state == "furrowed"

            and abs(pitch) > 3

        ):


            return (

                "WH Question Marker",

                "What / Why / How",

                0.88

            )



        # =================================================
        # NEGATION
        # Head shake detection
        # =================================================


        if abs(yaw) > 12:


            return (

                "Negation Marker",

                "No / Not",

                0.87

            )



        # =================================================
        # ROLE SHIFT
        # Change in body position/gaze
        # =================================================


        if (

            lean != "center"

            or left_gaze != "center"

            or right_gaze != "center"

        ):


            return (

                "Role Shift",

                "Speaker change detected",

                0.84

            )



        # =================================================
        # EMPHASIS
        # Mouth opening intensity
        # =================================================


        if mar > 0.20:


            return (

                "Mouth Emphasis Marker",

                "Intensive expression",

                0.82

            )



        # =================================================
        # DEFAULT
        # =================================================


        return (

            "Neutral Non-manual Feature",

            "No grammatical marker detected",

            0.70

        )
    # =====================================================
    # SEQUENCE CLASSIFICATION (VIDEO)
    # =====================================================

    def classify_sequence(
        self,
        sequence: List[Dict[str, Any]]
    ):


        if not sequence:

            return (

                "No Data",

                "No frames",

                0.0

            )



        yaw_values = []

        pitch_values = []

        eyebrow_changes = 0



        previous_eyebrow = None



        for frame in sequence:


            if not frame.get(
                "face_detected"
            ):

                continue



            head = frame.get(
                "head_pose",
                {}
            )


            eyebrows = frame.get(
                "eyebrows",
                {}
            )



            yaw_values.append(
                float(
                    head.get(
                        "yaw",
                        0
                    )
                )
            )


            pitch_values.append(
                float(
                    head.get(
                        "pitch",
                        0
                    )
                )
            )



            current_eyebrow = eyebrows.get(
                "state",
                "normal"
            )



            if (

                previous_eyebrow is not None

                and current_eyebrow != previous_eyebrow

            ):

                eyebrow_changes += 1



            previous_eyebrow = current_eyebrow




        if len(yaw_values) < 3:


            return self.classify_frame(
                sequence[-1]
            )



        yaw_change = np.std(
            yaw_values
        )


        pitch_change = np.std(
            pitch_values
        )



        # ================================================
        # HEAD SHAKE
        # LEFT <-> RIGHT
        # ================================================


        if yaw_change > 6:


            return (

                "Negation Marker",

                "No / Not",

                0.91

            )



        # ================================================
        # HEAD NOD
        # UP <-> DOWN
        # ================================================


        if pitch_change > 6:


            return (

                "Affirmation Marker",

                "Yes / Correct",

                0.90

            )



        # ================================================
        # EYEBROW MOVEMENT
        # ================================================


        if eyebrow_changes >= 3:


            return (

                "Question Marker",

                "Facial grammatical marker detected",

                0.86

            )



        return self.classify_frame(
            sequence[-1]
        )



    # =====================================================
    # HAND + NON MANUAL FUSION
    # =====================================================


    def fuse_translation(
        self,
        hand_gesture: str,
        marker: str
    ) -> str:


        if not hand_gesture:

            hand_gesture = "Unknown"



        # Remove dynamic suffix

        base_gesture = hand_gesture.split(
            "_"
        )[0]



        # =================================================
        # MANUAL SIGN AVAILABLE
        # =================================================


        if base_gesture not in [

            "Unknown",

            "No Hand"

        ]:



            # -------------------------------
            # QUESTION
            # -------------------------------


            if marker == "Yes/No Question Marker":


                question_map = {


                    "HELLO":
                        "Hello, how are you?",


                    "YES":
                        "Is that a yes?",


                    "NO":
                        "Are you saying no?",


                    "YOU":
                        "Is it you?",


                    "THANK YOU":
                        "Are you thanking me?",


                    "CALL ME":
                        "Can you call me?",


                    "OK":
                        "Is everything okay?",


                    "PLEASE":
                        "Would you please?"

                }


                return question_map.get(

                    base_gesture,

                    f"Is it {base_gesture}?"

                )




            # -------------------------------
            # WH QUESTION
            # -------------------------------


            if marker == "WH Question Marker":


                wh_map = {


                    "YOU":
                        "Who are you?",


                    "HELLO":
                        "Who is saying hello?",


                    "NO":
                        "Why not?",


                    "CALL ME":
                        "When will you call me?",


                    "PLEASE":
                        "What do you need?"

                }


                return wh_map.get(

                    base_gesture,

                    f"What is {base_gesture}?"

                )




            # -------------------------------
            # NEGATION
            # -------------------------------


            if marker == "Negation Marker":


                if base_gesture == "NO":

                    return "No, absolutely not."



                if base_gesture == "YES":

                    return "Actually, no."



                return (

                    "No "

                    + base_gesture.lower()

                    + "."

                )




            # -------------------------------
            # AFFIRMATION
            # -------------------------------


            if marker == "Affirmation Marker":


                return (

                    "Yes, "

                    + base_gesture.lower()

                    + "."

                )



            # -------------------------------
            # EMPHASIS
            # -------------------------------


            if marker == "Mouth Emphasis Marker":


                emphasis_map = {


                    "THANK YOU":
                        "Thank you so much!",


                    "I LOVE YOU":
                        "I love you very much!",


                    "HELLO":
                        "A very warm hello!",


                    "NO":
                        "No, never!",


                    "OK":
                        "Excellent, everything is great!"

                }


                return emphasis_map.get(

                    base_gesture,

                    f"Strongly expressing {base_gesture}"

                )




            # -------------------------------
            # ROLE SHIFT
            # -------------------------------


            if marker == "Role Shift":


                return (

                    "[Dialogue Switch] "

                    + base_gesture

                )




            # -------------------------------
            # NORMAL SIGN
            # -------------------------------


            normal_map = {


                "HELLO":
                    "Hello.",


                "YES":
                    "Yes.",


                "NO":
                    "No.",


                "THANK YOU":
                    "Thank you.",


                "YOU":
                    "You.",


                "OK":
                    "OK.",


                "I LOVE YOU":
                    "I love you.",


                "CALL ME":
                    "Call me.",


                "WELCOME":
                    "Welcome.",


                "PLEASE":
                    "Please.",


                "NAMASTE":
                    "Namaste.",


                "ROCK ON":
                    "Cool."

            }



            return normal_map.get(

                base_gesture,

                base_gesture

            )



        # =================================================
        # ONLY NON MANUAL FEATURE DETECTED
        # =================================================


        if marker == "Yes/No Question Marker":


            return (

                "Asking a question"

            )


        if marker == "WH Question Marker":


            return (

                "Inquiring: What / Why / How"

            )



        if marker == "Negation Marker":


            return (

                "Expressing No / Not"

            )



        if marker == "Affirmation Marker":


            return (

                "Expressing Yes / Correct"

            )



        if marker == "Role Shift":


            return (

                "Dialogue role change"

            )



        if marker == "Mouth Emphasis Marker":


            return (

                "Expressing strong emotion"

            )



        return (

            "Awaiting signs"

        )