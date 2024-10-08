#k nearest neighbors
import shutil
import os
import os.path
import pickle
from PIL import Image, ImageDraw
import face_recognition
from face_recognition.face_recognition_cli import image_files_in_folder

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def predict(X_img_path, knn_clf=None, model_path=None, distance_threshold=0.6):
    """
    Recognizes faces in given image using a trained KNN classifier

    :param X_img_path: path to image to be recognized
    :param knn_clf: (optional) a knn classifier object. if not specified, model_save_path must be specified.
    :param model_path: (optional) path to a pickled knn classifier. if not specified, model_save_path must be knn_clf.
    :param distance_threshold: (optional) distance threshold for face classification. the larger it is, the more chance
           of mis-classifying an unknown person as a known one.
    :return: a list of names and face locations for the recognized faces in the image: [(name, bounding box), ...].
        For faces of unrecognized persons, the name 'unknown' will be returned.
    """
    if not os.path.isfile(X_img_path) or os.path.splitext(X_img_path)[1][1:] not in ALLOWED_EXTENSIONS:
        raise Exception("Invalid image path: {}".format(X_img_path))

    if knn_clf is None and model_path is None:
        raise Exception("Must supply knn classifier either thourgh knn_clf or model_path")

    # Load a trained KNN model (if one was passed in)
    if knn_clf is None:
        with open(model_path, 'rb') as f:
            knn_clf = pickle.load(f)

    # Load image file and find face locations
    X_img = face_recognition.load_image_file(X_img_path)
    X_face_locations = face_recognition.face_locations(X_img)

    # If no faces are found in the image, return an empty result.
    if len(X_face_locations) == 0:
        return []

    # Find encodings for faces in the test iamge
    faces_encodings = face_recognition.face_encodings(X_img, known_face_locations=X_face_locations)

    # Use the KNN model to find the best matches for the test face
    closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=1)
    are_matches = [closest_distances[0][i][0] <= distance_threshold for i in range(len(X_face_locations))]

    # Predict classes and remove classifications that aren't within the threshold
    return [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in zip(knn_clf.predict(faces_encodings), X_face_locations, are_matches)]


def show_prediction_labels_on_image(img_path, predictions):
    """
    Shows the face recognition results visually.

    :param img_path: path to image to be recognized
    :param predictions: results of the predict function
    :return:
    """
    pil_image = Image.open(img_path).convert("RGB")
    draw = ImageDraw.Draw(pil_image)
    for name, (top, right, bottom, left) in predictions:
        # Draw a box around the face using the Pillow module
        draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255))

        # There's a bug in Pillow where it blows up with non-UTF-8 text
        # when using the default bitmap font
        name = name.encode("UTF-8")

        # Draw a label with a name below the face
        text_width = 8
        text_height = 8
        draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
        draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))

    # Remove the drawing library from memory as per the Pillow docs
    del draw

    # Display the resulting image
    pil_image.show()


if __name__ == "__main__":
    # STEP 1: Train the KNN classifier and save it to disk
    # Once the model is trained and saved, you can skip this step next time.
  
    # STEP 2: Using the trained classifier, make predictions for unknown images

    for image_file in os.listdir("../nest-collect/images/temp"):
        full_file_path_source = os.path.join("../nest-collect/images/temp", image_file)

        #print("Looking for faces in {}".format(image_file))
        # Find all people in the image using a trained classifier model
        # Note: You can pass in either a classifier file name or a classifier model instance


        # Assuming the model file is in the same directory as the script
        script_dir = os.path.dirname(__file__)
        model_path = os.path.join(script_dir, 'trained_knn_model.clf')

        predictions = predict(full_file_path_source, model_path=model_path)

        if predictions:
            topPrediction = predictions[0]
            name = topPrediction[0]
            (top, right, bottom, left) = topPrediction[1]
            #print("- Found {} at ({}, {})".format(name, left, top))
            # Display results overlaid on an image
            #show_prediction_labels_on_image(os.path.join("../nest-collect/images/temp", image_file), predictions)
            # Move photo to correct directory


            # Define the source and destination paths
            destination = f'../nest-collect/images/{name}/{name}-{image_file}'  # Adjust if you want a different file name in the destination
            
            full_file_path_destination = os.path.join(destination, image_file)
            # Make sure the destination directory exists
            os.makedirs(os.path.dirname(destination), exist_ok=True)

            # Move the file
            shutil.move(full_file_path_source, destination)
            print(name)
        else:
            print("temp")
            # delete file
            os.remove(full_file_path_source)
        

        