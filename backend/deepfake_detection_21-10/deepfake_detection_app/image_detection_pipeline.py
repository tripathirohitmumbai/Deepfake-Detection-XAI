# !pip install seaborn
# !pip install keras
# !pip install tensorflow
# !pip install numpy --upgrade

# !pip install scikit-learn scipy matplotlib
#
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import seaborn as sns
# %matplotlib inline
import uuid
np.random.seed(2)

from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import itertools

# from keras.utils.np_utils import to_categorical # convert to one-hot-encoding
from tensorflow.keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPool2D
from keras.optimizers import RMSprop
# from keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from keras.callbacks import ReduceLROnPlateau, EarlyStopping

sns.set(style='white', context='notebook', palette='deep')

## Initial preparation
from PIL import Image
import os
from pylab import *
import re
from PIL import Image, ImageChops, ImageEnhance

def baseurl(request):
  """
  Return a BASE_URL template context for the current request.
  """
  if request.is_secure():
    scheme = "https://"
  else:
    scheme = "http://"
  return scheme + request.get_host()
### Functions
def get_imlist(path):
    return [os.path.join(path,f) for f in os.listdir(path) if f.endswith('.jpg') or f.endswith('.png')]


def convert_to_ela_image(path, quality):
    filename = path
    resaved_filename = filename.split('.')[0] + '.resaved.jpg'
    ELA_filename = filename.split('.')[0] + '.ela.png'

    im = Image.open(filename).convert('RGB')
    im.save(resaved_filename, 'JPEG', quality=quality)
    resaved_im = Image.open(resaved_filename)

    ela_im = ImageChops.difference(im, resaved_im)

    extrema = ela_im.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if max_diff == 0:
        max_diff = 1
    scale = 255.0 / max_diff

    ela_im = ImageEnhance.Brightness(ela_im).enhance(scale)
    # print(ela_im,"-------------ela in")
    return ela_im


###Sample: Real Image
# Let's open a real (not-fake) image as a sample.

Image.open('C:/Users/OneDrive/Desktop/DeepFake_DetectionAPP/Deep_Faking_Detection_App_PK/real1.jpg')


# This is how it looks like after it is processed with error-level analysis (ELA).

convert_to_ela_image('C:/Users/OneDrive/Desktop/DeepFake_DetectionAPP/Deep_Faking_Detection_App_PK/real1.jpg', 90)

###Sample: Fake Image
# This is how it looks like after it has been edited.
# Image.open('C:/Users/Sourabh Dhiman/OneDrive/Desktop/DeepFake_DetectionAPP/Deep_Faking_Detection_App_PK/fake1.jpg')

# This is the result of the fake image after getting through ELA. We can compare the difference between the picture below and the real picture's ELA result.

convert_to_ela_image('C:/Users/OneDrive/Desktop/DeepFake_DetectionAPP/Deep_Faking_Detection_App_PK/fake1.jpg', 90)
# With our own naked eyes, we are able to differ which is the ELA result of the real picture and which one is the result of fake image. By saying real here, what we mean is a non-CGI picture that is not fabricated/edited in any way, e.g. splicing.


###Data preparation
# Read dataset and conversion to ELA
import os
import csv
from PIL import Image  # Use PIL for image processing

def create_image_dataset_csv(fake_folder, real_folder, output_csv):
    # Initialize an empty list to store image information
    image_data = []

    # Process fake images
    fake_files = os.listdir(fake_folder)
    for filename in fake_files:
        if filename.endswith('.jpg') or filename.endswith('.png'):  # Adjust based on your image formats
            file_path = os.path.join(fake_folder, filename)
            label = 0  # Assign label 0 for fake
            image_data.append((file_path, label))

    # Process real images
    real_files = os.listdir(real_folder)
    for filename in real_files:
        if filename.endswith('.jpg') or filename.endswith('.png'):  # Adjust based on your image formats
            file_path = os.path.join(real_folder, filename)
            label = 1  # Assign label 1 for real
            image_data.append((file_path, label))

    # Write image data to CSV file
    with open(output_csv, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['file_path', 'label'])  # Header row
        csv_writer.writerows(image_data)

    print(f"CSV file '{output_csv}' has been created successfully with {len(image_data)} entries.")

# # Example usage:
# fake_images_folder = 'C:/Users/OneDrive/Desktop/DeepFake_DetectionAPP/mixed_dataset/fake'
# real_images_folder = 'C:/Users/OneDrive/Desktop/DeepFake_DetectionAPP/mixed_dataset/real'
output_csv_file = 'deepfake_detection_app/image_dataset.csv'

# create_image_dataset_csv(fake_images_folder, real_images_folder, output_csv_file)
dataset = pd.read_csv('deepfake_detection_app/image_dataset.csv')

dataset.head()

X = []
Y = []

for index, row in dataset.iterrows():
    X.append(array(convert_to_ela_image(row[0], 90).resize((128, 128))).flatten() / 255.0)
    Y.append(row[1])

##Normalization

X = np.array(X)
Y = to_categorical(Y, 2)

## Reshape X
X = X.reshape(-1, 128, 128, 3)

## Train-test split

X_train, X_val, Y_train, Y_val = train_test_split(X, Y, test_size = 0.2, random_state=5)

##CNN building Model

model = Sequential()

model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'valid',
                 activation ='relu', input_shape = (128,128,3)))
print("Input: ", model.input_shape)
print("Output: ", model.output_shape)

model.add(Conv2D(filters = 32, kernel_size = (5,5),padding = 'valid',
                 activation ='relu'))
print("Input: ", model.input_shape)
print("Output: ", model.output_shape)

model.add(MaxPool2D(pool_size=(2,2)))

model.add(Dropout(0.25))
print("Input: ", model.input_shape)
print("Output: ", model.output_shape)

model.add(Flatten())
model.add(Dense(256, activation = "relu"))
model.add(Dropout(0.5))
model.add(Dense(2, activation = "softmax"))

##model summary
model.summary()

##Add optimizer

optimizer = RMSprop(learning_rate=0.0005, rho=0.9, epsilon=1e-08, decay=0.0)
model.compile(optimizer = optimizer , loss = "categorical_crossentropy", metrics=["accuracy"])

## Define early stopping

early_stopping = EarlyStopping(monitor='val_acc',
                              min_delta=0,
                              patience=2,
                              verbose=0, mode='max')

##Model training

epochs = 10
batch_size = 100

##Model Fit
history = model.fit(X_train, Y_train, batch_size = batch_size, epochs = epochs,
          validation_data = (X_val, Y_val), verbose = 2, callbacks=[early_stopping])


##  Model Performance measure

# Plot the loss and accuracy curves for training and validation
fig, ax = plt.subplots(2,1)
ax[0].plot(history.history['loss'], color='b', label="Training loss")
ax[0].plot(history.history['val_loss'], color='r', label="validation loss")
legend = ax[0].legend(loc='best', shadow=True)

ax[1].plot(history.history['accuracy'], color='b', label="Training accuracy")
ax[1].plot(history.history['val_accuracy'], color='r',label="Validation accuracy")
legend = ax[1].legend(loc='best', shadow=True)

## Confusion matrix
from sklearn.metrics import confusion_matrix


def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)

    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, cm[i, j],
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')


# Predict the values from the validation dataset
Y_pred = model.predict(X_val)
# Convert predictions classes to one hot vectors
Y_pred_classes = np.argmax(Y_pred, axis=1)
# Convert validation observations to one hot vectors
Y_true = np.argmax(Y_val, axis=1)


# compute the confusion matrix
confusion_mtx = confusion_matrix(Y_true, Y_pred_classes)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
sns.heatmap(confusion_mtx/np.sum(confusion_mtx), annot=True,
            fmt='.2%', cmap='Blues')

from sklearn.metrics import classification_report

print(classification_report(Y_true, Y_pred_classes))

#saving the trained cnn model
model.save("fake-image-detection.h5")

from tensorflow.keras.models import load_model
from PIL import ImageChops, ImageEnhance
import numpy as np
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import cv2
import keras
from PIL import Image, ImageChops, ImageEnhance
# import os

# #load the trained model
# model = load_model("./fake-image-detection.h5")
#
# def convert_to_ela_image(path, quality=90):
#     original_image = Image.open(path).convert('RGB')
#     resaved_image_path = 'resaved_image.jpg'
#     original_image.save(resaved_image_path, 'JPEG', quality=quality)
#     resaved_image = Image.open(resaved_image_path)
#     ela_image = ImageChops.difference(original_image, resaved_image)
#     extrema = ela_image.getextrema()
#     max_diff = max([ex[1] for ex in extrema])
#     scale = 255.0 / max_diff
#     ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
#     return ela_image
#
# def prepare_image(image_path):
#     ela_image = convert_to_ela_image(image_path)
#     ela_image = ela_image.resize((128, 128))
#     ela_image = np.array(ela_image) / 255.0
#     ela_image = ela_image.reshape((1, 128, 128, 3))
#     return ela_image
#
# def predict_image(image_path, model):
#     prepared_image = prepare_image(image_path)
#     prediction = model.predict(prepared_image)
#     return 'Real' if np.argmax(prediction) == 1 else 'Fake'
#
# def predict_on_folder(folder_path, model):
#     results = {}
#     for filename in os.listdir(folder_path):
#         if filename.endswith(('.jpg', '.jpeg', '.png')):
#             image_path = os.path.join(folder_path, filename)
#             result = predict_image(image_path, model)
#             results[filename] = result
#     return results


## new buf fixed(heatmap not included)
# Load the model once at the beginning
model = load_model("./fake-image-detection.h5")
#
# def convert_to_ela_image(path, quality=90):
#     original_image = Image.open(path).convert('RGB')
#     resaved_image_path = 'resaved_image.jpg'
#     original_image.save(resaved_image_path, 'JPEG', quality=quality)
#     resaved_image = Image.open(resaved_image_path)
#     ela_image = ImageChops.difference(original_image, resaved_image)
#     extrema = ela_image.getextrema()
#     max_diff = max([ex[1] for ex in extrema])
#     scale = 255.0 / max_diff
#     ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
#     return ela_image
#
# def prepare_image(image_path):
#     ela_image = convert_to_ela_image(image_path)
#     ela_image = ela_image.resize((128, 128))
#     ela_image = np.array(ela_image) / 255.0
#     ela_image = ela_image.reshape((1, 128, 128, 3))
#     return ela_image
#
# def predict_image(image_path):
#     prepared_image = prepare_image(image_path)
#     prediction = model.predict(prepared_image)
#     print(prediction,"/;;;;;;;;;;;;;;;;;;;;;;;")
#     return 'Real' if np.argmax(prediction) == 1 else 'Fake'
#
# def predict_image(image_path):
#     try:
#         prepared_image = prepare_image(image_path)
#         prediction = model.predict(prepared_image)
#
#         # Extract the probabilities for each class
#         fake_prob = prediction[0][0]  # Probability of being "Fake"
#         real_prob = prediction[0][1]  # Probability of being "Real"
#
#         # Determine the label based on the higher probability
#         label = 'Real' if real_prob > fake_prob else 'Fake'
#
#         # Return only the values rounded to two decimal places1
#         return [{
#             "predicted_class":label,
#             "fake_percentage":round(fake_prob * 100, 0),
#             "real_percentage":round(real_prob * 100, 0)
#         }]
#     except Exception as e:
#         print(f"Error in prediction: {e}")
#         return ['error', 0, 0]

#grad_cam Heatmap
def convert_to_ela_image(path, quality=90):
    original_image = Image.open(path).convert('RGB')
    resaved_image_path = 'resaved_image.jpg'
    original_image.save(resaved_image_path, 'JPEG', quality=quality)
    resaved_image = Image.open(resaved_image_path)
    ela_image = ImageChops.difference(original_image, resaved_image)
    extrema = ela_image.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    scale = 255.0 / max_diff
    ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
    return ela_image

# Prepare the image
def prepare_image(image_path):
    ela_image = convert_to_ela_image(image_path)
    ela_image = ela_image.resize((128, 128))
    ela_image = np.array(ela_image) / 255.0
    ela_image = ela_image.reshape((1, 128, 128, 3))
    return ela_image

# Grad-CAM function
def get_grad_cam_heatmap(model, img_array, last_conv_layer_name="conv2d_1"):
    # grad_model = Model([model.inputs], [model.get_layer(last_conv_layer_name).output, model.output])
    grad_model = keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output,
         model.get_layer('conv2d_1').output])
    # print(grad_model,'pppppppppppppppppp')
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = tf.reduce_max(predictions, axis=1)
        # print(loss,'lljkhiyi8')

    grads = tape.gradient(loss, conv_outputs)
    print(grads,'qqqqqqqqqqqqq')
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    print(pooled_grads,'pkkp')
    conv_outputs = conv_outputs[0]
    print(conv_outputs,'kjkjkjjkjk')
    conv_outputs *= pooled_grads

    heatmap = tf.reduce_mean(conv_outputs, axis=-1)
    heatmap = np.maximum(heatmap, 0) / np.max(heatmap)
    print(heatmap,'pkpllplplplplplp')
    return heatmap

# Overlay the heatmap on the image
def overlay_heatmap_on_image(heatmap, image_path, output_path="heatmap.jpg"):
    img = cv2.imread(image_path)
    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    overlay_img = cv2.addWeighted(img, 0.6, heatmap, 0.4, 0)
    cv2.imwrite(output_path, overlay_img)
    return overlay_img



#new_29 Along with unique id
def generate_unique_filename(extension="jpg"):
    unique_id = str(uuid.uuid4())
    return f"gradcam_heatmap_{unique_id}.{extension}"

def predict_image_with_gradcam(image_path):
    try:
        prepared_image = prepare_image(image_path)
        prediction = model.predict(prepared_image)

        # Extract the probabilities for each class
        fake_prob = prediction[0][0]
        real_prob = prediction[0][1]

        # Determine the label based on the higher probability
        label = 'Real' if real_prob > fake_prob else 'Fake'

        # Generate Grad-CAM heatmap
        heatmap_filename = generate_unique_filename()
        heatmap = get_grad_cam_heatmap(model, prepared_image)
        overlay_heatmap_on_image(heatmap, image_path, output_path=heatmap_filename)

        # Display the original image and Grad-CAM heatmap
        img = mpimg.imread(image_path)
        gradcam_img = mpimg.imread(heatmap_filename)

        plt.figure(figsize=(10, 5))

        plt.subplot(1, 2, 1)
        plt.title("Original Image")
        plt.imshow(img)
        plt.axis('off')

        plt.subplot(1, 2, 2)
        plt.title("Grad-CAM Heatmap")
        plt.imshow(gradcam_img)
        plt.axis('off')
        # plt.show()

        # Return the prediction and Grad-CAM visualization
        # Include the unique heatmap file name in the response
        return [{
            "predicted_class": label,
            "fake_percentage": round(fake_prob * 100, 0),
            "real_percentage": round(real_prob * 100, 0),
            "gradcam_heatmap": heatmap_filename  # Unique heatmap file name
        }]
    except Exception as e:
        print(f"Error in prediction: {e}")
        return ['error', 0, 0]

"""
# Define the folder path
folder_path = 'deepfake_dataset/data/test/real'

# Predict on the folder
results = predict_on_folder(folder_path, model)

# Print results
for filename, result in results.items(): 
    print(f"{filename}: {result}")

# Define the folder path
folder_path = 'deepfake_dataset/data/test/fake'

# Predict on the folder
results = predict_on_folder(folder_path, model)

# Print results
for filename, result in results.items():
    print(f"{filename}: {result}")

# Predict on a new image
image_path = 'deepfake_dataset/data/test/fake/1609_0.jpg'
result = predict_image(image_path, model)
print(f'The image is predicted to be: {result}')


image_path = 'deepfake_dataset/data/test/real/6454_0.jpg'
result = predict_image(image_path, model)
print(f'The image is predicted to be: {result}')

"""


