import React, { useState, Suspense, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import GeneralForm from '../GeneralForm';
import { createFollowUpRequest, decrementToyBoxGiftCount } from '../../utils/API';
import { getApiBaseUrl } from '../../utils/env';
const QtsPayPal = React.lazy(()=> import("../QtsPayPal"));

const PayPalFallback = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading payment options...</span>
        </Spinner>
    </div>
);

const handleDonation = async (toyCount) => {
  try {
    await fetch(`${API_BASE_URL}/api/decrementToyBoxGiftCountByDonation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: toyCount })
    });
  } catch (err) {
    console.error("Error applying toy count decrement from donation:", err);
  }
};


const API_BASE_URL = getApiBaseUrl();

const connectWithUsFormFields = [
  { label: "Your Name", name: "name", type: "text", required: true, placeholder: "Name", autoComplete: "on" },
  { label: "Your Email", name: "email", type: "email", required: true, placeholder: "email", autoComplete: "on" },
  { label: "Your Phone Number", name: "phone", type: "tel", required: false, placeholder: "e.g. (555) 123-4567", autoComplete: "tel" },
  { label: "Additional Notes", name: "notes", type: "textarea", required: false, autoComplete: "off" },
];

const connectWithUsFormDetails = "By clicking confirm you are agreeing to send a gift to the address listed above, Thank you!";


export default function ConnectWithUsForm({ formClass = "connect-with-us-form-fields", onSuccess, onError, giftType }) {
  const [cwuFormdata, setCwuFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [campaignRun, setCampaignRun] = useState(null);
  const [sendGiftsAddress, setSendGiftsAddress ] = useState(null);

  // When ConnectWithUsForm is mounted (visible), add a body class so other components can pause behavior (e.g., carousel)
  useEffect(() => {
    document.body.classList.add('overlay-open');
    return () => {
      document.body.classList.remove('overlay-open');
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCwuFormData({ ...cwuFormdata, [name]: value });
  };

  // Fetch campaignRun from toy box settings on mount
  React.useEffect(() => {
    const fetchCampaignRun = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/toyBoxSettings`);
        if (!res.ok) return;
        const data = await res.json();
        const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (doc?.campaignRun) {
          setCampaignRun(doc.campaignRun);
        }
        if (doc?.sendGiftsAddress) {
          setSendGiftsAddress(doc.sendGiftsAddress);
        }
      } catch (err) {
        console.error('Error fetching campaignRun:', err);
      }
    };
    fetchCampaignRun();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      // Include giftType and campaignRun in the submission data
      const dataWithMetadata = { ...formData, giftType, campaignRun };
      const response = await createFollowUpRequest(dataWithMetadata);
      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        throw new Error(result?.message || 'Sorry, something went wrong with this request.');
      }

      // If followUp was created successfully, decrement the toy box gift count
      if (giftType) {
        try {
          const decrementRes = await decrementToyBoxGiftCount(giftType);
          if (!decrementRes.ok) {
            console.warn('Warning: followUp created but failed to decrement gift count', decrementRes.status);
          }
        } catch (err) {
          console.error('Error decrementing gift count:', err);
          // Don't throw - the followUp was already created successfully
        }
      }

      onSuccess?.();   
      setShowAlert(false);  
      setCwuFormData({         
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      setShowAlert(true);
      onError?.(err.message);
    }
  };

  return (
    <>
    <section className="cwu-disclaimer">
      <p> Please send gifts to:</p>
      <p> Peter Smith - Quartzion Technology Solutions </p>
      <p> </p>
      <p>{sendGiftsAddress}</p>
    </section>
    <br />
    <article>
      <GeneralForm
        fields={connectWithUsFormFields}
        submitLabel='Click here to confirm'
        formClass={formClass}
        formDetails={connectWithUsFormDetails}
        onSubmit={handleFormSubmit}
      />
      <br/>
      {/*Error Alert */}
      {showAlert && (
        <Alert variant="danger">
          Sorry, something went wrong. Please try again later.
        </Alert>
      )}
      <br/>
      <Suspense fallback={<PayPalFallback />}>
        <QtsPayPal onDonation={handleDonation}/>
      </Suspense>
    </article>
    </>
  );
}
