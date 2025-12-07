import { Container } from 'react-bootstrap'
import { useToyBoxSettings } from '../../context/ToyBoxSettingsContex';
import LucysToyBox from '../LucysToyBox';

export default function Header() {
    const {
        settings,
        loading,
        error,
    } = useToyBoxSettings();

    // conditional rendering
    if (loading || !settings) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p className='loading-message'><strong>Please wait while we get the most current info…</strong></p>
                </article>
                <hr className="divider" />
            </section>
        );
    }
    if (error) {
        return (
            <section className="about-us-section image-overlay">
                <hr className="divider" />
                <article className="about-us-content">
                    <p style={{ color: "red" }}>
                        Unable to load information. Please try again shortly.
                    </p>
                </article>
                <hr className="divider" />
            </section>
        );
    }
    const { occasion } = settings;
    return (
        <header className="tb4l-Header image-overlay">
            <Container fluid className="header-container">
                <section className="header-text">
                    <div className="tb4l-title">
                        <h2 className="header-title">Lucy's Toy Box</h2>
                    </div>
                    <div className="tb4l-slogan">
                        <h2 className="header-slogan">Help us make a great day for kids this {occasion}!</h2>
                    </div>
                </section>
                <h1 className="visually-hidden">Lucy's Toy Box Logo</h1>
                <LucysToyBox />
            </Container>
        </header>
    );
};