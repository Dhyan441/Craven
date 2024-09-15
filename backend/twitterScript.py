import tweepy
import yaml
from dotenv import load_dotenv

load_dotenv()

def twitConnection():
    #Define Keys
    consumer_key = os.getenv("C_key")
    consumer_secret = os.getenv("C_secret")

    # Access:
    access_token  = os.getenv("A_token")
    access_secret = os.getenv("A_secret")
    
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

client = twitConnection()
client_v1 = twitConnection_v1()


myMedia = r'susu.jpg'

 #media preperation using version 1
media = client_v1.media_upload(filename=myMedia)
media_id = media.media_id

 #post using version 2
msg = 'THIS dude'
response = client.create_tweet(text = msg, media_ids = [media_id])