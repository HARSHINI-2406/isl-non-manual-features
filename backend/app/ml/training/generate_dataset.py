import os
import cv2
import pandas as pd
import numpy as np
from app.ml.extractor import FeatureExtractor

def build_dataset(data_dir: str, output_csv: str):
    """
    Scans a directory of sign language videos organized by label folders,
    extracts NMF features, and outputs a structured CSV file for training.
    
    Structure of data_dir:
    data_dir/
      negation/
        video1.mp4
        video2.mp4
      assertion/
        video3.mp4
      question/
        video4.mp4
    """
    extractor = FeatureExtractor()
    dataset = []

    print(f"Scanning directory: {data_dir}")
    if not os.path.exists(data_dir):
        print(f"Error: Directory {data_dir} does not exist. Creating a placeholder folder...")
        os.makedirs(data_dir, exist_ok=True)
        # Create a sample label directory structure
        os.makedirs(os.path.join(data_dir, "negation"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "assertion"), exist_ok=True)
        os.makedirs(os.path.join(data_dir, "question"), exist_ok=True)
        print("Please place sign videos in the generated subfolders and run again.")
        return

    labels = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
    
    for label in labels:
        label_dir = os.path.join(data_dir, label)
        videos = [f for f in os.listdir(label_dir) if f.endswith(('.mp4', '.avi', '.mov'))]
        print(f"Found {len(videos)} videos for label: '{label}'")
        
        for video_file in videos:
            video_path = os.path.join(label_dir, video_file)
            cap = cv2.VideoCapture(video_path)
            
            frame_features = []
            success = True
            while success:
                success, frame = cap.read()
                if not success or frame is None:
                    break
                
                features = extractor.extract_features(frame)
                if features["face_detected"]:
                    frame_features.append(features)
            
            cap.release()
            
            if len(frame_features) < 5:
                continue
                
            # Aggregate video-level temporal features (mean & std of angles and ratios)
            pitches = [f["head_pose"]["pitch"] for f in frame_features]
            yaws = [f["head_pose"]["yaw"] for f in frame_features]
            rolls = [f["head_pose"]["roll"] for f in frame_features]
            mars = [f["mouth"]["mar"] for f in frame_features]
            left_brows = [f["eyebrows"]["left_height_ratio"] for f in frame_features]
            right_brows = [f["eyebrows"]["right_height_ratio"] for f in frame_features]
            shoulder_slopes = [f["body"]["shoulder_slope"] for f in frame_features]
            
            row = {
                "video_name": video_file,
                "mean_pitch": np.mean(pitches),
                "std_pitch": np.std(pitches),
                "mean_yaw": np.mean(yaws),
                "std_yaw": np.std(yaws),
                "mean_roll": np.mean(rolls),
                "std_roll": np.std(rolls),
                "mean_mar": np.mean(mars),
                "max_mar": np.max(mars),
                "mean_left_brow": np.mean(left_brows),
                "mean_right_brow": np.mean(right_brows),
                "mean_shoulder_slope": np.mean(shoulder_slopes),
                "label": label
            }
            dataset.append(row)
            print(f"Processed: {video_file} -> extracted {len(frame_features)} frames")

    if dataset:
        df = pd.DataFrame(dataset)
        df.to_csv(output_csv, index=False)
        print(f"Dataset compiled and saved to {output_csv} with {len(df)} samples.")
    else:
        # Save a mock CSV file if no videos were found, so user has a sample
        mock_data = pd.DataFrame([
            {
                "video_name": "sample_negation.mp4",
                "mean_pitch": 0.5, "std_pitch": 1.2, "mean_yaw": -1.5, "std_yaw": 8.5,
                "mean_roll": 0.2, "std_roll": 0.9, "mean_mar": 0.04, "max_mar": 0.06,
                "mean_left_brow": 0.21, "mean_right_brow": 0.22, "mean_shoulder_slope": 0.01,
                "label": "negation"
            },
            {
                "video_name": "sample_assertion.mp4",
                "mean_pitch": 2.1, "std_pitch": 6.4, "mean_yaw": 0.2, "std_yaw": 0.8,
                "mean_roll": -0.1, "std_roll": 0.5, "mean_mar": 0.03, "max_mar": 0.05,
                "mean_left_brow": 0.28, "mean_right_brow": 0.27, "mean_shoulder_slope": 0.02,
                "label": "assertion"
            },
            {
                "video_name": "sample_question.mp4",
                "mean_pitch": -1.2, "std_pitch": 1.5, "mean_yaw": -0.5, "std_yaw": 0.9,
                "mean_roll": 0.4, "std_roll": 0.8, "mean_mar": 0.12, "max_mar": 0.18,
                "mean_left_brow": 0.42, "mean_right_brow": 0.43, "mean_shoulder_slope": -0.04,
                "label": "question"
            }
        ])
        mock_data.to_csv(output_csv, index=False)
        print(f"Created template mock dataset CSV at {output_csv}.")

if __name__ == "__main__":
    build_dataset("../../../dataset_raw", "../../../dataset_extracted.csv")
