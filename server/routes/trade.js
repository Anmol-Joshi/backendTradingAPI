const express = require('express');
const router = express.Router();
const Trade = require('../models/trade.js');
const IdCounter = require('../models/idCounter.js');
const buyHelper = require('../middlewares/buyHelper');

router.post('/', (req, res) => {
  if (!req.body) {
    res.status(400).send({ error: 'Empty body sent in request' });
    return;
  }
  const tradeBody = req.body;

  if (!tradeBody) {
    res.status(400).send({ error: 'tradeBody not present in request' });
    return;
  }
  if (req.body.tradeType.toUpperCase() == 'BUY') {
    buyHelper.createAndSaveNewBuyTrade(req, res);
  } else if (req.body.tradeType.toUpperCase() == 'SELL') {
    createAndSaveNewSellTrade(req, res);
    async function createAndSaveNewSellTrade(req, res) {
      let response = IdCounter.updateMany({}, { $inc: { tradeId: 1 } });
      if (response.err) {
        console.log('error', err);
      } else {
        await IdCounter.updateMany({}, { $inc: { tradeId: 1 } });
        const { tradeId } = await IdCounter.findOne({});
        console.log(req.body);
        const trade = new Trade({
          tickerSymbol: req.body.tickerSymbol,
          tradeId: tradeId,
          price: req.body.price,
          quantity: req.body.quantity,
          tradeType: req.body.tradeType,
        });
        const result = await trade.save();
        if (result) {
          res.status(200).send('Trade saved');
        } else {
          res.status(400).send('Trade saved');
        }
      }
    }
  }
});
router.get('/', (req, res) => {
  Trade.find({}).then((trade) => {
    console.log(trade);
  });
  res.send({ Hello: 'World' });
});
module.exports = router;
