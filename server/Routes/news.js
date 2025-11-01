const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEY = "0dff6911fad84faea4a1c7da346cf6d9";

router.get("/", async (req, res) => {
  try {
    const query = "OTP fraud OR UPI fraud OR credit card fraud OR debit card fraud OR online banking fraud";

    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 12,
        apiKey: API_KEY,
      },
    });
    console.log(response.data.articles);
    res.json(response.data.articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
