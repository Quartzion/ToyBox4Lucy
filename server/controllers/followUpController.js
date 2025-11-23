require('dotenv').config()
const { now } = require('mongoose');
const FollowUpData = require('../models/followUpData')

module.exports = {
    async createFollowUpRequest({ body }, res) {
        try {
            const followUpRequest = await FollowUpData.create(body);
            if (!followUpRequest) {
                return res.status(400).json({
                    message: "sorry, something went wrong - please try again"
                })

            }
            //  Success
            const date = now();
            console.log(`A new follow up request has been made - id: ${followUpRequest.id} - ${date}`);
            return res.status(200).json(followUpRequest);


        } catch (err) {
            console.error("[ERROR] Failed to create follow-up:", err);
            return res.status(501).json({
                message: "We're sorry, something went wrong, our engineers have been alerted please try again after some time.",
                error: err.message
            });
        }
    },

    /**
 * @swagger
 * /cwu:
 *   get:
 *     summary: Get all follow-up requests
 *     description: Requires x-api-secret header. Returns all follow-up request data.
 *     tags:
 *       - FollowUpRequests
 *     parameters:
 *       - in: header
 *         name: x-api-secret
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API secret key
 *     responses:
 *       200:
 *         description: A list of follow-up requests
 *       204:
 *         description: No data found
 *       403:
 *         description: Forbidden - invalid or missing secret
 */

    async getAllFollowUpRequests(req, res) {

        const auth = req.headers['x-api-secret']
        if (auth !== process.env.INTERNAL_API_SECRET) {
            return res.status(403).json({ message: 'forbidden' })
        }
        try {
            const followUpRequests = await FollowUpData.find({});

            if (!followUpRequests || followUpRequests.length === 0) {
                return res.status(204).json({ message: "No Follow Up Requests At This Time" })
            }
            return res.status(200).json(followUpRequests)
        } catch (err) {
            return res.status(400).json({ message: "sorry something went wrong, our engineers have been notified. Please try again later, thank you." })
        }
    },

    async deleteOneFollowUpRequest(req, res) {
        try {
            const auth = req.headers['x-api-secret']
            if (auth !== process.env.INTERNAL_API_SECRET) {
                return res.status(403).json({ message: 'forbidden' })
            }
            const followUpRequest = await FollowUpData.findByIdAndDelete(req.params.id);
            if (!followUpRequest) {
                return res.status(404).json({ message: "No records found with this id, please check again" })
            }
            return res.status(200).json({ message: "THIS FOLLOW UP RECORD HAS BEEN PERMANENTLY DELETED" })
        } catch (err) {
            return res.status(500).json({ message: "Sorry something went wrong, Our engineers have been notified. Please try again later" })
        }
    },

    async deleteAllFollowUpRequests(req, res) {
        const auth = req.headers['x-api-secret']
        if (auth !== process.env.INTERNAL_API_SECRET) {
            return res.status(403).json({ message: 'forbidden' })
        }
        try {
            const followUpRequests = await FollowUpData.deleteMany({});
            if (!followUpRequests.deletedCount) {
                return res.status(404).json({ message: "THere are no follow up requests at this time" })
            }
            res.status(200).json({ message: "All RECORDS DELETED" });
        } catch (err) {
            return res.status(500).json({ message: "Sorry something went wront, our engineers have been notified. Please try again later" })
        }

    }
};