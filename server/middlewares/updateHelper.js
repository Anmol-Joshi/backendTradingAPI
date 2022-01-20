const Trade = require('../models/trade.js');
const Portfolio = require('../models/portfolio.js');

//Invokes addToPortfolio and adds the BUY Trades in db.
const updateToBuyTrade = async (req, res) => {
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
  // get average buy price for a particular Security
  const avgBuyPrice = await Trade.aggregate([
    {
      $match: {
        $and: [{ tickerSymbol: trade.tickerSymbol }, { tradeType: 'BUY' }],
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
        $and: [{ tickerSymbol: trade.tickerSymbol }, { tradeType: 'BUY' }],
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
        $and: [{ tickerSymbol: trade.tickerSymbol }, { tradeType: 'SELL' }],
      },
    },
    {
      $group: {
        _id: 'quantity',
        quantity: { $sum: '$quantity' },
      },
    },
  ]);
  portfolio.averagePrice = avgBuyPrice[0].average;
  if (sellQuantity[0] !== undefined) {
    portfolio.quantity = buyQuantity[0].quantity - sellQuantity[0].quantity;
  } else {
    portfolio.quantity = buyQuantity[0].quantity;
  }
  const updatePortfolioResult = await portfolio.save();
  if (!updatePortfolioResult) {
    return res.status(500).send({ error: 'Failed to save trade' });
  } else {
    return res.status(200).send({ message: 'Trade and portfolio updated' });
  }
};

module.exports = {
  updateToBuyTrade,
};
