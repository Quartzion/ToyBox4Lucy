const express = require('express');
const router = require('express').Router();

const {
    updateToyBoxData,
    getCampaignData
} = require('../../controllers/toyBoxDataController');

router.route('/toyBoxSettings')
    .put(updateToyBoxData)
    .get(getCampaignData);

module.exports = router;