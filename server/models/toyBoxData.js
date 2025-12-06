const { Schema, model } = require('mongoose');

const toyBoxDataSchema = new Schema(
    {
        occasion: {
            type: String,
            required: true
        },
        totalGifts: {
            type: Number,
            required: true
        },
        numberOfBoys: {
            type: Number,
            required: true
        },
        numberOfGirls: {
            type: Number,
            required: true
        },
        totalBearsForBox: {
            type: Number,
            required: true
        },
        lastDayForGifts: {
            type: String,
        },
        campaignRun: {
            type: String,
            required: true
        },
        sendGiftsAddress: {
            type: String,
            required: true
        }
    }
);

const ToyBoxData = model('ToyBoxData', toyBoxDataSchema);
module.exports = ToyBoxData;
