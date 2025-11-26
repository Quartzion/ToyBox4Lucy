const { Schema, model } = require('mongoose');

const toyBoxDataSchema = new Schema(
    {
        totalGifts: {
            type: String,
            required: true
        },
        totalKidsForCampaign: {
            type: String,
            required: true
        },
        numberOfBoys: {
            type: String,
            required: true
        },
        numberOfGirls: {
            type: String,
            required: true
        },
        lastDayForGifts: {
            type: String,
        },
        campaignRun: {
            type: String,
            required: true
        }
    }
);

const ToyBoxData = model('ToyBoxData', toyBoxDataSchema);
module.exports = ToyBoxData;
