require('dotenv').config();
const ToyBoxData = require('../models/toyBoxData');

module.exports = {
    // update toy box data with password protection
    async updateToyBoxDataWithPassword({ body }, res) {
        try {
            const { adminPassword, totalKidsForCampaign, numberOfBoys, numberOfGirls, campaignRun, totalGifts } = body;

            // Validate password
            if (!adminPassword) {
                return res.status(400).json({
                    message: "Admin password is required"
                });
            }

            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
            if (!ADMIN_PASSWORD) {
                console.error("ADMIN_PASSWORD environment variable not set");
                return res.status(500).json({
                    message: "Server configuration error"
                });
            }

            if (adminPassword !== ADMIN_PASSWORD) {
                return res.status(403).json({
                    message: "Invalid admin password"
                });
            }

            // Build update object, excluding the password field
            const updateData = {};
            if (totalKidsForCampaign !== undefined && totalKidsForCampaign !== null) {
                updateData.totalKidsForCampaign = String(totalKidsForCampaign);
            }
            if (numberOfBoys !== undefined && numberOfBoys !== null) {
                updateData.numberOfBoys = String(numberOfBoys);
            }
            if (numberOfGirls !== undefined && numberOfGirls !== null) {
                updateData.numberOfGirls = String(numberOfGirls);
            }
            if (campaignRun !== undefined && campaignRun !== null) {
                updateData.campaignRun = String(campaignRun);
            }
            if (totalGifts !== undefined && totalGifts !== null) {
                updateData.totalGifts = String(totalGifts);
            }

            // Update the first toy box data document
            const updatedData = await ToyBoxData.findOneAndUpdate({}, updateData, { new: true });

            if (!updatedData) {
                return res.status(404).json({
                    message: "Toy box data not found"
                });
            }

            return res.status(200).json({
                message: "Toy box settings updated successfully",
                data: updatedData
            });

        } catch (err) {
            console.error("Error updating toy box data:", err);
            return res.status(501).json({
                message: "Something went wrong...we're sorry",
                error: err.message
            });
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
    },

    // decrement gift count by giftType (Boy Gift or Girl Gift)
    async decrementGiftCount(req, res) {
        try {
            const { giftType } = req.body;

            if (!giftType) {
                return res.status(400).json({ message: "giftType is required (e.g., 'Boy Gift' or 'Girl Gift')" });
            }

            let fieldToUpdate = null;
            if (giftType === "Boy Gift") {
                fieldToUpdate = "numberOfBoys";
            } else if (giftType === "Girl Gift") {
                fieldToUpdate = "numberOfGirls";
            } else {
                return res.status(400).json({ message: "Invalid giftType. Must be 'Boy Gift' or 'Girl Gift'" });
            }

            // Fetch the current document, convert to number, decrement, and save
            const toyBoxData = await ToyBoxData.findOne({});
            if (!toyBoxData) {
                return res.status(404).json({ message: "Toy box data not found" });
            }

            // Convert current string value to number and decrement
            const currentValue = parseInt(toyBoxData[fieldToUpdate], 10) || 0;
            const newValue = Math.max(currentValue - 1, 0); // Ensure it doesn't go below 0

            // Update with the new numeric value
            const updateQuery = { [fieldToUpdate]: newValue.toString() };
            const updatedData = await ToyBoxData.findOneAndUpdate({}, updateQuery, { new: true });

            return res.status(200).json({
                message: `Successfully decremented ${giftType}`,
                data: updatedData
            });
        } catch (err) {
            console.error("Error decrementing gift count:", err);
            return res.status(501).json({
                message: "Something went wrong...we're sorry",
                error: err.message
            });
        }
    }
}