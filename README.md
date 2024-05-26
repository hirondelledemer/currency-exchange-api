# Currency exchange api

This project implements a simple currency exchange API using Node.js and TypeScript. The API allows users to convert amounts between supported currencies, leveraging exchange rates fetched from a third-party service. The exchange rates are cached using an in-memory LRU (Least Recently Used) cache for performance optimization.

<br>

## Features

- Convert amounts between USD, EUR, GBP, and ILS.
- Fetch and cache exchange rates from a third-party API.
- In-memory LRU cache to optimize performance and reduce redundant requests.
- Unit tests for the LRU cache implementation.

<br />

## Installation

Clone the repository:

```
git@github.com:hirondelledemer/currency-exchange-api.git
cd currency-exchange-api
```

Install dependencies:

```
npm i
```

<br />

## Running the Server

To start the server, run:

```
npm start
```

The server will start on http://localhost:3000.

<br />

## API usage

- GET /quote
  - Query Parameters:
    - baseCurrency (string, required): The currency code to convert from (e.g., "USD").
    - quoteCurrency (string, required): The currency code to convert to (e.g., "EUR").
    - baseAmount (integer, required): The amount to convert, in cents (e.g., 100 for 1 USD).

```
GET /quote?quoteCurrency=EUR&baseCurrency=USD&baseAmount=100
```

Example response:

```
{
  "exchangeRate": 0.845,
  "quoteAmount": 85
}
```

<br />

## Running Tests

To run the unit tests, use the following command:

```
npm run test
```
