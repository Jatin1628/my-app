import cv2
import base64
import json
import sys
import time

def live_face_detection():
    haar_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    print(f"Haar cascade path: {haar_cascade_path}")
    face_cascade = cv2.CascadeClassifier(haar_cascade_path)

    if face_cascade.empty():
        print("Error: Haar cascade file not found or could not be loaded.")
        sys.exit(1)

    # Try different video capture APIs
    for api in [cv2.CAP_DSHOW, cv2.CAP_MSMF, 0]:
        video_capture = cv2.VideoCapture(api)
        if video_capture.isOpened():
            print(f"Video capture opened using API {api}")
            break
    else:
        print("Error: Could not open video capture using any API")
        sys.exit(1)

    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Error: Failed to capture frame from webcam.")
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    live_face_detection()