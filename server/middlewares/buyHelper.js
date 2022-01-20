const Trade = require('../models/trade.js');
const IdCounter = require('../models/idCounter.js');
const Portfolio = require('../models/portfolio.js');

//Invokes addToPortfolio and adds the BUY Trades in db.
const buyTradeHandler = async (req, res) => {
  addToPortfolio(req, res);
  // used to generate trade id to be used for tracking trades
  let response = await IdCounter.updateMany({}, { $inc: { tradeId: 1 } });
  if (response.err) {
    return res.status(500).send({
      error:
        'Internal Server Error(Error occured while fetching tradeId from db)',
    });
  } else {
    //get tradeId for creating trade
    const { tradeId } = await IdCounter.findOne({});
    const trade = new Trade({
      tickerSymbol: req.body.tickerSymbol.toUpperCase(),
      tradeId: tradeId,
      price: req.body.price,
      quantity: req.body.quantity,
      tradeType: req.body.tradeType.toUpperCase(),
    });
    const result = await trade.save();
    if (result) {
      return res.status(200).send('Trade saved');
    } else {
      return res.status(400).send('err in saving trade');
    }
  }
};

//Adds the BUY trades to portfolio
const addToPortfolio = async (req, res) => {
  const existingSecurityFlag = await Portfolio.exists({
    tickerSymbol: req.body.tickerSymbol,
  });
  if (existingSecurityFlag === true) {
    const portfolio = await Portfolio.findOne({
      tickerSymbol: req.body.tickerSymbol.toUpperCase(),
    });
    // get access to current average price and quantity and also
    // the new buy values to update values in portfolio
    const currentAveragePrice = portfolio.averagePrice;
    const currentQuantity = portfolio.quantity;
    const tradePrice = req.body.price;
    const tradeQuantity = req.body.quantity;
    const newQuantity = tradeQuantity + currentQuantity;
    const newTotalSum =
      currentQuantity * currentAveragePrice + tradeQuantity * tradePrice;
    const newAveragePrice = newTotalSum / newQuantity;
    portfolio.averagePrice = newAveragePrice;
    portfolio.quantity = newQuantity;
    await portfolio.save();
  } else {
    const portfolio = new Portfolio({
      tickerSymbol: req.body.tickerSymbol.toUpperCase(),
      averagePrice: req.body.price,
      quantity: req.body.quantity,
    });
    const result = await portfolio.save();
    if (result) {
    } else {
      return res.status(400).send('Portfolio not updated');
    }
  }
};
module.exports = {
  buyTradeHandler,
};
