import React, { useState, useEffect, useContext  } from 'react';
import { getApiBaseUrl } from '../../utils/env';
import { useToyBox } from '../../context/ToyBoxContext';
const QtsPayPal = React.lazy(() => import("../QtsPayPal"));

export default function AboutUs() {
    const { refreshKey, triggerRefresh } = useToyBox();
    const [totalKidsForCampaign, setTotalKidsForCampaign] = useState(0);
    const [totalGifts, setTotalGifts] = useState(0);
    const [lastDayForGifts, setLastDayForGifts] = useState('');

    // loading + error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = getApiBaseUrl();

    useEffect(() => {
        async function fetchTotalKids() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
                if (!res.ok) {
                    throw new Error(`Status ${res.status}`);
                }

                const data = await res.json();
                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) throw new Error(`No settings found ${API_BASE_URL}/api/toyBoxSettings`);

                // Compute values
                const totalKidsForCampaign =
                    (parseInt(doc.numberOfBoys, 10)) +
                    (parseInt(doc.numberOfGirls, 10));
                setTotalKidsForCampaign(totalKidsForCampaign);
                setTotalGifts(parseInt(doc.totalGifts, 10));
                setLastDayForGifts(doc.lastDayForGifts);
            } catch (err) {
                console.error("Error fetching:", err);
                setError(err);
            } finally {
                // ALWAYS ends loading state
                setLoading(false);
            }
        }
        fetchTotalKids();
    }, [API_BASE_URL, refreshKey]);

    // Toy decrement callback for PayPal
      const handleDonation = async (toyCount) => {
        if (!toyCount || toyCount <= 0) return;
    
        try {
          for (let i = 0; i < toyCount; i++) {
            const { ok, status, data } = await decrementOneToy();
            if (!ok) console.warn("Failed to decrement a toy:", status, data);
          }
        } catch (err) {
          console.error("Error decrementing toys via PayPal:", err);
        }
      };

    // CONDITIONAL RENDERING
    if (loading) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p className="loading-message"><strong>Please wait while we get the most current info…</strong></p>
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
        <section aria-labelledby="about-us" className="about-us-section image-overlay">
            <hr className="divider" />
            <article className="about-us-content">
                <div className="about-us-text">
                    <div className="about-us-intro">
                        <h3>Welcome to Lucy's Toy Box!</h3>
                        <p>Thanks for dropping in! This is Lucy's Toy Box, an app designed to help with organizing toy donations for kids! Please review the details below: </p>
                        <p>Today we are collecting gifts for the kids in the <strong className='bold-text'>P.C.A.T program</strong> of Hillsborough county school district.</p>
                    </div>
                    <br />
                    <section className="admin-notice">
                        <p>Currently we have <strong className='bold-text'>{totalGifts}</strong> presents to deliver!</p>
                        <p>We need to collect gifts for <strong className='bold-text'>{totalKidsForCampaign}</strong> remaining kids.</p>
                        {lastDayForGifts && !['N/A', 'n/a'].includes(lastDayForGifts.trim()) && (
                            <p>Last day for gifts: <strong className='bold-text'>{lastDayForGifts}</strong></p>
                        )}
                    </section>
                    <br />
                </div>
                <QtsPayPal onDonation={handleDonation}/>
            </article>
            <hr className="divider" />
        </section>
    );
};
