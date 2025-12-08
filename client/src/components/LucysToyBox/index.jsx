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

    // toybox explode
    function explodeBears(containerRef, totalClones = 25) {
        const root = containerRef.current;
        if (!root) return;

        const bears = Array.from(root.querySelectorAll('.bear'));
        if (!bears.length) return;

        const boxRect = root.getBoundingClientRect();

        for (let i = 0; i < totalClones; i++) {
            const bear = bears[Math.floor(Math.random() * bears.length)];
            const clone = bear.cloneNode(true);

            // Start position: inside the toybox
            const startX = boxRect.left + bear.offsetLeft;
            const startY = boxRect.top + bear.offsetTop;

            clone.style.position = 'fixed';
            clone.style.left = `${startX}px`;
            clone.style.top = `${startY}px`;
            clone.style.width = `${bear.offsetWidth}px`;
            clone.style.height = 'auto';
            clone.style.zIndex = 9999;
            clone.style.pointerEvents = 'none';
            clone.style.opacity = 1;

            document.body.appendChild(clone);

            // Randomized velocity for explosion
            let vx = (Math.random() - 0.5) * 12;  // horizontal speed
            let vy = -Math.random() * 10 - 5;     // upward speed
            const gravity = 0.5;
            const damping = 0.7;                  // bounce damping
            const lifespan = 10000 + Math.random() * 5000; // 20-25 seconds
            let x = startX;
            let y = startY;

            function animate() {
                // Apply physics
                vy += gravity;
                x += vx;
                y += vy;

                // Bounce off viewport edges
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const rect = clone.getBoundingClientRect();

                if (x < 0) { x = 0; vx *= -damping; }
                if (x + rect.width > vw) { x = vw - rect.width; vx *= -damping; }
                if (y < 0) { y = 0; vy *= -damping; }
                if (y + rect.height > vh) { y = vh - rect.height; vy *= -damping; }

                // Fade out slowly near end of lifespan
                const elapsed = performance.now() - startTime;
                const opacity = 1 - elapsed / lifespan;
                clone.style.opacity = opacity;

                // Rotation proportional to horizontal velocity
                const rotation = vx * 5; // tweak multiplier for spin effect
                clone.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotation}deg)`;

                if (elapsed < lifespan) {
                    requestAnimationFrame(animate);
                } else {
                    clone.remove();
                }
            }

            const startTime = performance.now();
            requestAnimationFrame(animate);
        }
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
        <div className="toybox-container" ref={containerRef} onClick={() => explodeBears(containerRef, 200)}>
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
