import React, { useState, useEffect, useRef } from 'react';
import Confetti from "react-confetti";
import { Button, Alert } from "react-bootstrap";
import { isProd, getApiBaseUrl } from '../../utils/env';
// import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';
import ConnectWithUsForm from "../ConnectWithUsForm";
import LucysToyBox from '../LucysToyBox';

export default function ConnectWithUs({ giftType }) {
    const [expanded, setExpanded] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const prevCountRef = useRef(0);
    const [newlyAdded, setNewlyAdded] = useState(0);

    // const {
    //     settings,
    //     loading,
    //     error,
    // } = useToyBoxSettings();

    // if (loading || !settings) {
    //     return (
    //         <section className="connect-with-us-section image-overlay">
    //             <hr className="divider" />
    //             <article className="connect-with-us-content">
    //                 <p className="loading-message">
    //                     <strong>Please wait while we get the most current info…</strong>
    //                 </p>
    //             </article>
    //             <hr className="divider" />
    //         </section>
    //     );
    // }

    // if (error) {
    //     return (
    //         <section className="connect-with-us-section image-overlay">
    //             <hr className="divider" />
    //             <article className="connect-with-us-content">
    //                 <p style={{ color: "red" }}>
    //                     Unable to load information. Please try again shortly.
    //                 </p>
    //             </article>
    //             <hr className="divider" />
    //         </section>
    //     );
    // }
    // const { numberOfBoys, numberOfGirls, totalBearsForBox } = settings;
    // const currentRemainingGifts = numberOfBoys + numberOfGirls;
    // const bearsToShow = totalBearsForBox - currentRemainingGifts;
    // const maxBears = 20;
    // const bearCount = Math.min(bearsToShow, maxBears);

    const handleToggle = async () => {
        const willExpand = !expanded;
        setExpanded(willExpand);
        setSuccessMessage(null);
        setErrorMessage(null);

        // If user is expanding the form, send the wakeup ping
        if (willExpand) {
            if (isProd()) {
                console.log('Running in production mode');
            }

            const API_BASE_URL = getApiBaseUrl();

            try {
                await fetch(`${API_BASE_URL}/api/ping`);
                console.log("📡 Ping sent from ConnectWithUs expansion");
            } catch (err) {
                console.error("❌ Ping failed from ConnectWithUs:", err);
            }
        }
    };


    return (
        <section className="connect-with-us-section" role="region" aria-label="Connect With Us today for more information">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={1000}
                    gravity={1}
                    colors={['#f00', '#0f0', '#00f', '#ff0']}
                />
            )}
            <header className="connect-with-us-header">
                <p>Please provide your email so we can send you an update with confirmation for recieving and delivering your donated gift!</p>
            </header>
            <br />
            <article>
                {/* <div className="toybox-container">
                    <img src="./lt4b-box-inside.webp" alt="Toy Box Inside" className="toybox-back" />
                    <div className="bear-grid">
                        {Array.from({ length: bearCount }).map((_, i) => {
                            const isAnimated =
                                i >= bearCount - newlyAdded;
                            return (
                                <img
                                    key={i}
                                    src="./bBear-sm.webp"
                                    className={`bear ${isAnimated ? "bear-added" : ""}`}
                                    alt="Bear"
                                />
                            );
                        })}
                    </div>
                    <img src="./lt4b-box-ani.webp" alt="Toy Box Front" className="toybox-front" />
                </div> */}
                <LucysToyBox />
                <Button
                    aria-label={expanded ? "Hide the email Form" : "click here to show the email form"}
                    className="show-connect-with-us-form-button"
                    onClick={handleToggle}
                    aria-expanded={expanded}
                    aria-controls="connect-with-us-form"
                >
                    {expanded ? "Hide email request form" : "Click here to submit your email and confirm your gift donation!"}
                </Button>
                {successMessage && (

                    <Alert variant="success" className="mt-3">
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert variant="danger" className="mt-3">
                        {errorMessage}
                    </Alert>
                )}
                {expanded && (
                    <div className="connect-with-us-form" id="connect-with-us-form">
                        <ConnectWithUsForm
                            giftType={giftType}
                            onSuccess={() => {
                                setSuccessMessage("Thank you for helping make a kid smile!");
                                setErrorMessage(null);
                                setExpanded(false);
                                setShowConfetti(true);
                                setTimeout(() => setShowConfetti(false), 5000);
                                setTimeout(() => setExpanded(false), 1000);
                            }}
                            onError={(msg) => {
                                setErrorMessage(msg || "Sorry, something went wrong. Please try again later.");
                                setSuccessMessage(null);
                            }}
                        />
                    </div>
                )}
            </article>
        </section>
    );
};