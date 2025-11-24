import { useEffect, useRef, useState } from 'react';
import ApodSelector from './components/ApodeSelector';
import SelfieUpload from './components/SelfieUpload';
import ZoomSlider from './components/ZoomSlider';
import PreviewCanvas from './components/PreviewCanvas';

// 🔑 Put your actual NASA API key here
const API_KEY = 'ErRkVotAXq9rzuHdAWYfHRujMji3iL578vdhdO0l';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Proxy server (Node/Express) URL
const PROXY_BASE_URL = 'http://localhost:4000';

function App() {
  // --- State: APOD list + selection ---
  const [apods, setApods] = useState([]);
  const [loadingApods, setLoadingApods] = useState(false);
  const [apodError, setApodError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- State: selfie + zoom ---
  const [selfieSrc, setSelfieSrc] = useState(null);
  const [zoom, setZoom] = useState(1);

  // --- State: preview error message ---
  const [previewError, setPreviewError] = useState('');

  // --- Canvas ref ---
  const canvasRef = useRef(null);

  // Load some APOD images when the app first mounts
  useEffect(() => {
    loadApods();
  }, []);

  // Fetch a small set of random APODs
  async function loadApods() {
    try {
      setLoadingApods(true);
      setApodError('');

      const params = new URLSearchParams({
        api_key: API_KEY,
        count: '6',
      });

      const url = `${APOD_URL}?${params.toString()}`;
      console.log('Fetching APODs from:', url);

      const res = await fetch(url);

      if (!res.ok) {
        const text = await res.text();
        console.error('APOD error response:', res.status, text);
        throw new Error(`NASA API error (${res.status})`);
      }

      const list = await res.json();
      const imageOnly = list.filter((item) => item.media_type === 'image');

      if (imageOnly.length === 0) {
        throw new Error('No image-type APODs were returned.');
      }

      setApods(imageOnly);
      setSelectedIndex(0);
    } catch (err) {
      console.error(err);
      setApodError(err.message || 'Error loading APOD images');
    } finally {
      setLoadingApods(false);
    }
  }

  // Helper: load an image as a Promise (no crossOrigin here)
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 👈 important for CORS-safe canvas
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

  // 🔧 Core: render the preview to the canvas
  async function renderPreview(currentZoom = zoom) {
    const selectedApod = apods[selectedIndex];
    const rawBackgroundUrl = selectedApod?.url || null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 500;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, size, size);

    if (!rawBackgroundUrl) {
      const msg = 'Please select a NASA background first.';
      setPreviewError(msg);
      drawMessage(ctx, msg, size);
      return;
    }

    if (!selfieSrc) {
      const msg = 'Please upload a selfie first.';
      setPreviewError(msg);
      drawMessage(ctx, msg, size);
      return;
    }

    // Build the proxied URL so CORS allows download
    const proxiedBackgroundUrl = `${PROXY_BASE_URL}/proxy-image?url=${encodeURIComponent(
      rawBackgroundUrl
    )}`;

    try {
      const [bgImg, selfieImg] = await Promise.all([
        loadImage(proxiedBackgroundUrl),
        loadImage(selfieSrc),
      ]);

      // 1. Draw background (cover canvas)
      const bgAspect = bgImg.width / bgImg.height;
      let drawWidth = size;
      let drawHeight = size;

      if (bgAspect > 1) {
        drawHeight = size;
        drawWidth = size * bgAspect;
      } else {
        drawWidth = size;
        drawHeight = size / bgAspect;
      }

      const offsetX = (size - drawWidth) / 2;
      const offsetY = (size - drawHeight) / 2;

      ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);

      // 2. Draw selfie in a circle
      const baseSelfieSize = size * 0.5;
      const selfieSize = baseSelfieSize * currentZoom;
      const centerX = size / 2;
      const centerY = size / 2 + 20;

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, selfieSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const smallestSide = Math.min(selfieImg.width, selfieImg.height);
      const srcX = (selfieImg.width - smallestSide) / 2;
      const srcY = (selfieImg.height - smallestSide) / 2;

      ctx.drawImage(
        selfieImg,
        srcX,
        srcY,
        smallestSide,
        smallestSide,
        centerX - selfieSize / 2,
        centerY - selfieSize / 2,
        selfieSize,
        selfieSize
      );

      ctx.restore();

      // 3. Frame around selfie
      ctx.save();
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(centerX, centerY, selfieSize / 2 + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } catch (err) {
      console.error('Error rendering preview:', err);
      const msg = 'Could not render preview. Check console for details.';
      setPreviewError(msg);

      // Draw fallback message on canvas
      const canvasNow = canvasRef.current;
      if (canvasNow) {
        const ctx2 = canvasNow.getContext('2d');
        if (ctx2) drawMessage(ctx2, msg, size);
      }
    }
  }

  // Called when user clicks the "Generate Preview" button
  function handlePreview() {
    setPreviewError('');
    renderPreview();
  }

  // Called when user moves the zoom slider
  function handleZoomChange(newZoom) {
    setZoom(newZoom);
    setPreviewError('');
    renderPreview(newZoom);
  }

  // Draw text centered on the canvas
  function drawMessage(ctx, msg, size) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(msg, size / 2, size / 2);
  }

  // Download the canvas as an image
  function handleDownload() {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'space-selfie.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed due to CORS / tainted canvas:', err);
      alert(
        'Your browser blocked the download because the NASA image does not allow it (CORS). ' +
          'You can still take a screenshot of the preview as a workaround.'
      );
    }
  }

  const canDownload = apods[selectedIndex] && selfieSrc;

  return (
    <div className="app-page">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Space Selfies 🚀</h1>
          <p className="app-subtitle">
            Choose a NASA space image, upload a selfie, preview the result, then
            download your custom portrait.
          </p>
        </header>

        <div className="app-layout">
          {/* On mobile, right panel is ordered first via CSS */}
          <section className="app-right-panel">
            <h2 className="app-section-title">Preview</h2>
            <PreviewCanvas canvasRef={canvasRef} />
          </section>

          <section className="app-left-panel">
            <ApodSelector
              apods={apods}
              selectedIndex={selectedIndex}
              loading={loadingApods}
              error={apodError}
              onReload={loadApods}
              onSelect={setSelectedIndex}
            />

            <SelfieUpload
              selfieSrc={selfieSrc}
              onSelfieChange={setSelfieSrc}
            />

            <ZoomSlider zoom={zoom} onZoomChange={handleZoomChange} />

            <div className="app-card">
              <h2 className="app-section-title">4. Preview</h2>
              <button className="app-button" onClick={handlePreview}>
                Generate Preview
              </button>
              {previewError && (
                <p className="error-text">{previewError}</p>
              )}
              <p className="preview-helper-text">
                After changing zoom or selecting a different APOD, click this
                again to update the preview.
              </p>
            </div>

            <div className="app-card">
              <h2 className="app-section-title">5. Download</h2>
              <button
                className="app-button app-button-full"
                disabled={!canDownload}
                onClick={handleDownload}
              >
                Download Your Space Selfie
              </button>
            </div>
          </section>
        </div>

        <footer className="app-footer">
          <p className="footer-note">
            Images courtesy of NASA&apos;s Astronomy Picture of the Day (APOD).
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
