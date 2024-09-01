import { useState } from "react";

const IimageUpload = () => {
  const [imageUrl, setImageUrl] = useState("");

  const cloudName = "dnsqmhk8i";
  const uploadPreset = "frontend_preset";

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    // const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h1>Upload Your Image</h1>
      <label>Image</label>
      <input
        type="file"
        className="file-input w-full max-w-xs"
        onChange={handleImageUpload}
      />
      {imageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
          <p>
            Image URL:{" "}
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default IimageUpload;
