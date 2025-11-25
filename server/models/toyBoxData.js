const { Schema, model } = require('mongoose');

const toyBoxDataSchema = new Schema(
    {
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

        campaignRun: {
            type: String,
            required: true
        }
    }
);

const ToyBoxData = model('ToyBoxData', toyBoxDataSchema);
module.exports = ToyBoxData;
