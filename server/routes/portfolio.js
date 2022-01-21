const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio');

// GET all portfolio elements
router.get('/', (req, res) => {
  Portfolio.find({})
    .then((portfolio) => {
      const result = portfolio.filter((x) => x.quantity > 0);
      if (result.length === 0) {
        return res
          .status(200)
          .send({ message: 'Portfolio is currently empty' });
      }
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(400).send({ error: 'Unable to fetch portfolio' });
    });
});

// GET portfolio return(Profit/Loss), current price is assumed as 100
router.get('/returns', (req, res) => {
  Portfolio.find({})
    .then((portfolio) => {
      // const result = portfolio.filter((x) => x.quantity > 0);
      const result = portfolio.reduce(function (accumulator, current) {
        accumulator += current.quantity * (100 - current.averagePrice);
        return accumulator;
      }, 0);
      if (result < 0) {
        return res
          .status(200)
          .send({ message: 'Portfolio loss is: ' + result });
      }
      return res
        .status(200)
        .send({ message: 'Portfolio profit is: ' + result });
    })
    .catch((err) => {
      return res.status(400).send({ error: 'Unable to fetch portfolio' });
    });
});
module.exports = router;
