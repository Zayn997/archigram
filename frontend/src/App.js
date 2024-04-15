import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import daylightImage from "./image/daylight.jpg";
import realisticImage from "./image/realistic.jpg";
import nightImage from "./image/night.jpg";
import futuristicImage from "./image/futuristic.jpg";
import ancientImage from "./image/ancient.jpg";
import icon from "./image/icon.jpg";
import { Typography } from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [images, setImages] = useState({});
  const [selectedStyle, setSelectedStyle] = useState("");
  const [hoverImage, setHoverImage] = useState("");

  const styleExamples = {
    daylight: daylightImage,
    realistic: realisticImage,
    night: nightImage,
    futuristic: futuristicImage,
    ancient: ancientImage,
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image")) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreviewUrl("");
      alert("Please select an image file.");
    }
  };

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    setHoverImage("");
  };

  const handleGenerateImage = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("style", selectedStyle);

    try {
      const response = await axios.post(
        "http://localhost:5000/generate-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImages((prev) => ({
        ...prev,
        [selectedStyle]: [
          ...(prev[selectedStyle] || []),
          response.data.imageUrl,
        ],
      }));
    } catch (error) {
      console.error("Error generating image:", error);
      alert("An error occurred while generating the image. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="title">
        <img
          src={icon}
          alt="Archi-dimension Icon"
          className="Archi-icon"
          // style={{ height: "120px", marginRight: "10px" }}
        />
        <Typography variant="h1" component="h1" className="jersey">
          Archi-dimension
        </Typography>
      </div>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div className="image-preview-wrapper">
          <img src={previewUrl} alt="Preview" className="image-preview" />
        </div>
      )}
      <div className="button-container">
        {Object.entries(styleExamples).map(([style, exampleImg]) => (
          <div
            key={style}
            className="button-wrapper"
            onMouseLeave={() => setHoverImage("")}
          >
            <button
              onMouseEnter={() => setHoverImage(exampleImg)}
              onClick={() => handleStyleChange(style)}
              className={selectedStyle === style ? "button-selected" : ""}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
            {hoverImage === exampleImg && (
              <img
                src={hoverImage}
                alt={`${style} example`}
                className="hover-img"
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleGenerateImage}>Generate Image</button>

      {Object.entries(images).map(([style, urls]) => (
        <div key={style}>
          <h3>
            {style.charAt(0).toUpperCase() + style.slice(1).replace(/_/g, " ")}{" "}
            Style
          </h3>
          <div className="picture-panel">
            {urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Generated ${style}`}
                style={{ maxWidth: "400px", maxHeight: "400px" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
