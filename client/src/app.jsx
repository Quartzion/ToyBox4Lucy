import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { isProd, getApiBaseUrl, getPayPalClientId } from '../../client/src/utils/env';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToyBoxProvider } from './context/ToyBoxContext';
import './appStyle.css'


export default function App() {

    if (isProd()) {
        console.log('Running in production mode');
    }

    const API_BASE_URL = getApiBaseUrl();
    const VITE_PAYPAL_APP_CLIENT = getPayPalClientId();
    
    useEffect(() => {
        const wakeup = async () => {
            try {
                await fetch(`${API_BASE_URL}/api/ping`);
                console.log('😃 API wakeup ping sent');
            } catch (err) {
                console.error('😴API Wakeup Falied!?', err)
            }
        };
        wakeup();

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                wakeup();
            }
        }, 14 * 60 * 1000);//14 min interval

        return () => clearInterval(interval);

    }, [API_BASE_URL]);

    return (
        <PayPalScriptProvider options={{ "client-id": `${VITE_PAYPAL_APP_CLIENT}`}}>
            <ToyBoxProvider>
            <div className='appStyle-main-content'>
                <Header />
                <Outlet />
                <Footer />
            </div>
            </ToyBoxProvider>
        </PayPalScriptProvider>
    );
};