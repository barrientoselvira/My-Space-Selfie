// ApodSelector.jsx
// Lets the user pick a NASA APOD background from thumbnails.

function ApodSelector({
  apods,
  selectedIndex,
  loading,
  error,
  onReload,
  onSelect,
}) {
  const selectedApod = apods[selectedIndex] || null;

  return (
    <div className="app-card">
      <h2 className="app-section-title">1. Choose Space Background</h2>

      {loading && <p className="body-small">Loading NASA images...</p>}

      {error && <p className="error-text">{error}</p>}

      <button className="app-button" onClick={onReload}>
        Reload APOD Options
      </button>

      {apods.length > 0 && (
        <div className="apod-thumbnails">
          {apods.map((apod, index) => {
            const isSelected = index === selectedIndex;
            const buttonClass =
              'apod-thumb-button' + (isSelected ? ' selected' : '');

            return (
              <button
                key={apod.date + index}
                type="button"
                onClick={() => onSelect(index)}
                className={buttonClass}
              >
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="apod-thumb-img"
                />
                <div className="apod-thumb-title" title={apod.title}>
                  {apod.title}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedApod && (
        <div className="apod-meta">
          <p className="apod-meta-title">{selectedApod.title}</p>
          <p className="apod-meta-date">{selectedApod.date}</p>
          <p className="apod-meta-description">
            {selectedApod.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default ApodSelector;
