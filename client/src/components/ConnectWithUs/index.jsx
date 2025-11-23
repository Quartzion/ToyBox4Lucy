import React, { useState, Suspense } from "react";
import { Button, Alert } from "react-bootstrap";
import { isProd, getApiBaseUrl } from '../../utils/env';
import ConnectWithUsForm from "../ConnectWithUsForm";
const QtsPayPal = React.lazy(()=> import("../QtsPayPal"))

export default function ConnectWithUs() {
    const [expanded, setExpanded] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

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
            <header className="connect-with-us-header">
                <h3>Connect with Quartzion Today!</h3>
                <p>Submit your follow-up request today! Click the button below and submit the form to our engineers for review. We will analyze the request and get back to you as soon as possible!</p>
            </header>
            <br />
            <article>
                <Button
                    aria-label={expanded ? "Hide Connect with Us Form" : "Show Connect with Us Form"}
                    className="show-connect-with-us-form-button"
                    onClick={handleToggle}
                    aria-expanded={expanded}
                    aria-controls="connect-with-us-form"
                >
                    {expanded ? "Hide follow-up request form" : "Click here to submit your follow-up request!"}
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
                            onSuccess={() => {
                                setSuccessMessage("Your request has been successfully submitted to Quartzion's Engineering Team!");
                                setErrorMessage(null);
                                setExpanded(false);
                            }}
                            onError={(msg) => {
                                setErrorMessage(msg || "Sorry, something went wrong. Please try again later.");
                                setSuccessMessage(null);
                            }}
                        />
                    </div>
                )}
                <br />
                <QtsPayPal />
            </article>
        </section>
    );
};