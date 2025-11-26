import React, { useState, Suspense } from 'react'
import { Alert } from 'react-bootstrap';
import GeneralForm from '../GeneralForm'
import { updateToyBoxSettings } from '../../utils/API';

const adminSettingsFields = [
    { label: "Admin Password", name: "adminPassword", type: "password", required: true, placeholder: "Enter admin password"},
    { label: "Total number of kids for this campaign", name: "totalKidsForCampaign", type: "text" },
    { label: "Number of Boys", name: "numberOfBoys", type: "text"},
    { label: "Number of Girls", name: "numberOfGirls", type: "text"},
    { label: "Campaign", name: "campaignRun", type:"text"}
];

export default function AdminSettings({formClass = "admin-settings"}) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("success");

    const handleAdminSubmit = async (formData) => {
        try {
            const response = await updateToyBoxSettings(formData);
            const result = await response.json();

            if (!response.ok) {
                console.error(result);
                setAlertVariant("danger");
                setAlertMessage(result?.message || 'Failed to update settings');
                setShowAlert(true);
                return;
            }

            setAlertVariant("success");
            setAlertMessage("Toy box settings updated successfully!");
            setShowAlert(true);

            // Optionally hide alert after 5 seconds
            setTimeout(() => setShowAlert(false), 5000);
        } catch (err) {
            console.error("Error updating settings:", err);
            setAlertVariant("danger");
            setAlertMessage("An error occurred while updating settings");
            setShowAlert(true);
        }
    };

    return (
        <section className="admin-settings-panel" id="admin-settings-panel">
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <GeneralForm 
                fields={adminSettingsFields}
                submitLabel='set toy box data'
                formClass={formClass}
                onSubmit={handleAdminSubmit}
            />
        </section>
    )
};