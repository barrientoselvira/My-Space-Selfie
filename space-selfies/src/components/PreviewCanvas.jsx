// PreviewCanvas.jsx
// This component only renders the <canvas>; App.jsx controls drawing via the ref.

function PreviewCanvas({ canvasRef }) {
  return (
    <div className="preview-wrapper">
      <canvas ref={canvasRef} className="preview-canvas" />
    </div>
  );
}

export default PreviewCanvas;
