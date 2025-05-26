from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
from gtts import gTTS
import os
from langdetect import detect, DetectorFactory
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import uuid


DetectorFactory.seed = 0

app = Flask(__name__)
CORS(app)

engine = pyttsx3.init()
analyzer = SentimentIntensityAnalyzer()


def analyze_sentiment(text):
    sentiment = analyzer.polarity_scores(text)
    score = sentiment['compound']
    if score >= 0.2:
        return "positive"
    elif score <= -0.2:
        return "negative"
    else:
        return "neutral"


def safe_detect_language(text):
    try:
        lang = detect(text)
        
        if all(ord(c) < 128 for c in text):
            return 'en'
        return lang
    except:
        return 'en'


@app.route('/tts', methods=['POST'])
def tts():
    data = request.get_json()
    text = data.get('text', '')

    lang = safe_detect_language(text)
    emotion = analyze_sentiment(text)

    tts = gTTS(text=text, lang=lang, slow=False)
    filename = f"{uuid.uuid4()}.mp3"
    path = os.path.join("static", filename)
    tts.save(path)

    return jsonify({
        "audio_url": f"http://localhost:5000/static/{filename}",
        "language": lang,
        "emotion": emotion
    })


if __name__ == '__main__':
    if not os.path.exists('static'):
        os.makedirs('static')
    app.run(debug=True)
lang_override = data.get('lang_override')
lang = lang_override if lang_override else safe_detect_language(text)
