import React, { Suspense, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../utils/env';
import { Container } from 'react-bootstrap'
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';

export default function Header() {
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
    const { occasion, numberOfBoys, numberOfGirls, totalBearsForBox } = settings;
    const currentRemainingGifts = numberOfBoys + numberOfGirls
    const bearsToShow = totalBearsForBox - currentRemainingGifts;
    const maxBears = 20;
    const bearCount = Math.min(bearsToShow, maxBears);
    return (
        <header className="tb4l-Header image-overlay">
            <Container fluid className="header-container">
                <section className="header-text">
                    <div className="tb4l-title">
                        <h2 className="header-title">Lucy's Toy Box</h2>
                    </div>
                    <div className="tb4l-slogan">
                        <h2 className="header-slogan">Help us make a great day for kids this {occasion}!</h2>
                    </div>
                </section>
                <h1 className="visually-hidden">Lucy's Toy Box Logo</h1>
                <div className="toybox-container">

                    {/* BACK / INSIDE OF BOX */}
                    <img
                        src="./lt4b-box-inside.webp"
                        alt="Toy Box Inside"
                        className="toybox-back"
                    />
                    {/* BEARS */}
                    <div className="bear-grid">
                        {Array.from({ length: bearCount }).map((_, i) => (
                            <img
                                key={i}
                                src="./bBear-sm.webp"
                                className="bear"
                                alt="Bear"
                            />
                        ))}
                    </div>
                    {/* FRONT OF BOX (the part that hides lower half of bears) */}
                    <img
                        src="./lt4b-box-ani.webp"
                        alt="Toy Box Front"
                        className="toybox-front"
                    />
                </div>
            </Container>
        </header>
    );
};