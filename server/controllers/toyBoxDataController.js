require('dotenv').config();
const ToyBoxData = require('../models/toyBoxData');

module.exports = {
    // update toy box data with password protection
    async updateToyBoxDataWithPassword({ body }, res) {
        try {
            const { adminPassword, numberOfBoys, numberOfGirls, totalBearsForBox, campaignRun, totalGifts, lastDayForGifts, occasion, sendGiftsAddress } = body;

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
            if ( totalBearsForBox !== undefined && totalBearsForBox !== null) {
                updateData.totalBearsForBox = String(totalBearsForBox);
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

    // decrement gift count (supports single or multiple, specific or auto)
    async decrementGiftCount(req, res) {
        try {
            const { count, mode = "specific", giftType, strategy = "balanced" } = req.body;

            if (!count || count < 1) {
                return res.status(400).json({ message: "Count must be >= 1" });
            }

            const toyBoxData = await ToyBoxData.findOne({});
            if (!toyBoxData) {
                return res.status(404).json({ message: "Toy box data not found" });
            }

            let numberOfBoys = parseInt(toyBoxData.numberOfBoys, 10) || 0;
            let numberOfGirls = parseInt(toyBoxData.numberOfGirls, 10) || 0;

            let decremented = { boys: 0, girls: 0 };

            // -----------------------------
            // MODE: SPECIFIC (one from form)
            // -----------------------------
            if (mode === "specific") {
                if (!giftType) {
                    return res.status(400).json({ message: "giftType is required for mode:'specific'" });
                }

                for (let i = 0; i < count; i++) {
                    if (giftType === "Boy Gift" && numberOfBoys > 0) {
                        numberOfBoys--;
                        decremented.boys++;
                    }
                    else if (giftType === "Girl Gift" && numberOfGirls > 0) {
                        numberOfGirls--;
                        decremented.girls++;
                    }
                    else {
                        break;
                    }
                }
            }

            // -----------------------------
            // MODE: AUTO (PayPal donations)
            // -----------------------------
            else if (mode === "auto") {
                for (let i = 0; i < count; i++) {
                    // pick which bucket to decrement
                    let pick;

                    if (strategy === "random") {
                        pick = Math.random() < 0.5 ? "boy" : "girl";
                    } else {
                        // balanced mode: pick whichever has more remaining
                        pick = numberOfBoys >= numberOfGirls ? "boy" : "girl";
                    }

                    // decrement whichever is available
                    if (pick === "boy" && numberOfBoys > 0) {
                        numberOfBoys--;
                        decremented.boys++;
                    }
                    else if (pick === "girl" && numberOfGirls > 0) {
                        numberOfGirls--;
                        decremented.girls++;
                    }
                    else if (numberOfBoys > 0) {
                        numberOfBoys--;
                        decremented.boys++;
                    }
                    else if (numberOfGirls > 0) {
                        numberOfGirls--;
                        decremented.girls++;
                    }
                    else {
                        break; // out of gifts
                    }
                }
            }

            // -----------------------------
            // Save update
            // -----------------------------
            const updatedData = await ToyBoxData.findOneAndUpdate(
                {},
                {
                    numberOfBoys,
                    numberOfGirls
                },
                { new: true }
            );

            return res.status(200).json({
                message: `Successfully decremented gifts.`,
                decremented,
                data: updatedData
            });

        } catch (err) {
            console.error("Error decrementing gift count:", err);
            return res.status(500).json({
                message: "Server error",
                error: err.message
            });
        }
    },

    // Decrement one gift of whichever type is available 
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