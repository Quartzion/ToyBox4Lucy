import React,  { Suspense } from 'react';
import { Container } from 'react-bootstrap'
// const QtsPayPal = React.lazy(() => import("../QtsPayPal"))
const occasion = 'Christmas'

export default function Header() {

    return (
        <header className="tb4l-Header">
            <Container fluid className="header-container">
                <section className="header-text">
                    <div className="title">
                        <h2 className="header-title">Lucy's Toy Box</h2>
                    </div>
                    <div className="slogan">
                        <h2 className="header-slogan">Help us make a great day for kids this {occasion}!</h2>
                        {/* <QtsPayPal /> */}
                    </div>
                </section>
                <h1 className="visually-hidden">Lucy's Toy Box Logo</h1>
                <picture>
                    <source srcSet='./lt4b-logo-1.webp' type="image/webp"/>
                    <img 
                        src="./lt4b-logo-1.webp" 
                        alt="Lucy's Toy Box Logo" 
                        className="header-logo"
                        loading='lazy'
                    />
                </picture>
            </Container>
        </header>
    );
};