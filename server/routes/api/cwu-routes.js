const express = require('express');
const apiLimiter = require('../../middleware/rateLimiter');
const adminAuth = require('../../middleware/adminAuth');
const router = require('express').Router();


const {
    createFollowUpRequest,
    getAllFollowUpRequests,
    deleteOneFollowUpRequest,
    deleteAllFollowUpRequests
} = require('../../controllers/followUpController');

router.route('/cwu')
    .post(apiLimiter, createFollowUpRequest)
    .get(adminAuth, getAllFollowUpRequests)
    .delete(adminAuth, deleteAllFollowUpRequests);
    
router.route('/cwu/:id').delete(adminAuth, deleteOneFollowUpRequest);

module.exports = router;