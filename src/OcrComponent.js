// src/OcrComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const OcrComponent = () => {
    const [image, setImage] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        try {
            const response = await axios.post('http://127.0.0.1:5000/ocr', {
                image: image,
            });
            setRecognizedText(response.data.recognized_text);
        } catch (error) {
            console.error('Error recognizing text:', error);
        }
    };

    return (
        <div>
            <h1>OCR Image Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="submit">Recognize Text</button>
            </form>
            {recognizedText && (
                <div>
                    <h2>Recognized Text:</h2>
                    <p>{recognizedText}</p>
                </div>
            )}
        </div>
    );
};

export default OcrComponent;
