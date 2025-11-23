import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import GeneralForm from '../GeneralForm';
import { createFollowUpRequest } from '../../utils/API';

const connectWithUsFormFields = [
  { label: "Your Name", name: "name", type: "text", required: true, placeholder: "Name", autoComplete: "on" },
  { label: "Your Organization", name: "organization", type: "text", required: true, placeholder: "nonprofit organization", autoComplete: "on" },
  { label: "Your Email", name: "email", type: "email", required: true, placeholder: "email", autoComplete: "on" },
  { label: "Your Phone Number", name: "phone", type: "tel", required: true, placeholder: "e.g. (555) 123-4567", autoComplete: "tel" },
  { label: "Your Budget", name: "budget", type: "radio", required: true, options: [
      { label: "small: (<$500)", value: "small" },
      { label: "medium: ($500 - $1000)", value: "medium" },
      { label: "large: (>$1000)", value: "large" },
      { label: "extra large (>$5000)", value: "xlarge" }
  ] },
  { label: "What Service Are You Requesting", 
    name: "service", 
    type: "radio", 
    required: false, 
    options: [
      { label: "Technical Analysis", value: "technical_analysis" }, 
      { label: "Troubleshooting Session", value: "troubleshooting_session" },
      { label: "Solution Development / Implementation", value: "solution_development" }, 
      { label: "Technology Upgrade", value: "technology_upgrade" }, 
      { label: "Technical Audit", value: "technical_audit" },
      { label: "Website Performance & Accessibility Improvements", value: "website_performance_accessibility" },
      { label: "Strategic Tech Planning", value: "strategic_tech_planning" },
      { label: "Form / Survey / Intake Setup & Optimization", value: "form_survey_intake_setup" },
      { label: "Internal Tech Skills Workshops", value: "internal_tech_workshops" },
    ] },
  { label: "Organization Size", name: "orgSize", type: "radio", required: true, options: [
      { label: "small (1-10 members)", value: "small" },
      { label: "medium (10-50 members)", value: "medium" },
      { label: "Large (50+ members)", value: "large" }
  ] },
  { label: "What Priority is your technology need", name: "priority", type: "radio", required: false, options: [
      { label: "low", value: "low" },
      { label: "medium", value: "medium" },
      { label: "high", value: "high" }
  ] },
  { label: "Additional Notes for The engineers", name: "notes", type: "textarea", required: false, autoComplete: "off" },
];

export default function ConnectWithUsForm({ formClass = "connect-with-us-form-fields", onSuccess, onError }) {
  const [cwuFormdata, setCwuFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    budget: '',
    service: '',
    orgSize: '',
    priority: '',
    notes: ''
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCwuFormData({ ...cwuFormdata, [name]: value });
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await createFollowUpRequest(formData);
      const result = await response.json();

      if (!response.ok) {
        console.error(result);
        throw new Error(result?.message || 'Sorry, something went wrong with this request.');
      }

      onSuccess?.();   
      setShowAlert(false);  
      setCwuFormData({         
        name: '',
        organization: '',
        email: '',
        phone: '',
        budget: '',
        service: '',
        orgSize: '',
        priority: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      setShowAlert(true);
      onError?.(err.message);
    }
  };

  return (
    <article>
      <GeneralForm
        fields={connectWithUsFormFields}
        submitLabel='Submit'
        formClass={formClass}
        onSubmit={handleFormSubmit}
      />
      <br/>
      {/*Error Alert */}
      {showAlert && (
        <Alert variant="danger">
          Sorry, something went wrong. Please try again later.
        </Alert>
      )}
    </article>
  );
}
