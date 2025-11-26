const express = require('express');
const router = require('express').Router();

const {
    updateToyBoxData,
    getCampaignData,
    decrementGiftCount
} = require('../../controllers/toyBoxDataController');

router.route('/toyBoxSettings')
    .put(updateToyBoxData)
    .get(getCampaignData);

router.route('/toyBoxSettings/decrement')
    .post(decrementGiftCount);

module.exports = router;