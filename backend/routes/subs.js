const express = require('express');
const router = express.Router();
const { getSupportedStocks, getStockHistory } = require('../utils/priceGenerator');

router.get('/supported', (req, res) => {
    res.json(getSupportedStocks());
});

router.get('/history/:ticker', (req, res) => {
    const { ticker } = req.params;
    const history = getStockHistory(ticker);
    res.json(history);
});

module.exports = router;
