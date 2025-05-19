require('dotenv').config();
const express = require('express');
const sendUSDT = require('./send-usdt');
const app = express();
app.use(express.json());

app.post('/send-usdt', async (req, res) => {
  const { recipient, amount } = req.body;

  if (!recipient || !amount) {
    return res.status(400).json({ error: 'Missing recipient or amount' });
  }

  const result = await sendUSDT(recipient, amount);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});