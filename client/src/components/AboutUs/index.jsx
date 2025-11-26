import React, { useState, useEffect } from 'react';

export default function AboutUs() {
    const [totalKidsForCampaign, setTotalKidsForCampaign] = useState(0);

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

                const total = parseInt(doc.totalKidsForCampaign, 10) || 0;
                setTotalKidsForCampaign(total);
            } catch (err) {
                console.error('Error fetching totalKidsForCampaign:', err);
            }
        }

        fetchTotalKids();
    }, []);

    return (
        <section aria-labelledby="about-us" className="about-us-section">
            <hr className="divider" />
            <article className="about-us-content">
                <div className="about-us-text">
                    <h3>Welcome to Lucy's Toy Box!</h3>
                    <p>Thanks for dropping in! This is Lucy's Toy Box, an app designed to help with organizing toy donations for kids!</p>
                    <p>Currently we are working to collect gifts for {totalKidsForCampaign} kids in this campaign.</p>
                    <p>Lucy's Toy Box is a web app developed by Quartzion Technology Solutions, for assisting with the management of toy donations.
                    </p>  
                </div>
            </article>
            <hr className="divider"/>
        </section>
    );
};