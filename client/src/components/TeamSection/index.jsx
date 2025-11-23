import React, {Suspense} from 'react';
import { Nav } from 'react-bootstrap';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
const QtsPayPal = React.lazy(()=> import("../QtsPayPal"))
export default function TeamSection() {

    return (
        <section role="region" aria-labelledby="our-team">
            <article className="team-dialogue">
                <header className="team-dialogue-header">
                    <h1 id="our-team">The Team</h1>
                </header>
                <div className="team-dialogue-body">
                    <p> Pete and Joe share a deep commitment to leveraging technology as a force for good. With extensive experience in software engineering and organizational strategy, they co-founded Quartzion Technology Solutions Corp. to bridge the gap between innovation and impact.
                        Recognizing that many mission-driven organizations are underserved by high-cost consulting models, they set out to deliver affordable, scalable, and purpose-built technology solutions tailored to the unique needs of nonprofits, grassroots initiatives, and socially conscious teams.
                        Their vision is clear: empower organizations with the tools they need to streamline operations, improve community access, and scale their impact—without sacrificing their budget or values.</p>
                </div>
                <nav className="team-qts-socials">
                    <h2 className="visually-hidden">connect with us</h2>
                    <Nav>
                        <Nav.Link
                            href="https://github.com/Quartzion"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Quartzion GitHub"
                        >
                            <FaGithub className="team-qts-socials-icon" aria-hidden="true" />
                            <span className="visually-hidden">GitHub</span>
                        </Nav.Link>
                        <Nav.Link
                            href="https://www.linkedin.com/company/quartzion-technology-solutions-corp"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Quartzion LinkedIn"
                        >
                            <FaLinkedin className="team-qts-socials-icon" aria-hidden="true" />
                            <span className="visually-hidden">LinkedIn</span>
                        </Nav.Link>
                        <Nav.Link
                            href="https://x.com/QuartzionTech"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Quartzion X formerly Twitter"
                        >
                            <FaXTwitter className="team-qts-socials-icon" aria-hidden="true" />
                            <span className="visually-hidden">X formerly twitter</span>
                        </Nav.Link>
                    </Nav>
                </nav>
                <QtsPayPal />
            </article>
            <article className="team-members">
                <section id="peter-smith" className="team-member">
                    <div className="team-member-details">
                        <h2>Peter Smith</h2>
                        <h3>CEO & Co-Founder</h3>
                        <p>Peter Smith is a seasoned technology leader and full-stack engineer with nearly 20 years of experience delivering scalable, end-to-end solutions. With a background in software architecture, Quality Assurance and systems integration, he has assisted diverse teams in building robust, user-focused platforms for the pharmecutical and cybersecurity sectors.
                            Passionate about technology for social good, Peter focuses on helping mission-driven organizations improve access, reduce overhead, and implement sustainable, high-impact digital solutions.</p>
                        <nav className="team-member-socials" aria-label="Social Links for Peter Smith">
                            <h4 className="visually-hidden">Connect with Peter on Social Media</h4>
                            <Nav.Link
                                href="https://github.com/peteCodes4u"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Peter Smith's GitHub"
                            >
                                <FaGithub className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">GitHub</span>
                                </FaGithub>
                            </Nav.Link>
                            <Nav.Link
                                href="https://www.linkedin.com/in/peter-smith-117ba91a4/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Peter Smith's LinkedIn"
                            >
                                <FaLinkedin className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">LinkedIn</span>
                                </FaLinkedin>
                            </Nav.Link>
                            <Nav.Link
                                href="https://x.com/PeterSmithQTS"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Peter Smith's X formerly Twitter"
                            >
                                <FaXTwitter className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">X Formerly Twitter</span>
                                </FaXTwitter>
                            </Nav.Link>
                        </nav>
                    </div>
                    <picture>
                        <source srcSet='./pete-ceo-2.webp' type='image/webp'/>
                        <img 
                            src='./pete-ceo-2.png' 
                            alt='A Photo of Peter Smith standing in front of a bookcase' 
                            className='team-member-image' 
                            loading='lazy'
                        />
                    </picture>
                    
                </section>
                <section className="team-member">
                    <div className="team-member-details">
                        <h2>​Joseph Ruff</h2>
                        <h3>President & Co-Founder</h3>
                        <p>Joe brings a strong background in IT with an expertise in backend development, API design, and system architecture. He leads project planning and team coordination with a focus on building scalable, reliable solutions that serve both organizational goals and end-user needs.
                            With experience in customer support and client engagement, Joe ensures every solution is not only technically sound but also intuitive and mission-aligned.</p>
                        <nav className="team-member-socials" aria-label="Social Links for Joseph Ruff">
                            <h4 className="visually-hidden">Connect with Joe on Social Media</h4>
                            <Nav.Link
                                href="https://github.com/joegruff16"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Joseph Ruff's GitHub"
                            >
                                <FaGithub className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">GitHub</span>
                                </FaGithub>
                            </Nav.Link>
                            <Nav.Link
                                href="https://www.linkedin.com/in/joseph-ruff-gary0316/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Joseph Ruff's LinkedIn"
                            >
                                <FaLinkedin className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">LinkedIn</span>
                                </FaLinkedin>
                            </Nav.Link>
                            <Nav.Link
                                href="https://x.com/JosephRuffQTS"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Joseph Ruff's X formerly twitter"
                            >
                                <FaXTwitter className="team-member-socials-icon" aria-hidden="true">
                                    <span className="visually-hidden">X Formerly Twitter</span>
                                </FaXTwitter>
                            </Nav.Link>
                        </nav>
                    </div>
                    <picture>
                        <source srcSet='./Joe-president-2.webp' type='image/webp' />
                        <img 
                            src='./Joe-president-2.jpeg' 
                            alt='Portrait of Joseph Ruff wearing a suit' 
                            className='team-member-image' 
                            loading='lazy'
                        />
                    </picture>
                </section>
            </article>
        </section>
    );
};

