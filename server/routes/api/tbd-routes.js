const express = require('express');
const router = require('express').Router();

const {
    updateToyBoxDataWithPassword,
    getCampaignData,
    decrementGiftCount,
    decrementOneAvailableGift
} = require('../../controllers/toyBoxDataController');

router.route('/toyBoxSettings')
    .put(updateToyBoxDataWithPassword)
    .get(getCampaignData);

router.route('/toyBoxSettings/decrement')
    .post(decrementGiftCount);

router.route('/toyBoxSettings/decrementOne')
    .post(decrementOneAvailableGift);


module.exports = router;