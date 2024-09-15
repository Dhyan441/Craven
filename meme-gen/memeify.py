import cohere
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Generate a caption for the meme using the Cohere API
def generate_caption(image_description):
    # Set up the Cohere API key (replace with your actual API key)
    cohere_client = cohere.Client("cp3defjpR1QXEvv3T3tpfeSP3FxV4GYKbMgno7oG")
    # Describe the image to the AI
    response = cohere_client.chat(
        model="command-r-plus",  # Choose the appropriate model size, e.g., "xlarge"
        temperature=1,
        message=f"Write a 4-10 word Gen Z urban meme caption based on this image description: {image_description}. Avoid the phrase 'Snack thief'. Some examples to base your response on: 'When your boy is a raccoon', 'Unemployed friends be like:', 'Bro thought he was slick'. Don't put it in quotes.",
    )
    caption = response.text
    #print(caption)
    return caption


def drawText(imagePath, caption):
        # Open an image file
    image = Image.open(imagePath).filter(ImageFilter.SHARPEN).filter(ImageFilter.EDGE_ENHANCE_MORE)
    draw = ImageDraw.Draw(image)

    # Load a font (adjust the font size as needed)
    font = ImageFont.truetype("impact.ttf", 25)

    # Get image dimensions
    image_width, image_height = image.size

    # Calculate text bounding box and position to center it
    text_bbox = draw.textbbox((0, 0), caption, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    x_position = (image_width - text_width) // 2  # Center horizontally
    y_position = 20  # Position 20 pixels from the top

    # Add background rectangle (Optional)
    padding = 10
    draw.rectangle(
        [x_position - padding, y_position - padding, x_position + text_width + padding, y_position + text_height + padding + 10],
        fill="black",
    )

    # Add main text
    draw.text((x_position, y_position), caption, font=font, fill="white")

    return image

if __name__ == "__main__":
    
    image_path = 'nandu.jpg'
    image_description = "Caught on camera stealing snacks from your roommate."
    caption = generate_caption(image_description)
    image = drawText(image_path, caption)
    image.save('meme_output.jpg')
