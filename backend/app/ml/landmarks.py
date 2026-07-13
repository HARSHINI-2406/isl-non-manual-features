# MediaPipe Face Mesh Landmark Indices
# Ref: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png

# Eyebrows
LEFT_EYEBROW_INDEXES = [70, 63, 105, 66, 107]
RIGHT_EYEBROW_INDEXES = [300, 293, 334, 296, 336]

# Eyes (Upper & Lower boundaries to measure vertical opening)
LEFT_EYE_TOP = 159
LEFT_EYE_BOTTOM = 145
RIGHT_EYE_TOP = 386
RIGHT_EYE_BOTTOM = 374

# Iris indices for gaze detection (MediaPipe 478 landmarks)
LEFT_IRIS = [468, 469, 470, 471, 472]
RIGHT_IRIS = [473, 474, 475, 476, 477]
LEFT_EYE_LEFT_CORNER = 33
LEFT_EYE_RIGHT_CORNER = 133
RIGHT_EYE_LEFT_CORNER = 362
RIGHT_EYE_RIGHT_CORNER = 263

# Lips
LIP_UPPER_OUTER = 37
LIP_LOWER_OUTER = 84
LIP_LEFT_CORNER = 61
LIP_RIGHT_CORNER = 291
LIP_UPPER_INNER = 13
LIP_LOWER_INNER = 14

# SolvePnP Face Points for Head Pose Estimation (3D standard coordinates)
# Nose tip, Chin, Left eye left corner, Right eye right corner, Left mouth corner, Right mouth corner
PNP_FACE_LANDMARKS = [1, 152, 33, 263, 61, 291]

# Pose Landmark Indices (MediaPipe Pose)
SHOULDER_LEFT = 11
SHOULDER_RIGHT = 12
NOSE = 0
