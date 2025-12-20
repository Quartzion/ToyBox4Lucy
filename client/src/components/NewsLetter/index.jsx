import { useState } from "react";
import { Button } from "react-bootstrap";
import PanelOverlay from "../PanelOverlay";

export default function NewsLetter() {
  const [showOverlay, setShowOverlay] = useState(false);

  const pages = [
    './christmas-2025-1.webp',
    './christmas-2025-2.webp'
  ];

  return (
    <>
      <Button
        className="news-letter-button"
        variant="primary"
        onClick={() => setShowOverlay(true)}
      >
     View Newsletter
      </Button>

      {showOverlay && (
        <PanelOverlay className="newsletter-overlay" onClose={() => setShowOverlay(false)}>
          <div
            style={{
              textAlign: "center",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "1rem"
            }}
          >
            {pages.map((page, index) => (
              <img
                key={index}
                src={page}
                alt={`Newsletter Page ${index + 1}`}
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", marginBottom: "1rem" }}
              />
            ))}

            <Button
              variant="secondary"
              style={{ marginTop: "1rem" }}
              onClick={() => setShowOverlay(false)}
            >
              Close
            </Button>
          </div>
        </PanelOverlay>
      )}
    </>
  );
}
