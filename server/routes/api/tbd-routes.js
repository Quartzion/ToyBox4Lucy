const express = require('express');
const router = require('express').Router();

const {
    updateToyBoxDataWithPassword,
    getCampaignData,
    decrementGiftCount
} = require('../../controllers/toyBoxDataController');

router.route('/toyBoxSettings')
    .put(updateToyBoxDataWithPassword)
    .get(getCampaignData);

router.route('/toyBoxSettings/decrement')
    .post(decrementGiftCount);

module.exports = router;