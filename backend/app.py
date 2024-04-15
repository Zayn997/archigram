from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # 允许跨域请求

client = OpenAI(api_key="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")

@app.route('/generate-image', methods=['POST'])
def generate_image():
    image_file = request.files['image']
    style = request.form.get('style', 'default')
    prompt = f"Create a {style} style image of: the input image, based on the input image and do style on it"  # 此处你可以根据上传的图片内容生成描述

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )
        image_url = response.data[0].url
        return jsonify({'imageUrl': image_url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
