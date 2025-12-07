import React, { useState } from 'react';
import { getQtsVersion } from '../../utils/env';
import LucysToyBox from '../LucysToyBox';

import {
    Container,
    Nav,
    Button
} from 'react-bootstrap';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import AdminSettings from '../AdminSettings';

export default function Footer() {

    const [showAdminSettings, setShowAdminSettings] = useState(false);

    const toggleAdminSettings = () => {
        setShowAdminSettings(!showAdminSettings);
    };

    return (
        <footer className="footer-section image-overlay">
            <h1 className="visually-hidden">Footer Navigation</h1>
            <Container className="QTS-Header navbar navbar-expand-md navbar-light">
                <section className="footer-content">
                    <section className="footer-left">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={toggleAdminSettings}
                            aria-label={showAdminSettings ? "Hide admin settings" : "Show admin settings"}
                            aria-expanded={showAdminSettings}
                            aria-controls="admin-settings-panel"
                            className="admin-settings-toggle"
                        >
                            {showAdminSettings ? "Hide Admin Settings" : "Show Admin Settings"}
                        </Button>
                        {showAdminSettings && (
                            <AdminSettings
                                onSuccess={() => setShowAdminSettings(false)}
                            />
                        )}
                        <br />
                        <h2 className="visually-hidden">legal</h2>
                        &copy; {new Date().getFullYear()} - Lucy's Toy Box. All rights reserved. - version - {getQtsVersion()}
                    </section>
                    <section className="footer-right">
                        <h2 className="visually-hidden">Company Logo</h2>
                        < LucysToyBox />
                    </section>
                    <section className="footer-center">
                        <div className="developer-promo">
                            <p>This app is brought to you by Quartzion Technology Solutions.</p>
                            <Nav.Link
                                href="https://www.quartzion.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Go to Quartzion website"
                                title="www.quartzion.com"
                                className="qts-logo-link"
                            >
                                <img
                                    src="./qts-icon-2-sm.webp"
                                    alt="Quartzion Technology Solutions Logo"
                                    className="dev-logo"
                                    loading="lazy"
                                />
                            </Nav.Link>
                            <nav id="footer-social-links" aria-label="Follow us on Social Media" className="footer-links">
                                <h2 className="visually-hidden">connect with us</h2>
                                <Nav>
                                    <Nav.Link
                                        href="https://github.com/Quartzion"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Quartzion GitHub"
                                    >
                                        <FaGithub aria-hidden="true">
                                            <span className="visually-hidden">GitHub</span>
                                        </FaGithub>
                                    </Nav.Link>
                                    <Nav.Link
                                        href="https://www.linkedin.com/company/quartzion-technology-solutions-corp"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Quartzion LinkedIn"
                                    >
                                        <FaLinkedin aria-hidden="true">
                                            <span className="visually-hidden">LinkedIn</span>
                                        </FaLinkedin>
                                    </Nav.Link>
                                    <Nav.Link
                                        href="https://x.com/QuartzionTech"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Quartzion X formerly twitter"
                                    >
                                        <FaXTwitter aria-hidden="true">
                                            <span className="visually-hidden">X (formerly Twitter)</span>
                                        </FaXTwitter>
                                    </Nav.Link>
                                </Nav>
                            </nav>
                        </div>
                    </section>
                </section>
            </Container>
        </footer>
    );
};