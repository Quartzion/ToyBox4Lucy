import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import {Button} from 'react-bootstrap';
import Overlay from "../Overlay";
import qtsServices from '../../utils/servicesData';
import {
    getExpandedIdx,
    handleToggle,
    closeOverlay,
    useOverlayEffect,
    renderCard
} from '../../utils/cardUtils';

export default function Services() {

    const [searchParams, setSearchParams] = useSearchParams();
    const slug = searchParams.get('slug');
    const cardRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    const expandedIdx = getExpandedIdx(qtsServices, slug);

    const VISIBLE_COUNT = 3;
    const [startIdx, setStartIdx] = useState(0);

    // get 3 cards in a loop for carousel
    const visibleServices = Array.from({ length: VISIBLE_COUNT }).map((_, i) =>
        qtsServices[(startIdx + i) % qtsServices.length]
    );

    // pause carousel on hover
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setStartIdx((prev) => (prev + 1) % qtsServices.length);
        }, 7000); //7 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    useEffect(() => {
        setIsPaused(expandedIdx !== -1);
    }, [expandedIdx]);

    // overlay effect imported from utils
    useOverlayEffect(location, expandedIdx, setSearchParams);

    // toggle handler
    const handleToggleFn = (actualIdx) => handleToggle(qtsServices, navigate, expandedIdx, actualIdx, "services");

    return (
        <section className="services-section" role="region" aria-label="Services">
            <header className="services-header">
                <h3 id="services">Services</h3>
            </header>
            <section
                className="services-content"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >

                {visibleServices.map((service, i) => {
                    const actualIdx = (startIdx + i) % qtsServices.length;
                    const isExpanded = expandedIdx === actualIdx;
                    return expandedIdx !== -1 & isExpanded
                        ? (
                            <div key={actualIdx} style={{ visibility: "hidden", height: 0 }} />
                        )
                        : renderCard(service, actualIdx, expandedIdx, cardRefs, handleToggleFn, false, "service");
                })}
            </section>
            <div className="carousel-controls">
                <button className="svc-fwrd-btn" onClick={() => setStartIdx((prev) => (prev - 1 + qtsServices.length) % qtsServices.length)} aria-label="Previous services">◀</button>
                <button className="svc-bkwrd-btn" onClick={() => setStartIdx((prev) => (prev + 1) % qtsServices.length)} aria-label="Next services">▶</button>
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