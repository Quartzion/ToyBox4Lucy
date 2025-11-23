const express = require('express');
const apiLimiter = require('../../middleware/rateLimiter');
const router = require('express').Router();


const {
    createFollowUpRequest,
    getAllFollowUpRequests,
    deleteOneFollowUpRequest,
    deleteAllFollowUpRequests
} = require('../../controllers/followUpController');

router.route('/cwu')
    .post(apiLimiter, createFollowUpRequest)
    .get(getAllFollowUpRequests)
    .delete(deleteAllFollowUpRequests);
    
router.route('/cwu/:id').delete(deleteOneFollowUpRequest);

module.exports = router;