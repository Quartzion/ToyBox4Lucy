import react from 'react';
import ReactDOM from "react-dom";

export default function PanelOverlay({ children, className = "", onClose, ...rest }) {
  return ReactDOM.createPortal(
    <div
      className={`panel-overlay-wrapper ${className}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="panel-overlay-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
