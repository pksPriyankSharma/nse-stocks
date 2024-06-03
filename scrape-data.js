const axios = require("axios");
const fs = require("fs");

// Base URL for NSE API
const equityIndexApiBaseUrl =
  "https://www.nseindia.com/api/equity-stockIndices";

// Header configuration
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Connection: "keep-alive",
  Referer: "https://www.nseindia.com/",
};

async function fetchNifty50Data() {
  try {
    // Initial request to get cookies
    const initialResponse = await axios.get("https://www.nseindia.com", {
      headers,
    });

    // Extract cookies from the initial response headers
    const setCookieHeader = initialResponse.headers["set-cookie"];
    const cookies = setCookieHeader
      .map((cookie) => cookie.split(";")[0])
      .join("; ");

    // Update headers to include cookies
    headers["Cookie"] = cookies;

    // Fetch NIFTY 50 data with updated headers
    const response = await axios.get(
      `${equityIndexApiBaseUrl}?index=NIFTY%2050`,
      { headers }
    );

    const data = response.data.data;

    // Prepare CSV columns
    let csvContent =
      "Symbol,Open,High,Low,Close,LTP,Change,Change Percent,Total Traded Volume,Total Traded Value,Year High,Year Low,Previous Close\n";
    data.forEach((stock) => {
      csvContent += `${stock.symbol},${stock.open},${stock.dayHigh},${stock.dayLow},${stock.lastPrice},${stock.ltp},${stock.change},${stock.pChange},${stock.totalTradedVolume},${stock.totalTradedValue},${stock.yearHigh},${stock.yearLow},${stock.previousClose}\n`;
    });

    // Write to CSV file
    var now = new Date();
    var csvfile_name =
      "nifty50" +
      "-" +
      now.getDate() +
      "-" +
      (now.getMonth() + 1) +
      "-" +
      now.getFullYear() +
      ".csv";

    fs.writeFileSync(csvfile_name, csvContent);
    console.log("Data has been written to" + " " + csvfile_name);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchNifty50Data();
