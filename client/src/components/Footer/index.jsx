import React, { useState, Suspense } from 'react';
import { getQtsVersion } from '../../utils/env';
import {
    Container,
    Nav,
    Button
} from 'react-bootstrap';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import AdminSettings from '../AdminSettings';
// const QtsPayPal = React.lazy(()=> import("../QtsPayPal"))

export default function Footer() {
    const [showAdminSettings, setShowAdminSettings] = useState(false);

    const toggleAdminSettings = () => {
        setShowAdminSettings(!showAdminSettings);
    };

    return (
        <footer className="QTS-Header">
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
                    </section>
                    <section className="footer-right">
                        <h2 className="visually-hidden">Company Logo</h2>
                        <picture>
                            <source srcSet="./lt4b-logo-1.webp" type="image/webp" />
                            <img 
                                src="./lt4b-logo-1.png" 
                                alt="Lucy's Toy Box Logo" 
                                className="header-logo" 
                                loading='lazy'
                            />
                        </picture>                        
                        {/* <nav id="footer-social-links" aria-label="Follow us on Social Media" className="footer-links">
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
                        </nav> */}
                    </section>
                    <section className="footer-center">
                        <h2 className="visually-hidden">legal</h2>
                        &copy; {new Date().getFullYear()} - Lucy's Toy Box. All rights reserved. - version - {getQtsVersion()}
                    {/* <QtsPayPal /> */}
                    </section>
                </section>
            </Container>
        </footer>
    );
};