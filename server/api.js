const express = require('express');
const router = express.Router();

const app = express();

const trades = require('./routes/trade.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/trade', trades);

module.exports = router;
