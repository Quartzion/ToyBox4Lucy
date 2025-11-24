import { Outlet } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import WelcomeBanner from '../components/WelcomeBanner';
import TeamSection from '../components/TeamSection';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Blogs from '../components/Blogs';
import ConnectWithUs from '../components/ConnectWithUs';
import HelmetJsonLd from '../components/HelmetJsonLd';

export default function Page1() {

    return (
        <>
            <Helmet>
                <title>Lucy's Toy Box</title>
                <link rel="canonical" href="" />
            </Helmet>
            < HelmetJsonLd />
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <main id="main-content" className="py-2">
                {/* <WelcomeBanner /> */}
                {/* <TeamSection /> */}
                <AboutUs />
                {/* <ConnectWithUs />
                <hr className="divider"/> */}
                <Services />
                {/* <Blogs /> */}
            </main>
            <Outlet />
        </>
    );
};