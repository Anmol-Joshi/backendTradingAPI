const express = require('express');
const router = express.Router();
const Trade = require('../models/trade.js');
const buyHelper = require('../middlewares/buyHelper');
const sellHelper = require('../middlewares/sellHelper');
const updateHelper = require('../middlewares/updateHelper');
const deleteHelper = require('../middlewares/deleteHelper');

// GET all trades
router.get('/', (req, res) => {
  Trade.find({})
    .then((trade) => {
      // if no trades present return appropriate response
      if (trade.length === 0) {
        return res.status(200).send({ message: 'No trade present' });
      }
      //group the trades according to the ticker symbol
      const result = {};
      for (let i = 0; i < trade.length; i++) {
        if (result[trade[i].tickerSymbol] !== undefined) {
          result[trade[i].tickerSymbol].push(trade[i]);
        } else {
          result[trade[i].tickerSymbol] = [];
          result[trade[i].tickerSymbol].push(trade[i]);
        }
      }
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(400).send({ error: 'Unable to fetch trade' });
    });
});

// POST trade
router.post('/', (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'Empty body sent in request' });
  }
  const tradeBody = req.body;

  if (!req.body.tickerSymbol) {
    return res
      .status(400)
      .send({ error: 'tickerSymbol must be present in body' });
  }
  if (!req.body.price) {
    return res.status(400).send({ error: 'price must be present in body' });
  }
  if (!req.body.quantity) {
    return res.status(400).send({ error: 'quantity must be present in body' });
  }
  if (req.body.price <= 0) {
    return res.status(400).send({ message: 'price must be greater than 0' });
  }
  if (req.body.quantity <= 0) {
    return res.status(400).send({ error: 'quantity must be greater than 0' });
  }
  if (!req.body.tradeType) {
    return res.status(400).send({ error: 'tradeType must be present in body' });
  }
  if (
    tradeBody.tradeType.toUpperCase() !== 'BUY' &&
    tradeBody.tradeType.toUpperCase() !== 'SELL'
  ) {
    return res.status(400).send({ error: 'tradeType should be BUY or SELL' });
  }
  if (req.body.tradeType.toUpperCase() == 'BUY') {
    buyHelper.buyTradeHandler(req, res);
  } else if (req.body.tradeType.toUpperCase() == 'SELL') {
    sellHelper.sellTradeHandler(req, res);
  }
});

// PUT trade
router.put('/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'Empty body sent in request' });
  }
  const { price, quantity, tradeType } = req.body;

  if (!req.body.price) {
    return res.status(400).send({ error: 'price must be present in body' });
  }
  if (!req.body.quantity) {
    return res.status(400).send({ error: 'quantity must be present in body' });
  }
  if (req.body.price <= 0) {
    return res.status(400).send({ message: 'price must be greater than  0' });
  }
  if (req.body.quantity <= 0) {
    return res.status(400).send({ error: 'quantity must be greater than  0' });
  }
  if (!req.body.tradeType) {
    return res.status(400).send({ error: 'tradeType must be present in body' });
  }
  if (
    req.body.tradeType.toUpperCase() !== 'BUY' &&
    req.body.tradeType.toUpperCase() !== 'SELL'
  ) {
    return res.status(400).send({ error: 'tradeType should be BUY or SELL' });
  }
  updateHelper.updateTrade(req, res);
});

// DELETE trade
router.delete('/:id', (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .send({ error: 'Id must be present in the DELETE request' });
  }
  const checkIfTradeExists = async (req, res) => {
    const trade = await Trade.find({ tradeId: req.params.id });
    if (trade.length == 0) {
      return res.status(400).send({ error: 'Invalid tradeId sent' });
    }
    deleteHelper.deleteTradeHandler(req, res);
  };
  checkIfTradeExists(req, res);
});

module.exports = router;
