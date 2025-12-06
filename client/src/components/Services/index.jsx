import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import Overlay from "../Overlay";
import { generateQtsServices } from '../../utils/servicesData';
import {
    getExpandedIdx,
    handleToggle,
    closeOverlay,
    useOverlayEffect,
    renderCard
} from '../../utils/cardUtils';
import { getApiBaseUrl } from '../../utils/env';
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';

const API_BASE_URL = getApiBaseUrl();

export default function Services() {
    const { refresh } = useToyBoxSettings();
    const [sendGiftsAddress, setSendGiftAddress] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const slug = searchParams.get('slug');
    const cardRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    const [qtsServices, setQtsServices] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [startIdx, setStartIdx] = useState(0);

    // loading + error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const expandedIdx = getExpandedIdx(qtsServices, slug);

    const visibleServices =
        qtsServices.length > 0
            ? Array.from({ length: Math.min(visibleCount, qtsServices.length) }).map((_, i) =>
                qtsServices[(startIdx + i) % qtsServices.length]
            )
            : [];

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || qtsServices.length === 0) return;
        const overlayOpen =
            expandedIdx !== -1 ||
            document.body.classList.contains('overlay-open') ||
            document.querySelector('.card-overlay-bg');

        if (overlayOpen) return;

        const interval = setInterval(() => {
            setStartIdx((prev) => (prev + 1) % qtsServices.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [isPaused, qtsServices.length, expandedIdx]);

    useEffect(() => {
        setIsPaused(expandedIdx !== -1);
    }, [expandedIdx]);

    useOverlayEffect(location, expandedIdx, setSearchParams);

    useEffect(() => {
        let cancelled = false;
        let pollInterval;

        if (expandedIdx !== -1 || document.body.classList.contains('overlay-open')) {
            return () => (cancelled = true);
        }

        async function fetchSettings() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
                if (!res.ok) throw new Error(`Status ${res.status}`);

                const data = await res.json();
                if (cancelled) return;

                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) throw new Error("No toyBoxSettings found");

                const boys = parseInt(doc.numberOfBoys, 10) || 0;
                const girls = parseInt(doc.numberOfGirls, 10) || 0;
                const sendGiftsAddress = (doc.sendGiftsAddress)
                setSendGiftAddress(sendGiftsAddress)

                const visible = boys + girls;
                setVisibleCount(visible);
                setQtsServices(generateQtsServices(boys, girls));

                setLoading(false); // END LOADING
            } catch (err) {
                console.error("Error fetching toyBoxSettings:", err);
                setError(err);
                setLoading(false); // END LOADING EVEN ON ERROR
            }
        }

        fetchSettings();
        pollInterval = setInterval(fetchSettings, 50000);

        return () => {
            cancelled = true;
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [expandedIdx, refresh ]);

    const handleToggleFn = (actualIdx) =>
        handleToggle(qtsServices, navigate, expandedIdx, actualIdx, "services");

    const helpDetails = (
        <>
            <p>If you wish to donate a toy, follow the instructions below:</p>
            <p>1. Select a gift box shown below.</p>
            <p>2. Fill out the form and submit it.</p>
            <p>3. After confirming your gift selection, purchase your gift and send it to the address</p>
            <div className="help-details-note">
                <p>Peter Smith - Quartzion Technology Services</p>
                <p>{sendGiftsAddress}</p>
            </div>
        </>
    );

    // 🚀 NEW LOADING STATE OUTPUT
    if (loading) {
        return (
            <section className="services-section image-overlay">
                <header className="services-header">
                    <h3>Please wait while we load available gifts…</h3>
                </header>
            </section>
        );
    }

    // 🚀 NEW ERROR OUTPUT
    if (error) {
        return (
            <section className="services-section image-overlay">
                <header className="services-header">
                    <h3 style={{ color: "red" }}>Unable to load gift information.</h3>
                </header>
            </section>
        );
    }

    return (
        <section className="services-section image-overlay" role="region" aria-label="Services">
            <header className="services-header">
                <h3 id="services" aria-live="polite">
                    {visibleServices.length === 0
                        ? "Thank you! We have collected all the presents for this campaign, thanks for making a kids day awesome!!"
                        : helpDetails}
                </h3>
            </header>

            <section
                className="services-content"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {visibleServices.map((service, i) => {
                    const actualIdx =
                        qtsServices.length > 0 ? (startIdx + i) % qtsServices.length : i;

                    const isExpanded = expandedIdx === actualIdx;

                    return expandedIdx !== -1 && isExpanded
                        ? <div key={actualIdx} style={{ visibility: "hidden", height: 0 }} />
                        : renderCard(
                            service,
                            actualIdx,
                            expandedIdx,
                            cardRefs,
                            handleToggleFn,
                            false,
                            "gift"
                        );
                })}
            </section>

            <div className="carousel-controls">
                <button
                    className="svc-fwrd-btn"
                    onClick={() =>
                        qtsServices.length > 0 &&
                        setStartIdx((prev) => (prev - 1 + qtsServices.length) % qtsServices.length)
                    }
                >◀</button>

                <button
                    className="svc-bkwrd-btn"
                    onClick={() =>
                        qtsServices.length > 0 &&
                        setStartIdx((prev) => (prev + 1) % qtsServices.length)
                    }
                >▶</button>
            </div>

            {expandedIdx !== -1 &&
                ReactDOM.createPortal(
                    <Overlay
                        className="card-overlay-bg"
                        onClose={() => closeOverlay(setSearchParams)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {renderCard(qtsServices[expandedIdx], expandedIdx, expandedIdx, cardRefs, handleToggleFn, true)}
                    </Overlay>,
                    document.body
                )}
        </section>
    );
}
