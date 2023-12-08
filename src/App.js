import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [webcamImage, setWebcamImage] = useState(null);
  const [caption, setCaption] = useState('');
  const webcamRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(true);
  const [audioPath, setAudioPath] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
   

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    console.log(selectedImage);
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const captureImageFromWebcam = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamImage(imageSrc);
    setWebcamActive(false);
  };

  const resetWebcam = () => {
    setWebcamImage(null);
    setWebcamActive(true);
  };

  const resetImages = () => {
    setSelectedImage(null);
    setWebcamImage(null);
    setCaption('');
    setWebcamActive(true);
  };

  const dataURItoBlob = (dataURI) => {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  const generateCaption = async () => {
    const formData = new FormData();
    if (selectedImage){
    formData.append('image', dataURItoBlob(selectedImage));
    console.log(webcamImage);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/caption', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setCaption(data.caption);
      setAudioPath(data.audio_path)
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }}
    else if(webcamImage){
      formData.append('image', dataURItoBlob(webcamImage));
    console.log(webcamImage);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/caption', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setCaption(data.caption);
      setAudioPath(data.audio_path)
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }}
    else{
      console.error('No image selected.');
    }

  };



  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Caption Generator</h1>
      </header>
      <main className="main-container">
        <div className="upload-section">
          <h2>Upload Image</h2>
          <div className="drag-drop-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-button"
            />
            {selectedImage && (
              <div className="upload-preview-container">
                <p>Uploaded Image Preview:</p>
                <img src={selectedImage} alt="Uploaded" className="upload-preview" />
              </div>
            )}
          </div>
          <div className="controls">
            <button onClick={resetImages}>Reset</button>
            <button onClick={generateCaption}>Generate Caption</button>
          </div>
        </div>
        <div className="capture-section">
          <h2>Capture Image from Webcam</h2>
          {webcamActive ? (
            <div className="webcam-container">
              <Webcam ref={webcamRef} />
              <button onClick={captureImageFromWebcam}>Capture Image</button>
            </div>
          ) : (
            <div className="webcam-preview-container">
              <p>Captured Image Preview:</p>
              <img src={webcamImage} alt="Webcam Capture" className="webcam-preview" />
              <div className="controls">
                <button onClick={resetWebcam}>Reset</button>
                <button onClick={generateCaption}>Generate Caption</button>
              </div>
            </div>
          )}
        </div>
      </main>
      {caption && (
        <div className="caption">
          <h2>Caption:</h2>
          <p>{caption}</p>
          <audio controls>
            <source type="audio/mp3" src={`http://127.0.0.1:5000/audio/${audioPath}`}  />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
