import React, { useState, Suspense, useEffect } from 'react'
import { Alert, Button, Table, Spinner } from 'react-bootstrap';
import GeneralForm from '../GeneralForm'
import { updateToyBoxSettings, getFollowUpRecords, adminLogin } from '../../utils/API';

const adminSettingsFields = [
    { label: "Admin Password", name: "adminPassword", type: "password", required: true, placeholder: "Enter admin password"},
    { label: "Occasion", name: "occasion", type:"text"},
    { label: "Number of Boys", name: "numberOfBoys", type: "text"},
    { label: "Number of Girls", name: "numberOfGirls", type: "text"},
    { label: "Total Gifts", name: "totalGifts", type:"text"},
    { label: "Campaign", name: "campaignRun", type:"text"},
    { label: "Last Day for Gifts", name:"lastDayForGifts", placeholder: "MM-DD-YYYY", type:"text"},
    { label: "Address For Gifts", name:"sendGiftsAddress", type:"text"}
];

export default function AdminSettings({formClass = "admin-settings", onSuccess}) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("success");
    const [formData, setFormData] = useState({});
    const [adminPassword, setAdminPassword] = useState("");
    const [donorRecords, setDonorRecords] = useState(null);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [showRecords, setShowRecords] = useState(false);

    // When AdminSettings is mounted (visible), add a body class so other components can pause behavior (e.g., carousel)
    useEffect(() => {
        document.body.classList.add('overlay-open');
        return () => {
            document.body.classList.remove('overlay-open');
        };
    }, []);

    const handleAdminSubmit = async (data) => {
        setFormData(data);
        setAdminPassword(data.adminPassword);
        try {
            const response = await updateToyBoxSettings(data);
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

            // Call onSuccess callback and close panel after brief delay
            setTimeout(() => {
                onSuccess?.();
            }, 1500);
        } catch (err) {
            console.error("Error updating settings:", err);
            setAlertVariant("danger");
            setAlertMessage("An error occurred while updating settings");
            setShowAlert(true);
        }
    };

    const handleGetDonorRecords = async () => {
        if (!adminPassword) {
            setAlertVariant("warning");
            setAlertMessage("Please enter the admin password in the form above to retrieve donor records");
            setShowAlert(true);
            return;
        }

        setIsLoadingRecords(true);
        try {
            // First authenticate (login) to receive HttpOnly admin cookie
            const loginRes = await adminLogin(adminPassword);
            if (!loginRes.ok) {
                const errBody = await loginRes.json().catch(() => ({}));
                setAlertVariant("danger");
                setAlertMessage(errBody?.message || 'Invalid admin credentials');
                setShowAlert(true);
                setIsLoadingRecords(false);
                return;
            }

            const response = await getFollowUpRecords(adminPassword);
            const result = await response.json();

            if (!response.ok) {
                console.error(result);
                setAlertVariant("danger");
                setAlertMessage(result?.message || 'Failed to retrieve donor records');
                setShowAlert(true);
                setDonorRecords(null);
                setShowRecords(false);
                return;
            }

            setDonorRecords(result);
            setShowRecords(true);
            setAlertVariant("success");
            setAlertMessage(`Retrieved ${result.length || 0} donor record(s)`);
            setShowAlert(true);
            // Clear the admin password so the user must re-enter it for the next query
            setAdminPassword("");
            setFormData(prev => ({ ...prev, adminPassword: "" }));
        } catch (err) {
            console.error("Error retrieving donor records:", err);
            setAlertVariant("danger");
            setAlertMessage("An error occurred while retrieving donor records");
            setShowAlert(true);
            setDonorRecords(null);
            setShowRecords(false);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    return (
        <>
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
        <section className='donor-details'>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <h5>Retrieve Donor Records</h5>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Enter your admin password to view donation records</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="donor-password-input" style={{ display: 'block', marginBottom: '0.5rem' }}>Admin Password: </label>
                        <input
                            id="donor-password-input"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="Enter admin password"
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <Button 
                        onClick={handleGetDonorRecords}
                        disabled={isLoadingRecords}
                        variant="info"
                        size="sm"
                    >
                        {isLoadingRecords ? (
                            <>
                                <Spinner animation="border" size="sm" style={{ marginRight: '0.5rem' }} />
                                Loading...
                            </>
                        ) : (
                            'Get Records'
                        )}
                    </Button>
                </div>
            </div>
            {showRecords && donorRecords && donorRecords.length > 0 && (
                <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gift Type</th>
                                <th>Campaign</th>
                                <th>Notes</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donorRecords.map((record) => (
                                <tr key={record._id}>
                                    <td>{record.name}</td>
                                    <td>{record.email}</td>
                                    <td>{record.phone}</td>
                                    <td>{record.giftType || 'N/A'}</td>
                                    <td>{record.campaignRun || 'N/A'}</td>
                                    <td>{record.notes || '-'}</td>
                                    <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </section>
        </>
    )
};