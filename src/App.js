import React, { useState } from 'react';
import './index.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setSelectedImage(reader.result);
        await recognizeDigits(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const recognizeDigits = async (imageData) => {
    setLoading(true);
    console.log("Sending image data:", imageData); // Log image data
    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      // Handle response and error cases
      const data = await response.json();
      console.log("Response from server:", data); // Log response from server

      // Check for errors in the response
      if (response.ok) {
        setRecognizedText(data.recognized_text); // Update with 'recognized_text'
      } else {
        setRecognizedText(data.error); // Display the error message from backend
      }
    } catch (error) {
      console.error("Error recognizing digits:", error);
      setRecognizedText("An unexpected error occurred."); // Optionally handle unexpected errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">التعرف على الأرقام العربية</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        className="mb-4" 
      />
      {loading && <p>جاري التعرف على النص...</p>}
      {selectedImage && (
        <img src={selectedImage} alt="Selected" className="mb-4" />
      )}
      {recognizedText && (
        <div>
          <h2 className="text-lg">النص المعترف به</h2>
          <textarea 
            value={recognizedText} 
            readOnly 
            className="border p-2 w-full h-24"
          />
        </div>
      )}
    </div>
  );
}

export default App;
