import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const languages = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ja', label: 'Japanese' },
];

const emotionEmojis = {
  positive: '😊',
  negative: '😠',
  neutral: '😐',
};

function App() {
  const [text, setText] = useState('');
  const [selectedLang, setSelectedLang] = useState('auto');
  const [audioUrl, setAudioUrl] = useState('');
  const [emotion, setEmotion] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text.');
      return;
    }

    setLoading(true);
    setAudioUrl('');
    setEmotion('');
    setLanguage('');

    try {
      const response = await axios.post('http://localhost:5000/tts', {
        text,
        lang_override: selectedLang !== 'auto' ? selectedLang : undefined,
      });

      setAudioUrl(response.data.audio_url);
      setEmotion(response.data.emotion);
      setLanguage(response.data.language);
    } catch (err) {
      console.error(err);
      alert('Failed to generate speech.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🗣️ Text-to-Speech with Emotion</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={5}
      />

      <div className="controls">
        <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>🎤 Convert to Speech</button>
      </div>

      {loading && <div className="loading-spinner">⏳ Generating speech...</div>}

      {audioUrl && (
        <div className="results">
          <div className="output-card">
            <h3>Detected Language</h3>
            <div className="language-box">
              <p className="language-text">{language}</p>
            </div>
          </div>

          <div className="output-card">
            <h3>Detected Emotion</h3>
            <div className={`emotion-box ${emotion}`}>
              <p>{emotionEmojis[emotion]} {emotion}</p>
            </div>
          </div>

          <audio controls src={audioUrl}></audio>
        </div>
      )}

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Real-time Speech Conversion</h3>
            <p>Get speech output instantly as you type or paste text.</p>
          </div>
          <div className="feature-card">
            <h3>Multilingual Support</h3>
            <p>Supports various languages with region-specific dialects.</p>
          </div>
          <div className="feature-card">
            <h3>Emotion Detection</h3>
            <p>We analyze the tone of your text to adjust the speech emotion.</p>
          </div>
          <div className="feature-card">
            <h3>Customizable Speech</h3>
            <p>Adjust the speed, pitch, and tone of the speech output.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
