from deepface import DeepFace

models = [
  "VGG-Face", 
  "Facenet", 
  "Facenet512", 
  "OpenFace",  
  "DeepID", 
  "ArcFace", 
  "SFace",
  "GhostFaceNet",
]

def find(name: str, i, model):
    return DeepFace.find(
  img_path = f"./nest-collect/images/{name}/{name}{i}.jpg",
  db_path = DB_PATH,
  model_name=model,
  enforce_detection=False,
  silent=True
)

#face recognition


DB_PATH = "./base_pics"
MODEL = models[5]
for model in models:
    abhi_pics = []
    sumedh_pics = []
    dhyan_pics = []
    print("Model: " + str(model))
    for i in range(1, 4):
        abhi_pics.append(find("abhi", i, model)[0].identity)
        sumedh_pics.append(find("sumedh", i, model)[0].identity)
        dhyan_pics.append(find("dhyan", i, model)[0].identity)

    print(abhi_pics)
    print(dhyan_pics)
    print(sumedh_pics)
