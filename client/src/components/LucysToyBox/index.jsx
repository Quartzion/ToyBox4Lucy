import React, { useEffect, useRef } from "react";
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';

export default function LucysToyBox({ animateVersion }) {
    const { settings, loading, error } = useToyBoxSettings();
    const containerRef = useRef(null);

    const { numberOfBoys = 0, numberOfGirls = 0, totalBearsForBox = 0 } = settings || {};
    const currentRemainingGifts = numberOfBoys + numberOfGirls;
    const bearsToShow = totalBearsForBox - currentRemainingGifts;
    const maxBears = 18;
    const bearCount = Math.min(bearsToShow, maxBears);
    const topRowCount = Math.min(bearCount, 4);
    const bottomRowCount = Math.max(bearCount - 4, 0);

    const explodeBears = () => {
        const root = containerRef.current;
        if (!root) return;

        const bears = Array.from(root.querySelectorAll('.bear'));
        if (!bears.length) return;

        const boxRect = root.getBoundingClientRect();
        bears.forEach(bear => {
            const cloneCount = 10;
            for (let i = 0; i < cloneCount; i++) {

                const clone = bear.cloneNode(true);
                clone.style.position = 'fixed';
                clone.style.left = `${boxRect.left + bear.offsetLeft}px`;
                clone.style.top = `${boxRect.top + bear.offsetTop}px`;
                clone.style.zIndex = 9999;
                clone.style.pointerEvents = 'none';
                clone.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
                document.body.appendChild(clone);

                // random direction
                const angle = Math.random() * 2 * Math.PI;
                const distance = 150 + Math.random() * 1000; // pixels
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;

                requestAnimationFrame(() => {
                    clone.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720 - 360}deg)`;
                    clone.style.opacity = 0;
                });
            }

            // cleanup after animation
            setTimeout(() => clone.remove(), 1200);
        });

        // optional: add confetti here if desired
        // confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    };

    if (loading || !settings) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p className='loading-message'><strong>Please wait while we get the most current info…</strong></p>
                </article>
                <hr className="divider" />
            </section>
        );
    }

    if (error) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p style={{ color: "red" }}>
                        Unable to load information. Please try again shortly.
                    </p>
                </article>
                <hr className="divider" />
            </section>
        );
    }

    return (
        <div className="toybox-container" ref={containerRef} onClick={explodeBears}>
            <img src="./LucysToyBox-2-back.webp" alt="Toy Box Inside" className="toybox-back" />
            <div className="bear-grid">
                <div className="bear-row top-row">
                    {Array.from({ length: topRowCount }).map((_, i) => (
                        <img key={`top-${i}`} src="./bBear-sm.webp" className="bear" alt="Bear" />
                    ))}
                </div>
                <div className="bear-row bottom-row">
                    {Array.from({ length: bottomRowCount }).map((_, i) => (
                        <img key={`bottom-${i}`} src="./bBear-sm.webp" className="bear" alt="Bear" />
                    ))}
                </div>
            </div>
            <img src="./LucysToyBox-2-front.webp" alt="Toy Box Front" className="toybox-front" />
        </div>
    );
}
