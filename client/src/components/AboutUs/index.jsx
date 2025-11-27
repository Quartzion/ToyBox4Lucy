import React, { useState, useEffect } from 'react';
const QtsPayPal = React.lazy(()=> import("../QtsPayPal"));

export default function AboutUs() {
    const [totalKidsForCampaign, setTotalKidsForCampaign] = useState(0);
    const [numberOfBoys, setNumberOfBoys] = useState(0);
    const [numberOfGirls, setNumberOfGirls] = useState(0)
    const [totalGifts, setTotalGifts] = useState(0);
    const [lastDayForGifts, setLastDayForGifts] = useState('');


    useEffect(() => {
        async function fetchTotalKids() {
            try {
                const res = await fetch('/api/toyBoxSettings');
                if (!res.ok) {
                    console.warn('Could not fetch toyBoxSettings, status:', res.status);
                    return;
                }
                const data = await res.json();

                // Expecting an array of documents; take the first
                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) return;

                const totalKidsForCampaign = parseInt(doc.numberOfBoys, 10) + parseInt(doc.numberOfGirls, 10) || 0;
                setTotalKidsForCampaign(totalKidsForCampaign);

                const totalGifts = parseInt(doc.totalGifts, 10) || 0;
                setTotalGifts(totalGifts);

                const lastDay = doc.lastDayForGifts || '';
                setLastDayForGifts(lastDay);

            } catch (err) {
                console.error('Error fetching', err);
            }
        }

        fetchTotalKids();
    }, []);

    return (
        <section aria-labelledby="about-us" className="about-us-section image-overlay">
            <hr className="divider" />
            <article className="about-us-content">
                <div className="about-us-text">
                    <div className="about-us-intro">
                        <h3>Welcome to Lucy's Toy Box!</h3>
                        <p>Thanks for dropping in! This is Lucy's Toy Box, an app designed to help with organizing toy donations for kids! Please review the details below: </p>
                        <p>Today we are collecting gifts for the kids in the <strong>P.C.A.T program</strong> of Hillsborough county school district.</p>
                    </div>
                    <br />
                    <section className="admin-notice">
                        <p>Currently we have <strong>{totalGifts}</strong> presents to deliver!</p>
                        <p>we need to collect gifts for <strong>{totalKidsForCampaign}</strong> remaining kids.</p>
                        {lastDayForGifts && !['N/A', 'n/a'].includes(lastDayForGifts.trim()) && (
                            <p>Last day for gifts: <strong>{lastDayForGifts}</strong></p>
                        )}
                    </section>
                    <br />
                </div>
                <QtsPayPal />
            </article>
            <hr className="divider" />
        </section>
    );
};