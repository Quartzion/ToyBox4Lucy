const { Schema, model } = require('mongoose');

const followUpDataSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number']
        },
        notes: {
            type: String,
        },
        giftType: {
            type: String,
            required: false,
            enum: ['Boy Gift', 'Girl Gift'],
            trim: true
        },
        campaignRun: {
            type: String,
            required: false,
            trim: true
        },

    },
    {
        timestamps: true
    }
);

const FollowUpData = model('FollowUpData', followUpDataSchema);
module.exports = FollowUpData;