const Trade = require('../models/trade.js');
const IdCounter = require('../models/idCounter.js');
const Portfolio = require('../models/portfolio.js');

//Invokes sellFromPortfolio and adds the SELL Trades in db.
const sellTradeHandler = async (req, res) => {
  const portfolioElement = await Portfolio.findOne({
    tickerSymbol: req.body.tickerSymbol,
  });
  if (!portfolioElement) {
    return res
      .status(400)
      .send({ error: "Can't sell security which isn't in portfolio" });
  }
  if (portfolioElement) {
    if (portfolioElement.quantity < req.body.quantity) {
      return res
        .status(400)
        .send({ error: 'Not enough quantity to execute sell order' });
    } else {
      const tradeReturn = await sellFromPortfolio(req, res);

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
        // create a new trade
        const trade = new Trade({
          tickerSymbol: req.body.tickerSymbol.toUpperCase(),
          tradeId: tradeId,
          price: req.body.price,
          quantity: req.body.quantity,
          tradeType: req.body.tradeType.toUpperCase(),
        });
        // save the trade
        const result = await trade.save();
        if (result) {
          const messageResponse = 'Profit/Loss is ' + tradeReturn;
          return res.status(200).send(messageResponse);
        } else {
          return res.status(400).send('err in saving trade');
        }
      }
    }
  } else {
    return res
      .status(400)
      .send({ error: 'Ticker element not present in portfolio' });
  }
};

//Adds the SELL trades to portfolio
const sellFromPortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({
    tickerSymbol: req.body.tickerSymbol.toUpperCase(),
  });
  const tradeReturn =
    req.body.quantity * (req.body.price - portfolio.averagePrice);
  portfolio.quantity = portfolio.quantity - req.body.quantity;
  const result = await portfolio.save();

  if (result) {
    return tradeReturn;
  } else {
    return res.status(400).send({ error: 'Portfolio not updated' });
  }
};
module.exports = {
  sellTradeHandler,
};
