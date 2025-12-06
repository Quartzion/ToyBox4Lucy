import React from 'react';
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';

const QtsPayPal = React.lazy(() => import("../QtsPayPal"));

export default function AboutUs() {
    const {
        settings,
        loading,
        error,
        handleDonation
    } = useToyBoxSettings();

    if (loading) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p className="loading-message">
                        <strong>Please wait while we get the most current info…</strong>
                    </p>
                </article>
                <hr className="divider" />
            </section>
        );
    }

    if (error || !settings) {
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

    const { numberOfBoys, numberOfGirls, totalGifts, lastDayForGifts } = settings;
    const totalKidsForCampaign = parseInt(numberOfBoys) + parseInt(numberOfGirls);

    return (
        <section aria-labelledby="about-us" className="about-us-section image-overlay">
            <hr className="divider" />
            <article className="about-us-content">
                <div className="about-us-text">
                    {/* --- INTRO SECTION RESTORED --- */}
                    <div className="about-us-intro">
                        <h3>Welcome to Lucy's Toy Box!</h3>
                        <p>Thanks for dropping in! This is Lucy's Toy Box, an app designed to help with organizing toy donations for kids! Please review the details below:</p>
                        <p>Today we are collecting gifts for the kids in the <strong className="bold-text">P.C.A.T program</strong> of Hillsborough County School District.</p>
                    </div>

                    <br />

                    {/* --- ADMIN NOTICE --- */}
                    <section className="admin-notice">
                        <p>Currently we have <strong className="bold-text">{totalGifts}</strong> presents to deliver!</p>
                        <p>We need to collect gifts for <strong className="bold-text">{totalKidsForCampaign}</strong> remaining kids.</p>
                        {lastDayForGifts && !['N/A', 'n/a'].includes(lastDayForGifts.trim()) && (
                            <p>Last day for gifts: <strong className="bold-text">{lastDayForGifts}</strong></p>
                        )}
                    </section>
                </div>

                {/* --- PAYPAL DONATION --- */}
                <QtsPayPal onDonation={handleDonation} />
            </article>
            <hr className="divider" />
        </section>
    );
}
