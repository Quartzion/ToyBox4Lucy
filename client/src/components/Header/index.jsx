import React,  { Suspense } from 'react';
import { Container } from 'react-bootstrap'
const QtsPayPal = React.lazy(() => import("../QtsPayPal"))

export default function Header() {

    return (
        <header className="tb4l-Header">
            <Container fluid className="header-container">
                <h1 className="visually-hidden">Lucy's Toy Box Logo</h1>
                <picture>
                    <source srcSet='./' type="image/webp"/>
                    <img 
                        src="./" 
                        alt="Lucy's Toy Box Logo" 
                        className="header-logo"
                        loading='lazy'
                    />
                </picture>
                <section className="header-text">
                    <div className="slogan">
                        <h2 className="header-slogan">Help us make a great day for kids!</h2>
                        <QtsPayPal />
                    </div>
                    <div className="title">
                        <h2 className="header-title">Lucy's Toy Box</h2>
                    </div>
                </section>
            </Container>
        </header>
    );
};