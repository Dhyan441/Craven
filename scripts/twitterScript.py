import tweepy
import sys
import os
import cohere
import random
def twitConnection():
    #Define Keys
    consumer_key = ""
    consumer_secret = ""

    # Access:
    access_token  = ""
    access_secret = ""
    
    client = tweepy.Client(
        consumer_key = consumer_key, consumer_secret=consumer_secret,
        access_token=access_token, access_token_secret=access_secret)
     
    return client

def twitConnection_v1():
    #Define Keys
    consumer_key = ""
    consumer_secret = ""

    # Access:
    access_token  = ""
    access_secret = ""
    
    auth = tweepy.OAuth1UserHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_secret)
    
    return tweepy.API(auth)

def generate_caption(count, dhyan):
    # Set up the Cohere API key (replace with your actual API key)
    cohere_client = cohere.Client("")
    # Describe the image to the AI
    prompts = [
    "Caught on camera stealing snacks from your roommate.",
    "Bro thought he was slick.",
    "Unemployed friends be like.",
    "Bro thought he was all that.",
    "Quit munchin', hit the books dawg.",
    "When the snack thief strikes again.",
    "Caught red-handed in the snack aisle.",
    "Roommate's favorite hobby: raiding the fridge.",
    "Caught in the act of food heist.",
    "Snack ninja at work.",
    "When your roommate turns into a food thief.",
    "Bro's got a PhD in snack stealing.",
    "The audacity to take my last slice.",
    "When the fridge becomes a crime scene.",
    "Caught pilfering snacks like a pro.",
    "Snack-stealing level: expert.",
    "The struggle of keeping snacks safe.",
    "Caught red-handed in the snack raid.",
    "When your roommate treats the fridge like a buffet.",
    "Stealing snacks like it's a job.",
    "The face of a professional snack thief.",
    "Roommate’s motto: ‘What’s yours is mine.’",
    "When the snack stash is in danger.",
    "Caught in the act of a snack heist.",
    "When your roommate thinks they’re a ninja.",
    "The never-ending battle for snacks.",
    "Caught on camera, again, taking snacks.",
    "When the fridge is their personal snack bar.",
    "The look of a guilty snack thief.",
    "Caught taking the last piece of pizza.",
    "When your roommate is a snack burglar.",
    "Stealing snacks like a pro thief.",
    "When the fridge becomes their treasure chest.",
    "Caught snacking while you’re not looking.",
    "When your roommate's side hustle is snack theft.",
    "Caught in the act of food pilfering.",
    "Roommate's stealth mode: activated.",
    "When they think they’re invisible while stealing snacks.",
    "Caught raiding the snack stash yet again.",
    "The art of snack theft perfected."
]
    random_prompts = random.sample(prompts, 3)


    response = cohere_client.chat(
        model="command-r-plus",  # Choose the appropriate model size, e.g., "xlarge"
        temperature=1,
        message=f"Write a Gen Z urban meme type tweet based on this image description: {random_prompts}. Add at least 2 emojis. Start with ATTEMPT #{count} -- {dhyan}. End with BROUGHT TO YOU BY CRAVEN.",
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
