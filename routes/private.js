const express = require('express');

const router = express.Router();

const {getPrivateData, changePassword} = require('../controllers/private');

const protect = require('../middleware/auth');

router.route('/').get(protect, getPrivateData);

router.route('/changePassword').post(protect, changePassword);

module.exports = router