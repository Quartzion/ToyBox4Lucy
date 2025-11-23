import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

export default function Overlay({ children, className = "", onClose }) {
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {

        // scrol to top 
        requestAnimationFrame(() => {
            const scrollableCard = overlayRef.current?.querySelector(".blog-card.overlay");
            scrollableCard?.scrollTo({ top: 0, behavior: "auto" });
        });

        // blur background
        const focusableElements = overlayRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }

                }

                else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }

            // Escape key closes modal
            if (e.key === "Escape") {
                onClose();
                navigate('/');
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        firstElement?.focus();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <div
            className={`card-overlay-bg ${className}`}
            onClick={onClose}
        >
            <div
                className="overlay-content"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                style={{
                    margin: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
                ref={overlayRef}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>,
        document.body
    );
};
