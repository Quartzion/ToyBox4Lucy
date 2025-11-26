import React, { useState, Suspense } from 'react'
import GeneralForm from '../GeneralForm'

const adminSettingsFields = [
    { label: "Admin Password", name: "adminPassword", type: "text", required: true},
    { label: "Total number of kids for this campaign", name: "totalKidsForCampaign", type: "text" },
    { label: "Number of Boys", name: "numberOfBoys", type: "text"},
    { label: "Number of Girls", name: "numberOfGirls", type: "text"},
    { label: "Campaign", name: "campaignRun", type:"text"}
];

export default function AdminSettings({formClass = "admin-settings"}) {

return (
    <section className="admin-settings-panel" id="admin-settings-panel">
        <GeneralForm 
            fields={adminSettingsFields}
            submitLabel='set toy box data'
            formClass={formClass}
        />
    </section>
)
};