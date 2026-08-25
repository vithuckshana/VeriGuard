import cv2
import numpy as np
import base64
import mediapipe as mp
import math

mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands

# Initialize models globally to significantly reduce loading time for each request
face_mesh_detector = mp_face_mesh.FaceMesh(
    static_image_mode=True, 
    max_num_faces=1, 
    refine_landmarks=True, 
    min_detection_confidence=0.3
)
hands_detector = mp_hands.Hands(
    static_image_mode=True, 
    max_num_hands=1, 
    min_detection_confidence=0.5
)

def base64_to_cv2(image_base64: str):
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]
    img_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def extract_face_encoding(image_base64: str):
    img = base64_to_cv2(image_base64)
    if img is None:
        return None
    
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_mesh_detector.process(img_rgb)
    
    if not results.multi_face_landmarks:
        return None
    
    encoding = []
    for landmark in results.multi_face_landmarks[0].landmark:
        encoding.extend([landmark.x, landmark.y, landmark.z])
    return encoding

def compare_faces(encoding1, encoding2, tolerance=0.15):
    if not encoding1 or not encoding2:
        return False
    
    vec1 = np.array(encoding1)
    vec2 = np.array(encoding2)
    distance = np.linalg.norm(vec1 - vec2)
    avg_distance = distance / len(vec1)
    return avg_distance < tolerance

def verify_liveness(image_base64: str):
    img = base64_to_cv2(image_base64)
    if img is None:
        return False
        
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = face_mesh_detector.process(img_rgb)
    
    if results.multi_face_landmarks:
        return True
    return False

def verify_gesture(image_base64: str, expected_gesture: str):
    img = base64_to_cv2(image_base64)
    if img is None:
        return False
        
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(img_rgb)
    
    if not results.multi_hand_landmarks:
        return False
        
    hand_landmarks = results.multi_hand_landmarks[0].landmark
    
    fingers = [0, 0, 0, 0, 0]
    
    if hand_landmarks[4].x < hand_landmarks[3].x: 
        fingers[0] = 1
        
    tip_ids = [8, 12, 16, 20]
    pip_ids = [6, 10, 14, 18]
    for i in range(4):
        if hand_landmarks[tip_ids[i]].y < hand_landmarks[pip_ids[i]].y:
            fingers[i+1] = 1
            
    detected_gesture = "Unknown"
    if fingers == [1, 1, 1, 1, 1]:
        detected_gesture = "Open Palm"
    elif fingers == [0, 0, 0, 0, 0] or fingers == [1, 0, 0, 0, 0]:
        detected_gesture = "Closed Fist"
    elif fingers == [0, 1, 1, 0, 0] or fingers == [1, 1, 1, 0, 0]:
        detected_gesture = "Peace Sign"
    elif fingers == [1, 0, 0, 0, 0]:
        detected_gesture = "Thumbs Up"
    
    return detected_gesture.lower() == expected_gesture.lower()
