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

  // effect always runs, even if settings isn't ready
  useEffect(() => {
    const root = containerRef.current;
    if (!root || bearCount <= 0) return;

    const bears = Array.from(root.querySelectorAll('.bear'));
    if (!bears.length) return;

    bears.forEach(b => b.classList.remove('bear-added'));
    bears.forEach(b => (b.style.animationDelay = ''));

    root.offsetWidth; // force reflow

    const STAGGER_MS = 60;
    bears.forEach((b, idx) => {
      const delaySec = (idx * STAGGER_MS) / 1000;
      b.style.animationDelay = `${delaySec}s, ${Math.max(0, delaySec - 0.1)}s, ${delaySec}s`;
      b.classList.add('bear-added');
    });

    const totalDurationMs = 1200 + bears.length * STAGGER_MS;
    const cleanupTimer = setTimeout(() => {
      bears.forEach(b => (b.style.animationDelay = ''));
    }, totalDurationMs);

    return () => clearTimeout(cleanupTimer);
  }, [animateVersion, bearCount]);

  // Conditional rendering after hooks
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
    <div className="toybox-container" ref={containerRef}>
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
