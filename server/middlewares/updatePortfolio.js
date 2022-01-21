const Trade = require('../models/trade.js');
const Portfolio = require('../models/portfolio.js');

// update portfolio with quantity and average buy price
const updatePortfolioForTicker = async (req, res, tickerSymbol) => {
  // get average buy price for a particular Security
  const portfolio = await Portfolio.findOne({
    tickerSymbol: tickerSymbol,
  });

  // get average buy price for a particular Security
  const avgBuyPrice = await Trade.aggregate([
    {
      $match: {
        $and: [{ tickerSymbol: tickerSymbol }, { tradeType: 'BUY' }],
      },
    },
    {
      $group: {
        _id: 'weighted average',
        numerator: { $sum: { $multiply: ['$price', '$quantity'] } },
        denominator: { $sum: '$quantity' },
      },
    },
    {
      $project: {
        average: { $divide: ['$numerator', '$denominator'] },
      },
    },
  ]);
  //get total BUY quantity for particular Security
  const buyQuantity = await Trade.aggregate([
    {
      $match: {
        $and: [{ tickerSymbol: tickerSymbol }, { tradeType: 'BUY' }],
      },
    },
    {
      $group: {
        _id: 'quantity',
        quantity: { $sum: '$quantity' },
      },
    },
  ]);
  //get total SELL quantity for particular Security
  const sellQuantity = await Trade.aggregate([
    {
      $match: {
        $and: [{ tickerSymbol: tickerSymbol }, { tradeType: 'SELL' }],
      },
    },
    {
      $group: {
        _id: 'quantity',
        quantity: { $sum: '$quantity' },
      },
    },
  ]);
  //no trade present, so delete from portfolio
  if (buyQuantity[0] === undefined && sellQuantity[0] == undefined) {
    const deleteResult = await Portfolio.findOneAndDelete({
      tickerSymbol: tickerSymbol,
    });
    // if deleted, send success response, else send failure response
    if (deleteResult) {
      return res
        .status(200)
        .send({ message: 'Trade and portfolio updated/deleted' });
    } else {
      return res
        .status(500)
        .send({ error: 'Failed to update/delete trade or portfolio ' });
    }
  } else if (sellQuantity[0] !== undefined) {
    portfolio.quantity = buyQuantity[0].quantity - sellQuantity[0].quantity;
  }
  // if sellQuantity isn't present, that means no sell trade present, so we can do calculations without it
  else {
    portfolio.quantity = buyQuantity[0].quantity;
  }
  portfolio.averagePrice = avgBuyPrice[0].average;
  // save values in portfolio and return success/failure message after that
  const updatePortfolioResult = await portfolio.save();
  if (!updatePortfolioResult) {
    return res.status(500).send({ error: 'Failed to save portfolio' });
  } else {
    return res
      .status(200)
      .send({ message: 'Trade and portfolio updated/deleted' });
  }
};

module.exports = {
  updatePortfolioForTicker,
};
