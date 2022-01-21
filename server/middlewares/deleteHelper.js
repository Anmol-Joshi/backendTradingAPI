const Trade = require('../models/trade.js');
const IdCounter = require('../models/idCounter.js');
const Portfolio = require('../models/portfolio.js');
const updatePortfolio = require('../middlewares/updatePortfolio');

// checks if tradeId is valid, if valid, delete the trade, else return appropriate response
const deleteTradeHandler = async (req, res) => {
  const { id } = req.params;
  const trade = await Trade.findOne({ tradeId: id });
  const tickerSymbol = trade.tickerSymbol;
  if (!trade) {
    return res.status(400).send({ error: 'Invalid trade id' });
  }
  if (trade.tradeType === 'BUY') {
    const portfolio = await Portfolio.findOne({
      tickerSymbol: trade.tickerSymbol,
    });
    if (portfolio.quantity < trade.quantity) {
      return res.status(400).send({
        error:
          "Can't delete trade because value of security will become negative ",
      });
    }
  }
  const deleteResult = await Trade.findOneAndDelete({ tradeId: id });
  if (!deleteResult) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
  updatePortfolio.updatePortfolioForTicker(req, res, tickerSymbol);
};
module.exports = {
  deleteTradeHandler,
};
