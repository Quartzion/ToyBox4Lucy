const { Schema, model } = require('mongoose');

const followUpDataSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        organization: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number']
        },
        budget: {
            type: String,
            required: false,
            trim: true
        },
        service: {
            type: String,
            required: false,
        },
        orgSize: {
            type: String,
            required: false,
        },
        priority: {
            type: String,
            required: false,
        },
        notes: {
            type: String,
            required: false
        },

    },
    {
        timestamps: true
    }
);

const FollowUpData = model('FollowUpData', followUpDataSchema);
module.exports = FollowUpData;