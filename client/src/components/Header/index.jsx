import React, { Suspense, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap'
// const QtsPayPal = React.lazy(() => import("../QtsPayPal"))

export default function Header() {
    const [occasion, setOccasion] = useState('Christmas');

    useEffect(() => {
        let cancelled = false;

        async function fetchOccasion() {
            try {
                const res = await fetch('/api/toyBoxSettings');
                if (!res.ok) {
                    console.warn('Could not fetch toyBoxSettings, status:', res.status);
                    return;
                }
                const data = await res.json();
                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) return;

                // prefer `occasion` field but fall back to `campaignRun` if present
                const occ = doc.occasion || doc.campaignRun;
                if (occ && !cancelled) setOccasion(occ);
            } catch (err) {
                console.warn('Error fetching occasion from toyBoxSettings:', err);
            }
        }

        fetchOccasion();

        return () => { cancelled = true };
    }, []);

    return (
        <header className="tb4l-Header image-overlay">
            <Container fluid className="header-container">
                <section className="header-text">
                    <div className="tb4l-title">
                        <h2 className="header-title">Lucy's Toy Box</h2>
                    </div>
                    <div className="tb4l-slogan">
                        <h2 className="header-slogan">Help us make a great day for kids this {occasion}!</h2>
                        {/* <QtsPayPal /> */}
                    </div>
                </section>
                <h1 className="visually-hidden">Lucy's Toy Box Logo</h1>
                <picture>
                    <source srcSet='./lt4b-logo-1.webp' type="image/webp"/>
                    <img 
                        src="./lt4b-logo-1.webp" 
                        alt="Lucy's Toy Box Logo" 
                        className="header-logo"
                        loading='lazy'
                    />
                </picture>
            </Container>
        </header>
    );
};