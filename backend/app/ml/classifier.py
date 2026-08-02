import numpy as np
from typing import Dict, Any, List, Tuple


class ISLClassifier:


    def classify_frame(
        self,
        features:Dict[str,Any]
    )->Tuple[str,str,float]:


        if not features.get("face_detected"):

            return (
                "No Face",
                "Face not detected",
                0.0
            )



        eyebrow = features.get(
            "eyebrows",
            {}
        )

        mouth = features.get(
            "mouth",
            {}
        )

        head = features.get(
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


        eyebrow_state = eyebrow.get(
            "state",
            "normal"
        )


        mouth_state = mouth.get(
            "state",
            "closed"
        )


        mar = mouth.get(
            "mar",
            0
        )


        pitch = head.get(
            "pitch",
            0
        )


        yaw = head.get(
            "yaw",
            0
        )


        lean = body.get(
            "lean",
            "center"
        )


        left_gaze = gaze.get(
            "left_gaze",
            "center"
        )




        # --------------------------
        # YES / NO QUESTION
        # --------------------------

        if (
            eyebrow_state=="raised"
            or pitch>5
        ):

            return (

                "Yes/No Question Marker",

                "Question detected",

                0.90
            )




        # --------------------------
        # WH QUESTION
        # --------------------------

        if (

            eyebrow_state=="furrowed"

            or abs(pitch)>5

        ):

            return (

                "WH Question Marker",

                "What / Why / How",

                0.88
            )





        # --------------------------
        # NEGATION
        # --------------------------

        if abs(yaw)>8:


            return (

                "Negation Marker",

                "No / Not",

                0.87
            )





        # --------------------------
        # ROLE SHIFT
        # --------------------------

        if (

            lean!="center"

            or left_gaze!="center"

        ):


            return (

                "Role Shift",

                "Speaker change detected",

                0.85
            )






        # --------------------------
        # EMPHASIS
        # --------------------------

        if mar>0.15:


            return (

                "Mouth Emphasis Marker",

                "Intensive expression",

                0.82
            )





        return (

            "Neutral Non-manual Feature",

            "No grammatical marker detected",

            0.70

        )






    def classify_sequence(
        self,
        sequence:List[Dict[str,Any]]
    ):


        if not sequence:

            return (
                "No Data",
                "No frames",
                0
            )


        yaw=[]

        pitch=[]


        for f in sequence:


            if f.get("face_detected"):


                yaw.append(
                    f["head_pose"]["yaw"]
                )


                pitch.append(
                    f["head_pose"]["pitch"]
                )



        if len(yaw)<3:

            return self.classify_frame(
                sequence[-1]
            )





        yaw_change=np.std(yaw)

        pitch_change=np.std(pitch)




        # HEAD SHAKE

        if yaw_change>5:


            return (

                "Negation Marker",

                "No / Not",

                0.91

            )





        # HEAD NOD


        if pitch_change>5:


            return (

                "Affirmation Marker",

                "Yes / Correct",

                0.90

            )




        return self.classify_frame(
            sequence[-1]
        )

    def fuse_translation(self, hand_gesture: str, marker: str) -> str:
        # Normalize hand gesture string
        if not hand_gesture:
            hand_gesture = "Unknown"
            
        # Extract base gesture if it has temporal/dynamic suffix (e.g. HELLO_MOVING -> HELLO)
        base_gesture = hand_gesture.split("_")[0]
            
        # If there is a manual hand gesture
        if base_gesture not in ["Unknown", "No Hand"]:
            if marker == "Yes/No Question Marker":
                if base_gesture == "HELLO":
                    return "Hello! How are you doing?"
                elif base_gesture == "YES" or base_gesture == "EXCELLENT":
                    return "Is that a yes?"
                elif base_gesture == "THANK YOU":
                    return "Are you thanking me?"
                elif base_gesture == "NO":
                    return "Are you saying no?"
                elif base_gesture == "YOU":
                    return "Is it you?"
                elif base_gesture == "OK":
                    return "Is everything okay?"
                elif base_gesture == "I LOVE YOU":
                    return "Do you love me?"
                elif base_gesture == "CALL ME":
                    return "Can you call me?"
                elif base_gesture == "PLEASE" or base_gesture == "NAMASTE":
                    return "Would you please?"
                elif base_gesture == "ROCK ON":
                    return "Are you having fun?"
                elif base_gesture == "WELCOME":
                    return "Are you welcoming me?"
            elif marker == "WH Question Marker":
                if base_gesture == "YOU":
                    return "Who are you?"
                elif base_gesture == "HELLO":
                    return "Who is saying hello?"
                elif base_gesture == "NO":
                    return "Why not?"
                elif base_gesture == "YES":
                    return "Why yes?"
                elif base_gesture == "PLEASE" or base_gesture == "NAMASTE":
                    return "What do you need, please?"
                elif base_gesture == "CALL ME":
                    return "When will you call me?"
                else:
                    return f"What or why is '{base_gesture}'?"
            elif marker == "Negation Marker":
                if base_gesture in ["YES", "EXCELLENT"]:
                    return "Actually, no."
                elif base_gesture == "NO":
                    return "No, absolutely not!"
                elif base_gesture == "HELLO":
                    return "No, I will not say hello."
                elif base_gesture == "THANK YOU":
                    return "No need to thank me."
                elif base_gesture == "OK":
                    return "No, it is not okay."
                elif base_gesture == "YOU":
                    return "No, not you."
                elif base_gesture in ["PLEASE", "NAMASTE"]:
                    return "Please, don't do that."
                elif base_gesture == "CALL ME":
                    return "Do not call me."
                else:
                    return f"No {base_gesture.lower()}."
            elif marker == "Affirmation Marker":
                if base_gesture in ["YES", "EXCELLENT"]:
                    return "Yes, indeed!"
                elif base_gesture == "THANK YOU":
                    return "Yes, sincere thanks!"
                elif base_gesture == "OK":
                    return "Perfect, everything is OK."
                elif base_gesture == "HELLO":
                    return "Yes, hello!"
                elif base_gesture == "YOU":
                    return "Yes, it is you."
                elif base_gesture in ["PLEASE", "NAMASTE"]:
                    return "Yes, please."
                else:
                    return f"Yes, {base_gesture.lower()}."
            elif marker == "Mouth Emphasis Marker":
                if base_gesture == "THANK YOU":
                    return "Thank you so much!"
                elif base_gesture == "I LOVE YOU":
                    return "I love you very much!"
                elif base_gesture == "HELLO":
                    return "A very warm hello!"
                elif base_gesture == "NO":
                    return "No, never!"
                elif base_gesture == "OK":
                    return "Excellent, everything is great!"
                elif base_gesture == "ROCK ON":
                    return "Absolutely rocks!"
                else:
                    return f"Emphasized: {base_gesture}!"
            elif marker == "Role Shift":
                return f"[Dialogue Switch] {base_gesture}"
            else: # Neutral or normal
                if base_gesture == "HELLO":
                    return "Hello."
                elif base_gesture in ["YES", "EXCELLENT"]:
                    return "Yes."
                elif base_gesture == "THANK YOU":
                    return "Thank you."
                elif base_gesture == "NO":
                    return "No."
                elif base_gesture == "YOU":
                    return "You."
                elif base_gesture == "OK":
                    return "OK."
                elif base_gesture == "I LOVE YOU":
                    return "I love you."
                elif base_gesture == "CALL ME":
                    return "Call me."
                elif base_gesture == "ROCK ON":
                    return "Rocks / Cool."
                elif base_gesture in ["PLEASE", "NAMASTE"]:
                    return "Please."
                elif base_gesture == "WELCOME":
                    return "Welcome."
                
        # If no hand gesture is detected, but a non-manual feature is present:
        if marker == "Yes/No Question Marker":
            return "Asking a question (e.g., Is it? / Are you?)"
        elif marker == "WH Question Marker":
            return "Inquiring (e.g., What? / Why? / How?)"
        elif marker == "Negation Marker":
            return "Expressing negation (e.g., No / Not)"
        elif marker == "Affirmation Marker":
            return "Expressing affirmation (e.g., Yes / Correct)"
        elif marker == "Role Shift":
            return "Role Shift (Dialogue/Character change)"
        elif marker == "Mouth Emphasis Marker":
            return "Expressing emphasis / intensity"
            
        return "Awaiting signs (Show hand gesture or facial expression)"