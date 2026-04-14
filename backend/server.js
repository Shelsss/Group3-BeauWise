const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 SEARCH ROUTE
app.post('/search', async (req, res) => {
  const { productName, notificationNumber } = req.body;

  let query = "";

  if (notificationNumber && notificationNumber.trim() !== "") {
    query = notificationNumber.trim().toUpperCase();
  } else if (productName && productName.trim() !== "") {
    query = productName.trim();
  } else {
    return res.status(400).json({
      success: false,
      error: 'Provide product name or notification number'
    });
  }

  console.log('🔍 Query:', query);

  try {
    const response = await axios.get(
      'https://verification.fda.gov.ph/api/search',
      {
        params: { q: query },
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Origin": "https://verification.fda.gov.ph",
          "Referer": "https://verification.fda.gov.ph/",
          "Connection": "keep-alive"
        }
      }
    );

    const data = response.data;

    console.log('✅ FDA API RESPONSE RECEIVED');

    let resultData = null;

    // 🟢 PARSE FDA RESPONSE STRUCTURE
    if (data.cosmetic_NN?.length > 0) {
      resultData = data.cosmetic_NN[0];
    } else if (data.cdrr?.length > 0) {
      resultData = data.cdrr[0];
    } else if (data.fdafoodproducts?.length > 0) {
      resultData = data.fdafoodproducts[0];
    }

    return res.json({
      success: true,
      results: resultData || null
    });

  } catch (error) {
    const statusCode = error.response?.status;

    console.error(
      '🚨 FDA API error:',
      statusCode,
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch from FDA API',
      status: statusCode
    });
  }
});

// 🚀 START SERVER
app.listen(3000, () =>
  console.log('🚀 Server running on http://localhost:3000')
);