const Trade = require('../models/trade.js');
const Portfolio = require('../models/portfolio.js');
const updatePortfolio = require('../middlewares/updatePortfolio');
//Invokes addToPortfolio and adds the BUY Trades in db.
const updateTrade = async (req, res) => {
  const { price, quantity, tradeType } = req.body;
  //sign1-> sign1=1 when tradeType(current trade) value="BUY" and -1 when "SELL"
  //sign2-> sign2=1 when new value(for trade)="BUY" and -1 when "SELL"
  let sign1 = 1,
    sign2 = 1;
  const trade = await Trade.findOne({ tradeId: req.params.id });
  if (!trade) {
    return res.status(400).send({ error: 'Invalid tradeId provided' });
  }
  if (trade.tradeType.toUpperCase() === 'SELL') {
    sign1 = -1;
  }
  if (tradeType.toUpperCase() === 'SELL') {
    sign2 = -1;
  }
  const portfolio = await Portfolio.findOne({
    tickerSymbol: trade.tickerSymbol,
  });
  // validate if portfolio value goes -ive or not if transaction succeeds
  // if it goes -ive, send error, else execute trade
  if (portfolio.quantity + quantity * sign2 - sign1 * trade.quantity < 0) {
    return res.status(400).send({
      error:
        "Can't execute update order because security quantity can't be -ive",
    });
  }
  trade.quantity = quantity;
  trade.tradeType = tradeType.toUpperCase();
  trade.price = price;
  const tradeSavedFlag = await trade.save();

  if (!tradeSavedFlag) {
    return res.status(500).send({ error: 'Error while updating trade' });
  }
  updatePortfolio.updatePortfolioForTicker(req, res, trade.tickerSymbol);
};

module.exports = {
  updateTrade,
};
