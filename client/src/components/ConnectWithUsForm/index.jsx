import React, { useState, useEffect, Suspense } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import GeneralForm from '../GeneralForm';
import { createFollowUpRequest, decrementToyBoxGiftCount, decrementOneToy } from '../../utils/API';
import { getApiBaseUrl } from '../../utils/env';

const QtsPayPal = React.lazy(() => import("../QtsPayPal"));
const API_BASE_URL = getApiBaseUrl();

const PayPalFallback = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading payment options...</span>
    </Spinner>
  </div>
);

const connectWithUsFormFields = [
  { label: "Your Name", name: "name", type: "text", required: true, placeholder: "Name", autoComplete: "on" },
  { label: "Your Email", name: "email", type: "email", required: true, placeholder: "email", autoComplete: "on" },
  { label: "Your Phone Number", name: "phone", type: "tel", required: false, placeholder: "e.g. (555) 123-4567", autoComplete: "tel" },
  { label: "Additional Notes", name: "notes", type: "textarea", required: false, autoComplete: "off" },
];

const connectWithUsFormDetails =
  "By clicking confirm you are agreeing to send a gift to the address listed above. Thank you!";

export default function ConnectWithUsForm({ formClass = "connect-with-us-form-fields", onSuccess, onError, giftType }) {
  const [cwuFormdata, setCwuFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [campaignRun, setCampaignRun] = useState(null);
  const [sendGiftsAddress, setSendGiftsAddress] = useState(null);

  useEffect(() => {
    document.body.classList.add('overlay-open');
    return () => document.body.classList.remove('overlay-open');
  }, []);

  const handleInputChange = (e) => {
    setCwuFormData({ ...cwuFormdata, [e.target.name]: e.target.value });
  };

  // Load campaign settings
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
        if (!res.ok) return;
        const data = await res.json();
        const doc = Array.isArray(data) && data[0] ? data[0] : null;

        setCampaignRun(doc?.campaignRun || null);
        setSendGiftsAddress(doc?.sendGiftsAddress || null);
      } catch (err) {
        console.error("Error loading campaign settings:", err);
      }
    })();
  }, []);

  // Toy decrement callback for PayPal
  const handleDonation = async (toyCount) => {
    if (!toyCount || toyCount <= 0) return;

    try {
      for (let i = 0; i < toyCount; i++) {
        const { ok, status, data } = await decrementOneToy();
        if (!ok) console.warn("Failed to decrement a toy:", status, data);
      }
    } catch (err) {
      console.error("Error decrementing toys via PayPal:", err);
    }
  };

  // CWU form submission (gift shipping)
  const handleFormSubmit = async (formData) => {
    try {
      const payload = { ...formData, giftType, campaignRun };
      const response = await createFollowUpRequest(payload);
      const result = await response.json();

      if (!response.ok) throw new Error(result?.message || "Something went wrong submitting your request.");

      // Decrement giftType count
      if (giftType) {
        const dec = await decrementToyBoxGiftCount(giftType);
        if (!dec.ok) console.warn("Gift type decrement failed:", dec.status, dec.data);
      }

      setCwuFormData({ name: "", email: "", phone: "", notes: "" });
      setShowAlert(false);
      onSuccess?.();
    } catch (err) {
      console.error("Form submission error:", err);
      setShowAlert(true);
      onError?.(err.message);
    }
  };

  return (
    <>
      <section className="cwu-disclaimer">
        <p>Please send gifts to:</p>
        <p>Peter Smith - Quartzion Technology Solutions</p>
        <p>{sendGiftsAddress}</p>
      </section>

      <br />

      <article>
        <GeneralForm
          fields={connectWithUsFormFields}
          formClass={formClass}
          submitLabel="Click here to confirm"
          formDetails={connectWithUsFormDetails}
          onSubmit={handleFormSubmit}
        />

        {showAlert && <Alert variant="danger">Sorry, something went wrong. Please try again.</Alert>}

        <br />

        <Suspense fallback={<PayPalFallback />}>
          <QtsPayPal onDonation={handleDonation} />
        </Suspense>
      </article>
    </>
  );
}
