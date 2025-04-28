# Deepfake Detection with Explainable AI

**Author:** Rohit Tripathi  
**Master’s Project | California State University, Sacramento**  
**Committee Chair:** Dr. Syed Badruddoja  
**Second Reader:** Dr. Anna Baynes  
**Semester:** Spring 2025

---

## 📚 Overview

This project presents a deepfake detection system enhanced with Explainable AI (XAI) Grad-CAM++. Users can upload images, videos, or capture webcam inputs via a web application for real-time fake media detection and receive visual explanations.

---

## 🛠️ System Requirements

- Python 3.8+
- Node.js 14+
- npm 6+
- TensorFlow 2.x
- Flask
- React.js
- Google Chrome (recommended)

---

## 📂 Project Structure

```
Deepfake-Detection-XAI/
|├── frontend/               # React frontend
|├── backend/                # Flask backend
|   ├── deepfake_detection_21-10/
|       ├── fake-image-detection.ipynb  # Training Notebook for Images
|       ├── fake-video-detection.ipynb  # Training Notebook for Videos
|       ├── manage.py
|       └── Preprocessing, API Scripts
|└── README.md
```

---

## 🚀 Installation Instructions

### Backend Setup

```bash
cd backend/deepfake_detection_21-10
pip install -r requirements.txt
python manage.py
```

- Flask backend will start at `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

- React frontend will start at `http://localhost:3000`

---

## 📊 How to Run (Train/Test)

### Testing the Model

1. Register or login through the web interface.
2. Upload an image/video or use webcam.
3. Receive prediction (Real/Fake) along with Grad-CAM++ heatmap explanation.

### Training the Model

Training notebooks are provided:

- **fake-image-detection.ipynb**: For training deepfake detection on images.
- **fake-video-detection.ipynb**: For training video-based deepfake detection.

To retrain:

```bash
cd backend/deepfake_detection_21-10
jupyter notebook fake-image-detection.ipynb
# OR
jupyter notebook fake-video-detection.ipynb
```

Modify the data paths inside the notebooks accordingly.

---

## 📦 Model Files

Due to GitHub's file size limit, pretrained models are hosted externally.

Download the trained model weights here:  
🔗 [Google Drive Link to Pretrained Models](https://drive.google.com/drive/folders/1231PgXXruswXt9mAfa-rP-zUTcPeGFel?usp=sharing)

After downloading, place the models inside:

```
backend/deepfake_detection_21-10/
```

---

## 📊 Datasets

The models were trained using the following public datasets:

- [FaceForensics++ Dataset](https://github.com/ondyari/FaceForensics)
- [Celeb-DF (v2) Dataset](https://www.kaggle.com/datasets/reubensuju/celeb-df-v2)

(*Datasets require request/access from official sources and are not uploaded due to size and license constraints.*)

---

# ✅ This README provides complete documentation, training, testing, datasets, and model details for the project.

