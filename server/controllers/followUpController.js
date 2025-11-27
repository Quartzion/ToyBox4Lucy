require('dotenv').config();
const { now } = require('mongoose');
const FollowUpData = require('../models/followUpData');

function validateAdminPassword(req, res) {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
        console.error("ADMIN_PASSWORD environment variable not set");
        res.status(500).json({ message: "Server configuration error" });
        return false;
    }

    const adminPassword = req.body?.adminPassword || req.query?.adminPassword || req.headers['x-api-secret'];
    if (!adminPassword) {
        res.status(403).json({ message: "Admin credentials required" });
        return false;
    }

    if (adminPassword !== ADMIN_PASSWORD) {
        res.status(403).json({ message: "Invalid admin password" });
        return false;
    }

    return true;
}

module.exports = {
    async createFollowUpRequest({ body }, res) {
        try {
            const followUpRequest = await FollowUpData.create(body);
            if (!followUpRequest) {
                return res.status(400).json({
                    message: "Sorry, something went wrong - please try again"
                });
            }

            const date = now();
            console.log(`A new follow-up request has been made - id: ${followUpRequest.id} - ${date}`);

            return res.status(200).json(followUpRequest);

        } catch (err) {
            console.error("[ERROR] Failed to create follow-up:", err);
            return res.status(501).json({
                message: "We're sorry, something went wrong, please try again later.",
                error: err.message
            });
        }
    },

    async getAllFollowUpRequests(req, res) {
        if (!validateAdminPassword(req, res)) return;

        try {
            const followUpRequests = await FollowUpData.find({});
            if (!followUpRequests || followUpRequests.length === 0) {
                return res.status(204).json({ message: "No Follow Up Requests At This Time" });
            }

            return res.status(200).json(followUpRequests);

        } catch (err) {
            console.error("Error fetching follow-up requests:", err);
            return res.status(500).json({ message: "Something went wrong, please try again later." });
        }
    },

    async deleteOneFollowUpRequest(req, res) {
        if (!validateAdminPassword(req, res)) return;

        try {
            const followUpRequest = await FollowUpData.findByIdAndDelete(req.params.id);
            if (!followUpRequest) {
                return res.status(404).json({ message: "No records found with this ID" });
            }
            return res.status(200).json({ message: "Follow-up record has been permanently deleted" });

        } catch (err) {
            console.error("Error deleting follow-up request:", err);
            return res.status(500).json({ message: "Something went wrong, please try again later." });
        }
    },

    async deleteAllFollowUpRequests(req, res) {
        if (!validateAdminPassword(req, res)) return;

        try {
            const result = await FollowUpData.deleteMany({});
            if (!result.deletedCount) {
                return res.status(404).json({ message: "No follow-up requests to delete" });
            }
            return res.status(200).json({ message: "All follow-up records deleted" });

        } catch (err) {
            console.error("Error deleting all follow-up requests:", err);
            return res.status(500).json({ message: "Something went wrong, please try again later." });
        }
    }
};
