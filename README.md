# Frontend - Voice Agent with Avatar & Clinic Assistant

This is the frontend application for the Voice Agent project, built with **React** and **Vite**. It handles the user interface, WebRTC connection via LiveKit, and renders the visual avatar.

## 🚀 Key Features

*   **Framework**: Built with React & Vite for fast performance.
*   **WebRTC**: Uses `@livekit/components-react` for real-time video/audio connection.
*   **Media Handling**: Manages microphone input, optional camera input, and renders the Avatar video stream.
*   **Live Transcripts**: Displays real-time conversation transcripts.

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js installed.
*   Backend services running (see `backend/README.md`).

### Local Development

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

    The app will typically run on `http://localhost:5173` (check the console output).
