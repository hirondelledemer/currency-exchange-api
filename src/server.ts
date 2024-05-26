import express, { Request, Response } from "express";
import axios from "axios";
import { LRUCache } from "./lru-cache";
import {
  CACHE_TIMEOUT,
  EXCHANGE_API_URL,
  EXCHANGE_RATES_KEY,
  SUPPORTED_CURRENCIES,
} from "./utils/consts";

const app = express();
const port = 3000;

interface ExchangeRates {
  rates: {
    [key: string]: number;
  };
}
const cache = new LRUCache<string, any>(5);

const fetchExchangeRates = async (
  baseCurrency: string
): Promise<ExchangeRates> => {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    cache.put(EXCHANGE_RATES_KEY, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
};

const getExchangeRates = async (
  baseCurrency: string
): Promise<ExchangeRates> => {
  //   if (cache.isValid(EXCHANGE_RATES_KEY, CACHE_TIMEOUT)) {
  // return cache.get(EXCHANGE_RATES_KEY);
  //   } else {
  return fetchExchangeRates(baseCurrency);
  //   }
};

interface QuoteParams {
  baseCurrency: string;
  quoteCurrency: string;
  baseAmount: number;
}

app.get("/quote", async (req: Request<{}, {}, {}, QuoteParams>, res) => {
  const { baseCurrency, quoteCurrency, baseAmount } = req.query;

  if (!baseCurrency || !quoteCurrency || !baseAmount) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  if (
    !SUPPORTED_CURRENCIES.includes(baseCurrency) ||
    !SUPPORTED_CURRENCIES.includes(quoteCurrency)
  ) {
    return res.status(400).json({ error: "Unsupported currency" });
  }

  try {
    const exchangeRates = await getExchangeRates(baseCurrency);
    const rate = exchangeRates.rates[quoteCurrency];
    const exchangeRate = parseFloat(rate.toFixed(3));
    const quoteAmount = Math.round((Number(baseAmount) / 100) * rate * 100);

    return res.json({
      exchangeRate,
      quoteAmount,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
