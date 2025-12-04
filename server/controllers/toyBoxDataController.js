require('dotenv').config();
const ToyBoxData = require('../models/toyBoxData');

module.exports = {
    // update toy box data with password protection
    async updateToyBoxDataWithPassword({ body }, res) {
        try {
            const { adminPassword, numberOfBoys, numberOfGirls, campaignRun, totalGifts, lastDayForGifts, occasion, sendGiftsAddress } = body;

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
            if (lastDayForGifts !== undefined && lastDayForGifts !== null) {
                updateData.lastDayForGifts = String(lastDayForGifts);
            }
            if (occasion !== undefined && occasion !== null) {
                updateData.occasion = String(occasion);
            }
            if (sendGiftsAddress !== undefined && sendGiftsAddress !== null) {
                updateData.sendGiftsAddress = String(sendGiftsAddress)
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
    async getCampaignData(req, res) {
        try {
            const toyBoxDataRequest = await ToyBoxData.find({});

            if (!toyBoxDataRequest || toyBoxDataRequest.length === 0) {
                return res.status(204).json({ message: "there is no campaign data in the database" })
            }
            return res.status(200).json(toyBoxDataRequest)
        } catch (err) {
            res.status(501).json({ message: "Can not get data - sorry" });
        }
    },

    // decrement gift count by giftType (Boy Gift or Girl Gift)
    async decrementGiftCount(req, res) {
        try {
            const { giftType, count = 1 } = req.body;

            if (!giftType) {
                return res.status(400).json({ message: "giftType is required (e.g., 'Boy Gift' or 'Girl Gift')" });
            }

            let fieldToUpdate;
            if (giftType === "Boy Gift") {
                fieldToUpdate = "numberOfBoys";
            } else if (giftType === "Girl Gift") {
                fieldToUpdate = "numberOfGirls";
            } else {
                return res.status(400).json({ message: "Invalid giftType. Must be 'Boy Gift' or 'Girl Gift'" });
            }

            const toyBoxData = await ToyBoxData.findOne({});
            if (!toyBoxData) return res.status(404).json({ message: "Toy box data not found" });

            const currentValue = parseInt(toyBoxData[fieldToUpdate], 10) || 0;
            const newValue = Math.max(currentValue - count, 0); // decrement by `count`

            const updatedData = await ToyBoxData.findOneAndUpdate(
                {},
                { [fieldToUpdate]: newValue},
                { new: true }
            );
            console.log(`Decrementing ${giftType}: ${currentValue} -> ${newValue}`);
            return res.status(200).json({
                message: `Successfully decremented ${giftType} by ${count}`,
                data: updatedData
            });
        } catch (err) {
            console.error("Error decrementing gift count:", err);
            return res.status(501).json({
                message: "Something went wrong...we're sorry",
                error: err.message
            });
        }
    },

    // Decrement one gift of whichever type is available
    // Decrement one gift of whichever type is available (fixed)
async decrementOneAvailableGift(req, res) {
  try {
    const toyBoxData = await ToyBoxData.findOne({});
    if (!toyBoxData) return res.status(404).json({ message: "Toy box data not found" });

    // Ensure we are working with numbers
    const numberOfBoys = parseInt(toyBoxData.numberOfBoys, 10) || 0;
    const numberOfGirls = parseInt(toyBoxData.numberOfGirls, 10) || 0;

    let giftType;
    if (numberOfBoys > 0) {
      giftType = "Boy Gift";
    } else if (numberOfGirls > 0) {
      giftType = "Girl Gift";
    } else {
      return res.status(400).json({ message: "No gifts remaining" });
    }

    const fieldToUpdate = giftType === "Boy Gift" ? "numberOfBoys" : "numberOfGirls";
    const newValue = fieldToUpdate === "numberOfBoys" ? numberOfBoys - 1 : numberOfGirls - 1;

    const updatedData = await ToyBoxData.findOneAndUpdate(
      {},
      { [fieldToUpdate]: newValue },
      { new: true }
    );

    console.log(`Decremented ${giftType}: ${toyBoxData[fieldToUpdate]} -> ${newValue}`);
    console.log('Received request to decrementOne - remote:', req.ip);

    return res.status(200).json({ message: `Decremented 1 ${giftType}`, data: updatedData });
  } catch (err) {
    console.error("Error decrementing gift:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}




}