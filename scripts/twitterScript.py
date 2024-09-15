import tweepy
import sys
import os
import cohere
def twitConnection():
    #Define Keys
    consumer_key = "6dGGMLEK6Q58AgS4QILRn94wA"
    consumer_secret = "5b6UBaDEQdot6qUK2xhatmAXDFq7BolOIPpZmFynNPEyuTs92J"

    # Access:
    access_token  = "1835205209804443648-8wJsw5Pd0sx8CzYYgagHKOX1rgtkG3"
    access_secret = "AaxlcZrcQO8MCsTJam0ExfugUwaVxrgyjK7P8E4LahEIF"
    
    client = tweepy.Client(
        consumer_key = consumer_key, consumer_secret=consumer_secret,
        access_token=access_token, access_token_secret=access_secret)
     
    return client

def twitConnection_v1():
    #Define Keys
    consumer_key = "6dGGMLEK6Q58AgS4QILRn94wA"
    consumer_secret = "5b6UBaDEQdot6qUK2xhatmAXDFq7BolOIPpZmFynNPEyuTs92J"

    # Access:
    access_token  = "1835205209804443648-8wJsw5Pd0sx8CzYYgagHKOX1rgtkG3"
    access_secret = "AaxlcZrcQO8MCsTJam0ExfugUwaVxrgyjK7P8E4LahEIF"
    
    auth = tweepy.OAuth1UserHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_secret)
    
    return tweepy.API(auth)

def generate_caption(count, dhyan):
    # Set up the Cohere API key (replace with your actual API key)
    cohere_client = cohere.Client("cp3defjpR1QXEvv3T3tpfeSP3FxV4GYKbMgno7oG")
    # Describe the image to the AI
    image_description = "Caught on camera stealing snacks from your roommate."
    response = cohere_client.chat(
        model="command-r-plus",  # Choose the appropriate model size, e.g., "xlarge"
        temperature=1,
        message=f"Write a Gen Z urban meme type tweet based on this image description: {image_description}. Avoid the phrase 'Snack thief'. Some examples to base your response on: 'When your boy is a raccoon', 'Unemployed friends be like:', 'Bro thought he was slick'. Don't put it in quotes. Add at least 2 emojis. Start with ATTEMPT #{count} -- {dhyan}",
    )
    caption = response.text
    #print(caption)
    return caption

import os

def count_files_in_directory(directory_path):
    # Get a list of all files and directories in the specified directory
    files_and_dirs = os.listdir(directory_path)
    
    # Filter the list to include only files
    files = [f for f in files_and_dirs if os.path.isfile(os.path.join(directory_path, f))]
    
    # Count the number of files
    return len(files)



if __name__ == "__main__":
    name = sys.argv[1]
    file_name = sys.argv[2]
    full_file_path_source = os.path.join("../scripts/meme-final", file_name)
    print(full_file_path_source)
   
    client = twitConnection()
    client_v1 = twitConnection_v1()

    # Example usage
    directory_path = os.path.join("../nest-collect/images", name)
    file_count = count_files_in_directory(directory_path)
    description = generate_caption(file_count, name)
    #media preperation using version 1
    if not os.path.exists(full_file_path_source):
        print(f"File not found: {full_file_path_source}")
    
    media = client_v1.media_upload(filename= full_file_path_source)
    media_id = media.media_id


    response = client.create_tweet(text = description, media_ids = [media_id])