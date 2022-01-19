const Trade = require('../models/trade.js');
const IdCounter = require('../models/idCounter.js');
const Portfolio = require('../models/portfolio.js');

const addToPortfolio = async (req, res) => {
  const existingSecurityFlag = await Portfolio.exists({
    tickerSymbol: req.body.tickerSymbol,
  });
  if (existingSecurityFlag === true) {
    const portfolio = await Portfolio.findOne({
      tickerSymbol: req.body.tickerSymbol,
    });
    const currentPrice = portfolio.averagePrice;
    const currentQuantity = portfolio.quantity;
    const tradePrice = req.body.price;
    const tradeQuantity = req.body.quantity;
    const newQuantity = tradeQuantity + currentQuantity;
    const newTotalSum =
      currentQuantity * currentPrice + tradeQuantity * tradePrice;
    const newPrice = newTotalSum / newQuantity;
    portfolio.averagePrice = newPrice;
    portfolio.quantity = newQuantity;
    await portfolio.save();
  } else {
    const portfolio = new Portfolio({
      tickerSymbol: req.body.tickerSymbol,
      averagePrice: req.body.price,
      quantity: req.body.quantity,
    });
    const result = await portfolio.save();
    if (result) {
    } else {
      res.status(400).send('Portfolio not updated');
    }
  }
};
const createAndSaveNewBuyTrade = async (req, res) => {
  addToPortfolio(req, res);
  let response = IdCounter.updateMany({}, { $inc: { tradeId: 1 } });
  if (response.err) {
    console.log('error', err);
  } else {
    await IdCounter.updateMany({}, { $inc: { tradeId: 1 } });
    const { tradeId } = await IdCounter.findOne({});
    const trade = new Trade({
      tickerSymbol: req.body.tickerSymbol,
      tradeId: tradeId,
      price: req.body.price,
      quantity: req.body.quantity,
      tradeType: req.body.tradeType.toUpperCase(),
    });
    const result = await trade.save();
    if (result) {
      res.status(200).send('Trade saved');
    } else {
      res.status(400).send('err in saving trade');
    }
  }
};
module.exports = {
  createAndSaveNewBuyTrade,
};
