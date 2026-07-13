const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post('/pay', async (req, res) => {
  try {
    const { phone, amount, plan } = req.body;
    const response = await axios.post(
      'https://payment.intasend.com/api/v3/payment/mpesa-stk-push/',
      {
        amount: amount,
        phone_number: "254" + phone.replace(/^0/, "").replace(/^254/, ""),
        api_ref: `spark-${Date.now()}`,
        currency: 'KES',
        narrative: plan
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.INTASEND_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.json({ success: false, error: err.response?.data || err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ status: '💘 Spark payment server running!' });
});

app.listen(process.env.PORT || 3001, () => console.log('✅ Server running'));