import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import HelmetJsonLd from '../components/HelmetJsonLd';

export default function Page1() {

    return (
        <>
            <Helmet>
                <title>Lucy's Toy Box</title>
                <link rel="canonical" href="" />
            </Helmet>
            < HelmetJsonLd />
            <a href="#main-content" className="skip-link visually-hidden">Skip to main content</a>
            <main id="main-content" className="py-2">
                <AboutUs />
                <Services />
            </main>
            <Outlet />
        </>
    );
};