import cv2
import csv
import os
from datetime import datetime

from app.ml.extractor import FeatureExtractor


DATASET_PATH = "dataset_extracted.csv"


labels = [
    "Neutral",
    "Yes",
    "No",
    "Question",
    "WH Question"
]


def save_sample(features, label):

    row = {
        "timestamp": datetime.now().isoformat(),

        "mean_pitch": features["head_pose"]["pitch"],
        "std_pitch": 0,

        "mean_yaw": features["head_pose"]["yaw"],
        "std_yaw": 0,

        "mean_roll": features["head_pose"]["roll"],
        "std_roll": 0,

        "mean_mar": features["mouth"]["mar"],
        "max_mar": features["mouth"]["mar"],

        "mean_left_brow": features["eyebrows"]["left_height_ratio"],
        "mean_right_brow": features["eyebrows"]["right_height_ratio"],

        "mean_shoulder_slope": features["body"]["shoulder_slope"],

        "label": label
    }


    file_exists = os.path.exists(DATASET_PATH)

    with open(DATASET_PATH, "a", newline="") as f:

        writer = csv.DictWriter(
            f,
            fieldnames=row.keys()
        )

        if not file_exists:
            writer.writeheader()

        writer.writerow(row)



def main():

    extractor = FeatureExtractor()

    cap = cv2.VideoCapture(0)


    print("\n==============================")
    print(" ISL NON MANUAL DATA COLLECTOR")
    print("==============================")

    print("\nPress:")
    print("1 - Neutral")
    print("2 - Yes")
    print("3 - No")
    print("4 - Question")
    print("5 - WH Question")
    print("q - Quit")


    current_label = None


    while True:

        ret, frame = cap.read()

        if not ret:
            break


        features = extractor.extract_features(frame)


        cv2.putText(
            frame,
            f"Label: {current_label}",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,255,0),
            2
        )


        cv2.imshow(
            "ISL Dataset Collector",
            frame
        )


        key = cv2.waitKey(1) & 0xff


        if key == ord('1'):
            current_label = "Neutral"
            print("Collecting Neutral")


        elif key == ord('2'):
            current_label = "Yes"
            print("Collecting Yes")


        elif key == ord('3'):
            current_label = "No"
            print("Collecting No")


        elif key == ord('4'):
            current_label = "Question"
            print("Collecting Question")


        elif key == ord('5'):
            current_label = "WH Question"
            print("Collecting WH Question")


        elif key == ord('s'):

            if current_label:

                save_sample(
                    features,
                    current_label
                )

                print(
                    "Saved:",
                    current_label
                )


        elif key == ord('q'):
            break



    cap.release()
    cv2.destroyAllWindows()
    extractor.close()



if __name__ == "__main__":
    main()