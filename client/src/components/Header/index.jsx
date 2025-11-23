import React,  { Suspense } from 'react';
import { Container } from 'react-bootstrap'
const QtsPayPal = React.lazy(() => import("../QtsPayPal"))

export default function Header() {

    return (
        <header className="QTS-Header">
            <Container fluid className="header-container">
                <h1 className="visually-hidden">Quartzion Technology Solutions Logo</h1>
                <picture>
                    <source srcSet="./QTS_L2_W_C.webp" type="image/webp"/>
                    <img 
                        src="./QTS_L2_W_C.png" 
                        alt="Quartzion Logo" 
                        className="header-logo"
                        loading='lazy'
                    />
                </picture>
                <section className="header-text">
                    <div className="slogan">
                        <h2 className="header-slogan">Future Ready. Community Focused.</h2>
                        <QtsPayPal />
                    </div>
                    <div className="title">
                        <h2 className="header-title">Quartzion Technology Solutions Corp.</h2>
                    </div>
                </section>
            </Container>
        </header>
    );
};