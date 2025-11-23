import React from 'react';
export default function AboutUs() {
    return (
        <section aria-labelledby="about-us" className="about-us-section">
            <hr className="divider" />
            <header className="about-us-header">
                <h2 id="about-us">About Us</h2>
            </header>
            <article className="about-us-content">
                <div className="about-us-text">
                    <h3>Our Expertise</h3>
                    <p>At Quartzion Technology Solutions Corp., we are a mission-driven technology development and consulting firm dedicated to empowering nonprofits, community organizations, and socially conscious teams.
                        We specialize in full-stack development, systems integration, and strategic tech consulting—delivering scalable, affordable solutions that help mission-aligned organizations modernize their operations, improve service delivery, and expand their reach.
                        Our team brings decades of experience in technical analysis, backend engineering, API development, and project leadership, combining deep technical expertise with a human-centered approach to problem-solving.
                        We’re here to bridge the technology gap—not by offering one-size-fits-all tools, but by designing and implementing custom solutions that reduce overhead, improve access, and fuel long-term impact.
                        We believe that technology should be a catalyst for equity, not a barrier—and we exist to make that belief a reality.
                    </p>
                </div>
            </article>
            <hr className="divider"/>
        </section>
    );
};