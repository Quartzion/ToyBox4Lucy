require('dotenv').config();
const ToyBoxData = require('../models/toyBoxData');

module.exports = {
    async updateToyBoxData({ body}, res ){
        try {

            const toyBoxDataRequest = await ToyBoxData.updateOne(body);
            if(!toyBoxDataRequest) {
                return res.status(400).json({
                    message: "Please provide the necessary data in the body of the request, thank you"
                })
            }
            // Success
            return res.status(200).json(toyBoxDataRequest);

        } catch (err) {
            console.error("Sorry, Something went wrong here is the error for the engineers", err);
            return res.status(501).json({
                message: "Something went wrong...we're sorry",
                error: err.message
            })
        }
    },

    // get campaign data
    async getCampaignData (req, res) {
        try {
            const toyBoxDataRequest = await ToyBoxData.find({});

            if(!toyBoxDataRequest || toyBoxDataRequest.length === 0){
                return res.status(204).json({message: "there is no campaign data in the database"})
            }
            return res.status(200).json(toyBoxDataRequest)
        } catch (err) {
            res.status(501).json({message:"Can not get data - sorry"});
        }
    }
}