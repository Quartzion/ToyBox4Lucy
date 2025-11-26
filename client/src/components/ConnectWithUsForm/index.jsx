import React, { useState, Suspense, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import GeneralForm from '../GeneralForm';
import { createFollowUpRequest, decrementToyBoxGiftCount } from '../../utils/API';
const QtsPayPal = React.lazy(()=> import("../QtsPayPal"));

const PayPalFallback = () => (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading payment options...</span>
        </Spinner>
    </div>
);

const connectWithUsFormFields = [
  { label: "Your Name", name: "name", type: "text", required: true, placeholder: "Name", autoComplete: "on" },
  // { label: "Your Organization", name: "organization", type: "text", required: true, placeholder: "nonprofit organization", autoComplete: "on" },
  { label: "Your Email", name: "email", type: "email", required: true, placeholder: "email", autoComplete: "on" },
  { label: "Your Phone Number", name: "phone", type: "tel", required: false, placeholder: "e.g. (555) 123-4567", autoComplete: "tel" },
  // { label: "Your Budget", name: "budget", type: "radio", required: true, options: [
  //     { label: "small: (<$500)", value: "small" },
  //     { label: "medium: ($500 - $1000)", value: "medium" },
  //     { label: "large: (>$1000)", value: "large" },
  //     { label: "extra large (>$5000)", value: "xlarge" }
  // ] },
  // { label: "What Service Are You Requesting", 
  //   name: "service", 
  //   type: "radio", 
  //   required: false, 
  //   options: [
  //     { label: "Technical Analysis", value: "technical_analysis" }, 
  //     { label: "Troubleshooting Session", value: "troubleshooting_session" },
  //     { label: "Solution Development / Implementation", value: "solution_development" }, 
  //     { label: "Technology Upgrade", value: "technology_upgrade" }, 
  //     { label: "Technical Audit", value: "technical_audit" },
  //     { label: "Website Performance & Accessibility Improvements", value: "website_performance_accessibility" },
  //     { label: "Strategic Tech Planning", value: "strategic_tech_planning" },
  //     { label: "Form / Survey / Intake Setup & Optimization", value: "form_survey_intake_setup" },
  //     { label: "Internal Tech Skills Workshops", value: "internal_tech_workshops" },
  //   ] },
  // { label: "Organization Size", name: "orgSize", type: "radio", required: true, options: [
  //     { label: "small (1-10 members)", value: "small" },
  //     { label: "medium (10-50 members)", value: "medium" },
  //     { label: "Large (50+ members)", value: "large" }
  // ] },
  // { label: "What Priority is your technology need", name: "priority", type: "radio", required: false, options: [
  //     { label: "low", value: "low" },
  //     { label: "medium", value: "medium" },
  //     { label: "high", value: "high" }
  // ] },
  { label: "Additional Notes", name: "notes", type: "textarea", required: false, autoComplete: "off" },
];

const connectWithUsFormDetails = "By clicking confirm you are agreeing to send a gift to the address listed above, Thank you!";


export default function ConnectWithUsForm({ formClass = "connect-with-us-form-fields", onSuccess, onError, giftType }) {
  const [cwuFormdata, setCwuFormData] = useState({
    name: '',
    // organization: '',
    email: '',
    phone: '',
    // budget: '',
    // service: '',
    // orgSize: '',
    // priority: '',
    notes: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [campaignRun, setCampaignRun] = useState(null);

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
        const res = await fetch('/api/toyBoxSettings');
        if (!res.ok) return;
        const data = await res.json();
        const doc = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (doc?.campaignRun) {
          setCampaignRun(doc.campaignRun);
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
        // organization: '',
        email: '',
        phone: '',
        // budget: '',
        // service: '',
        // orgSize: '',
        // priority: '',
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
      <p> 690 Navarez Ave #253,  Safety Harbor FL 34695</p>
    </section>
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
        <QtsPayPal />
      </Suspense>
    </article>
    </>
  );
}
