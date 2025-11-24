// SelfieUpload.jsx
// Handles selecting a selfie and shows a small preview.

function SelfieUpload({ selfieSrc, onSelfieChange }) {
  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      onSelfieChange(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSelfieChange(reader.result); // Data URL
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="app-card">
      <h2 className="app-section-title">2. Upload Your Selfie</h2>

      <p className="selfie-upload-description">
        Your image stays in your browser; it is not uploaded to any server.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {selfieSrc && (
        <div className="selfie-preview-wrapper">
          <p className="selfie-preview-label">Selfie preview:</p>
          <img
            src={selfieSrc}
            alt="Your selfie"
            className="selfie-preview"
          />
        </div>
      )}
    </div>
  );
}

export default SelfieUpload;
