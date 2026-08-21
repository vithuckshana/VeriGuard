# VeriGuard - AI-Powered Multimodal Authentication System

VeriGuard is a prototype for a highly secure, next-generation identity verification system. It moves beyond traditional passwords by implementing a **Zero-Trust Multimodal Biometric Security System**.

## 🛡️ The Purpose of VeriGuard

Traditional authentication systems suffer from severe vulnerabilities:
1. **Passwords can be stolen, guessed, or leaked.**
2. **Basic 2FA (SMS/Email codes) can be intercepted or socially engineered.**
3. **Standard Face Scanners can be spoofed using printed photos or iPad screens.**
4. **Physical access vulnerabilities exist when users log in but step away from their unlocked computers.**

### How VeriGuard Solves This:
VeriGuard implements a 4-step biometric challenge-response system combined with continuous verification to create an impenetrable login flow:

1. **Facial Recognition (Identity):** Replaces or augments the password by mathematically verifying the geometry of the user's face.
2. **Liveness Detection (Anti-Spoofing):** Requires the user to blink or move, proving they are a living human and defeating "printed photo" attacks.
3. **Dynamic Gesture Challenges (Anti-Deepfake):** The system randomly asks the user to hold up a specific hand gesture (e.g., "Open Palm", "Peace Sign"). Because the challenge is random, a hacker cannot bypass the system with a pre-recorded deepfake video.
4. **Continuous Verification (Zero-Trust Session):** Once logged in, the application quietly verifies the webcam feed every few seconds. If the authorized user walks away from the desk, the system detects a missing or unauthorized face and instantly locks the session.

## 🏗️ Architecture

VeriGuard is built using a modern full-stack architecture separated into distinct layers:

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Webcam Integration:** `react-webcam`
- **Features:** A multi-step authentication wizard, and an Admin Security Dashboard that displays active sessions, locks, and security alerts.

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite (via SQLAlchemy)
- **AI Processing Layer:** Designed to utilize OpenCV and Google MediaPipe for Face Mesh (liveness) and Hand Tracking (gestures). *(Note: The initial prototype utilizes a mocked AI service layer to demonstrate the architecture and UI flow without heavy computer vision dependencies).*

## 🚀 How to Run Locally

### 1. Start the Backend API
Navigate to the `backend` folder, activate the virtual environment, and start the FastAPI server:
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API will run on `http://localhost:8000`.

### 2. Start the Frontend Dashboard
Open a new terminal, navigate to the `frontend` folder, and start the Next.js development server:
```bash
cd frontend
npm run dev
```
The frontend UI will run on `http://localhost:3000`.

> **Note on Browser Camera Security:** Modern browsers require HTTPS or `localhost` to access the webcam. Ensure you access the frontend via `http://localhost:3000` so the browser allows the camera permissions.

## 🔮 Future Enhancements
- Replace the mock `ai_service.py` with actual `OpenCV` and `MediaPipe` integration.
- Store facial encodings securely as encrypted vectors in PostgreSQL.
- Implement deep-learning-based anti-spoofing models.
