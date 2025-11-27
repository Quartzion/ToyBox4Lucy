import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import {Button} from 'react-bootstrap';
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

const API_BASE_URL = getApiBaseUrl();

export default function Services() {

    const [searchParams, setSearchParams] = useSearchParams();
    const slug = searchParams.get('slug');
    const cardRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Local state for services and configuration fetched from API
    const [qtsServices, setQtsServices] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10); // fallback if API doesn't provide
    const [startIdx, setStartIdx] = useState(0);

    // Compute expandedIdx from the currently generated services
    const expandedIdx = getExpandedIdx(qtsServices, slug);

    // get cards in a loop for carousel (only when qtsServices is available)
    const visibleServices = qtsServices.length > 0
        ? Array.from({ length: Math.min(visibleCount, qtsServices.length) }).map((_, i) =>
            qtsServices[(startIdx + i) % qtsServices.length]
        )
        : [];

    // pause carousel on hover
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        if (qtsServices.length === 0) return;
        // Also pause carousel when other overlays or admin panels are open
        const bodyHasOverlay = typeof document !== 'undefined' && document.body.classList.contains('overlay-open');
        const domOverlay = typeof document !== 'undefined' && !!document.querySelector('.card-overlay-bg');
        if (expandedIdx !== -1 || bodyHasOverlay || domOverlay) return;

        const interval = setInterval(() => {
            setStartIdx((prev) => (prev + 1) % qtsServices.length);
        }, 7000); //7 seconds

        return () => clearInterval(interval);
    }, [isPaused, qtsServices.length, expandedIdx]);

    useEffect(() => {
        setIsPaused(expandedIdx !== -1);
    }, [expandedIdx]);

    // overlay effect imported from utils
    useOverlayEffect(location, expandedIdx, setSearchParams);

    // Fetch toy box settings from the API on mount and set up polling
    useEffect(() => {
        let cancelled = false;
        let pollInterval;

        // Check if any overlay is open
        const isOverlayOpen = expandedIdx !== -1 || document.body.classList.contains('overlay-open');

        if (isOverlayOpen) {
            // Don't start polling while overlays are open
            return () => {
                cancelled = true;
                if (pollInterval) clearInterval(pollInterval);
            };
        }

        async function fetchSettings() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
                if (!res.ok) {
                    console.warn('Could not fetch toyBoxSettings, status:', res.status);
                    return;
                }
                const data = await res.json();
                if (cancelled) return;

                // Expecting an array of documents; take the first
                const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
                if (!doc) return;

                const numberOfBoys = parseInt(doc.numberOfBoys, 10) || 0;
                const numberOfGirls = parseInt(doc.numberOfGirls, 10) || 0;
                const visible = parseInt( numberOfBoys + numberOfGirls, 10) || 10;

                setVisibleCount(visible);
                const generated = generateQtsServices(numberOfBoys, numberOfGirls);
                setQtsServices(generated);
            } catch (err) {
                console.error('Error fetching toyBoxSettings:', err);
            }
        }

        // Fetch immediately on mount
        fetchSettings();

        // Poll for updates every 10 seconds (reduced from 5 to minimize rate limit impact)
        pollInterval = setInterval(fetchSettings, 10000);

        return () => {
            cancelled = true;
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [expandedIdx]);

    // toggle handler
    const handleToggleFn = (actualIdx) => handleToggle(qtsServices, navigate, expandedIdx, actualIdx, "services");

    return (
        <section className="services-section image-overlay" role="region" aria-label="Services">
            <header className="services-header">
                <h3 id="services" aria-live="polite">
                    {visibleServices.length === 0
                        ? "Thank you! We have collected all the presents for this campaign, thanks for making a kids day awesome!!"
                        : "Select a box below to see donation details."}
                </h3>
            </header>
            <section
                className="services-content"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                {visibleServices.map((service, i) => {
                    const actualIdx = qtsServices.length > 0 ? (startIdx + i) % qtsServices.length : i;
                    const isExpanded = expandedIdx === actualIdx;
                    return expandedIdx !== -1 & isExpanded
                        ? (
                            <div key={actualIdx} style={{ visibility: "hidden", height: 0 }} />
                        )
                        : renderCard(service, actualIdx, expandedIdx, cardRefs, handleToggleFn, false, "gift");
                })}
            </section>
            <div className="carousel-controls">
                <button
                    className="svc-fwrd-btn"
                    onClick={() => qtsServices.length > 0 && setStartIdx((prev) => (prev - 1 + qtsServices.length) % qtsServices.length)}
                    aria-label="Previous services"
                >◀</button>
                <button
                    className="svc-bkwrd-btn"
                    onClick={() => qtsServices.length > 0 && setStartIdx((prev) => (prev + 1) % qtsServices.length)}
                    aria-label="Next services"
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
};