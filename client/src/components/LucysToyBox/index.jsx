import react from 'react';
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';

export default function LucysToyBox({ animateVersion }) {

    const {
        settings,
        loading,
        error,
    } = useToyBoxSettings();

    // conditional rendering
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
    const { numberOfBoys, numberOfGirls, totalBearsForBox } = settings;
    const currentRemainingGifts = numberOfBoys + numberOfGirls
    const bearsToShow = totalBearsForBox - currentRemainingGifts;
    const maxBears = 18;
    const bearCount = Math.min(bearsToShow, maxBears);
    const topRowCount = Math.min(bearCount, 4);
    const bottomRowCount = Math.max(bearCount - 4, 0);

    return (
        <div className="toybox-container">
            {/* BACK / INSIDE OF BOX */}
            <img
                src="./LucysToyBox-2-back.webp"
                alt="Toy Box Inside"
                className="toybox-back"
            />
            {/* BEARS */}
            <div className="bear-grid">
                {/* top row */}
                <div className="bear-row top-row">
                {Array.from({ length: topRowCount }).map((_, i) => (
                    <img
                        key={`top-${i}`} 
                        src="./bBear-sm.webp"
                        className="bear"
                        alt="Bear"
                    />
                ))}
                </div>
                {/* bottom row */}
                <div className="bear-row bottom-row">
                {Array.from({ length: bottomRowCount }).map((_, i) => (
                    <img
                        key={`bottom-${i}`}
                        src="./bBear-sm.webp"
                        className="bear"
                        alt="Bear"
                    />
                ))}
                </div>
            </div>
            {/* FRONT OF BOX (the part that hides lower half of bears) */}
            <img
                src="./LucysToyBox-2-front.webp"
                alt="Toy Box Front"
                className="toybox-front"
            />
        </div>
    );
};

