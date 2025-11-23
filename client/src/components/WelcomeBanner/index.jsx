import React from 'react';
export default function WelcomeBanner() {
    return (
        <header className="welcome-banner">
              
            <picture>
                <source srcSet='./welcome-banner-1.webp' type='image/webp' />
                <img
                    src="./welcome-banner-1.png"
                    alt="Welcome to Quartzion Technology Solutions"
                />
            </picture>
            <div className="overlay" /> 
            <section className="welcome-banner-content">
                <h1>We are Quartzion Technology Solutions Corp.</h1>
                <p>Empowering businesses with cutting-edge technology and exceptional service.</p>
            </section>
        </header>

    );
};