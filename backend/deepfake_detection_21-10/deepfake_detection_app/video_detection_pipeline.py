###Fake Video Detection Using LSTM
#import Libraries
import numpy as np
from tensorflow.keras.models import load_model
import cv2
import os


###new 09
# Load the pre-trained model
loaded_model = load_model("C:\\Users\\deepfake_folder_sahi\\deepfake_detection_02aug_sathi\\deep_fake_folder_16aug_new\\deepfake_detection_app\\fake_video_detection.h5")
print(loaded_model, "-------------load model done")

def extract_frames(video_path, max_frames=20, img_size=(128, 128)):
    cap = cv2.VideoCapture(video_path)
    frames = []
    count = 0
    while count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, img_size)
        frames.append(frame)
        count += 1
    cap.release()
    return np.array(frames)

def extract_frames_from_folder(source_path, max_frames=20, img_size=(128, 128), extensions=('.mp4', '.avi', '.mov')):
    video_data = {}

    if os.path.isdir(source_path):
        for video_file in os.listdir(source_path):
            if video_file.lower().endswith(extensions):
                video_path = os.path.join(source_path, video_file)
                frames = extract_frames(video_path, max_frames, img_size)
                if len(frames) == max_frames:
                    video_data[video_file] = frames
    elif os.path.isfile(source_path) and source_path.lower().endswith(extensions):
        video_file = os.path.basename(source_path)
        frames = extract_frames(source_path, max_frames, img_size)
        if len(frames) == max_frames:
            video_data[video_file] = frames
    else:
        print(f"Invalid source path: {source_path}")

    return video_data


####new 13/08/2024 long with real fake
def classify_videos_in_folder(model, source_path, max_frames=20, img_size=(128, 128)):
    video_data = extract_frames_from_folder(source_path, max_frames, img_size)
    results = {}

    for video_file, frames in video_data.items():
        frames = np.expand_dims(frames, axis=0)
        prediction = model.predict(frames)

        # If the model returns a single probability for "Fake"
        fake_percentage = prediction[0][0] * 100
        real_percentage = (1 - prediction[0][0]) * 100

        predicted_class = 'Fake' if fake_percentage > 50 else 'Real'
        results[video_file] = {
            'predicted_class': predicted_class,
            'fake_percentage': f'{fake_percentage:.2f}%',
            'real_percentage': f'{real_percentage:.2f}%'
        }

    # Convert the results dictionary to a list of dictionaries
    data = list(results.values())
    return data


