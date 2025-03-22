import cv2
import base64
import json
import sys
import time

def live_face_detection():
    haar_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(haar_cascade_path)

    if face_cascade.empty():
        print("Error: Haar cascade file not found or could not be loaded.")
        sys.exit(1)

    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print("Error: Could not access the webcam.")
        sys.exit(1)

    print("Starting live face detection. Press 'q' to quit.")

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Error: Failed to capture frame from webcam.")
            break

        frame = cv2.resize(frame, (640, 480))
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if gray_frame is None:
            print("Error: Failed to convert frame to grayscale.")
            continue

        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20))

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        if len(faces) > 0:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')

            try:
                print(json.dumps({"frame": frame_base64}))
                sys.stdout.flush()
            except Exception as e:
                print(f"Error sending frame: {e}")
                break

        cv2.imshow('Live Face Detection', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        time.sleep(0.1)

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    live_face_detection()

