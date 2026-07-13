import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

def train_model(csv_path: str, model_output_path: str):
    """
    Loads features from CSV, trains a classifier model,
    saves the serialized model to disk, and prints evaluation metrics.
    """
    print(f"Loading dataset from: {csv_path}")
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found. Please run generate_dataset.py first.")
        return
        
    df = pd.read_csv(csv_path)
    
    # Feature columns (exclude identifiers and label)
    feature_cols = [
        "mean_pitch", "std_pitch", 
        "mean_yaw", "std_yaw", 
        "mean_roll", "std_roll",
        "mean_mar", "max_mar", 
        "mean_left_brow", "mean_right_brow", 
        "mean_shoulder_slope"
    ]
    
    X = df[feature_cols]
    y = df["label"]
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print(f"Training set size: {len(X_train)} samples")
    print(f"Testing set size: {len(X_test)} samples")
    
    # Train
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Predict
    y_pred = clf.predict(X_test)
    
    # Metrics
    acc = accuracy_score(y_test, y_pred)
    print("\n--- MODEL PERFORMANCE ---")
    print(f"Overall Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save Model
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    with open(model_output_path, "wb") as f:
        pickle.dump(clf, f)
        
    print(f"Model saved successfully to {model_output_path}")

if __name__ == "__main__":
    train_model("../../../dataset_extracted.csv", "../models/nmf_classifier.pkl")
