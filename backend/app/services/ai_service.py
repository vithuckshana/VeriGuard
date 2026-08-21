import random

def extract_face_encoding(image_base64: str):
    # Mocking face encoding extraction. In reality, decode base64, run through MediaPipe/OpenCV.
    # Return a random 128-d vector for simulation.
    return [random.random() for _ in range(128)]

def compare_faces(encoding1, encoding2, tolerance=0.6):
    # Mock face comparison.
    if not encoding1 or not encoding2:
        return False
    # Just returning True for the simulation if they exist
    return True

def verify_liveness(image_base64: str):
    # Mock liveness (e.g. check for a blink).
    # Return True simulating a successful blink detection.
    return True

def verify_gesture(image_base64: str, expected_gesture: str):
    # Mock gesture detection.
    # Return True simulating the gesture was correctly detected.
    return True
