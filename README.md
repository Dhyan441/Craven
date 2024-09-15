# Craven
## Inspiration 🍪
We’re fed up with our roommates stealing food from our designated kitchen cupboards. Few things are as soul-crushing as coming home after a long day and finding that someone has eaten the last Oreo cookie you had been saving. Suffice it to say, the university student population is in desperate need of an inexpensive, lightweight security solution to keep intruders out of our snacks...

Introducing **Craven**, an innovative end-to-end pipeline to put your roommates in check and keep your snacks in stock.

## What it does 📸
Craven is centered around a small Nest security camera placed at the back of your snack cupboard. Whenever the cupboard is opened by someone, the camera snaps a photo of them and sends it to our server, where a facial recognition algorithm determines if the cupboard has been opened by its rightful owner or by an intruder. In the latter case, the owner will instantly receive an SMS informing them of the situation, and then our 'security guard' LLM will decide on the appropriate punishment for the perpetrator, based on their snack-theft history. First-time burglars may receive a simple SMS warning, but repeat offenders will have a photo of their heist, embellished with an AI-generated caption, posted on [our X account](https://x.com/craven_htn) for all to see.

## How we built it 🛠️
- **Backend:** Node.js, Express, Charles
- **Frontend:** React, Chart.js
- **Facial Recognition:** OpenCV, TensorFlow, DLib
- **Pipeline:** Twilio, X, Cohere

## Challenges we ran into 🚩
In order to have unfettered access to the Nest camera's feed, we had to find a way to bypass Google's security protocol. We achieved this by running an HTTP proxy to imitate the credentials of an iOS device, allowing us to fetch snapshots from the camera at any time.

Fine-tuning our facial recognition model also turned out to be a bit of a challenge. In order to ensure accuracy, it was important that we had a comprehensive set of training images for each roommate, and that the model was tested thoroughly. After many iterations, we settled on a K-nearest neighbours algorithm for classifying faces, which performed well both during the day and with night vision.

Additionally, integrating the X API to automate the public shaming process required specific prompt engineering to create captions that were both humorous and effective in discouraging repeat offenders.

## Accomplishments that we're proud of 💪
- Successfully bypassing Nest’s security measures to access the camera feed.
- Achieving high accuracy in facial recognition using a well-tuned K-nearest neighbours algorithm.
- Fine-tuning Cohere to generate funny and engaging social media captions.
- Creating a seamless, rapid security pipeline that requires no legwork from the cupboard owner.

## What we learned 🧠
Over the course of this hackathon, we gained valuable insights into how to circumvent API protocols to access hardware data streams (for a good cause, of course). We also deepened our understanding of facial recognition technology and learned how to tune computer vision models for improved accuracy. For our X integration, we learned how to engineer prompts for Cohere's API to ensure that the AI-generated captions were both humorous and contextual. Finally, we gained experience integrating multiple APIs (Nest, Twilio, X) into a cohesive, real-time application.

## What's next for Craven 🔮
- **Multi-owner support:** Extend Craven to work with multiple cupboards or fridges in shared spaces, creating a mutual accountability structure between roommates.
- **Machine learning improvement:** Experiment with more advanced facial recognition models like deep learning for even better accuracy.
- **Social features:** Create an online leaderboard for the most frequent offenders, and allow users to vote on the best captions generated for snack thieves.
- **Voice activation:** Add voice commands to interact with Craven, allowing roommates to issue verbal warnings when the cupboard is opened.
