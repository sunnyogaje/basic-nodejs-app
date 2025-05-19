const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const sendUSDT = require('./send-usdt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-usdt', async (req, res) => {
  const { recipient, amount } = req.body;

  if (!recipient || !amount) {
    return res.status(400).json({ message: 'Missing recipient or amount' });
  }

  try {
    const txHash = await sendUSDT(recipient, amount);
    res.json({ message: 'Success', txHash });
  } catch (err) {
    res.status(500).json({ message: 'Transaction failed', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
