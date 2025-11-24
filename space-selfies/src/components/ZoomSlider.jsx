// ZoomSlider.jsx
// Controls zoom level for the selfie on the canvas.

function ZoomSlider({ zoom, onZoomChange }) {
  return (
    <div className="app-card">
      <h2 className="app-section-title">3. Adjust Zoom</h2>
      <label className="zoom-label">Zoom: {zoom.toFixed(1)}x</label>
      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={zoom}
        onChange={(e) => onZoomChange(Number(e.target.value))}
        className="zoom-slider-range"
      />
    </div>
  );
}

export default ZoomSlider;
