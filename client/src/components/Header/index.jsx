import React, { Suspense, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../../utils/env';
import { Container } from 'react-bootstrap'

export default function Header() {
    const [occasion, setOccasion] = useState('Christmas');
    const API_BASE_URL = getApiBaseUrl();
    // Loading & error states
    const [loading, setLoading] = useState(true);
    const [error, setError ] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchOccasion() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
                if (!res.ok) {
                    throw new Error(`status ${res.status}`);
                }
                const data = await res.json();
                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) throw new Error("Setting not found");

                // prefer `occasion` field but fall back to `campaignRun` if present
                const occ = doc.occasion || doc.campaignRun;
                if (occ && !cancelled) setOccasion(occ);
            } catch (err) {
                console.warn('Error fetching occasion from toyBoxSettings:', err);
                setError(err);
            } finally {
                // end loading state
                setLoading(false);
            }
        }
        fetchOccasion();
        return () => { cancelled = true };
    }, []);

    // conditional rendering
    if (loading) {
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