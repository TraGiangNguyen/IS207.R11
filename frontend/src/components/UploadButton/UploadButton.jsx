import React, { useRef } from 'react';
import './UploadButton.css';

/**
 * UploadButton
 * Props:
 *  - onClick: function — called when button is clicked (e.g. open a modal)
 *  - onFileSelect: function(File) — if provided, the button opens a file picker instead
 *  - label: string — button label (default "Upload CSV")
 */
const UploadButton = ({ onClick, onFileSelect, label = 'Upload CSV' }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (onFileSelect) {
      // standalone mode: open file picker directly
      inputRef.current?.click();
    } else if (onClick) {
      // modal mode: delegate to parent handler
      onClick();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) onFileSelect(file);
    e.target.value = ''; // reset so same file can be re-selected
  };

  return (
    <div className="upload-btn-wrapper">
      {/* hidden file input for standalone usage */}
      {onFileSelect && (
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="upload-hidden-input"
          onChange={handleFileChange}
          aria-label="Select CSV file"
        />
      )}

      <button
        className="premium-upload-btn"
        onClick={handleClick}
        type="button"
        aria-label={label}
      >
        <div className="icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <span className="btn-text">{label}</span>
        <div className="btn-glow"></div>
      </button>
    </div>
  );
};

export default UploadButton;
