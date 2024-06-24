# Ref Finance Mintbase Wallet Plugin

![Corte de vídeo 2024-05-08 15h (2)](https://github.com/Mintbase/ref-finance-agent-next/assets/5553483/74d91db8-d11d-4e62-9fc9-423ee2c3abc3)

# Ref Finance Agent API

This API provides an interface for interacting with Ref Finance operations on the NEAR blockchain, including token swaps, metadata retrieval, and price information.

## API Base URL

https://ref-finance-agent-next.vercel.app

## Endpoints

1. Get Token Metadata
   GET /api/token/{token}

2. Get Swap Transactions
   GET /api/swap/{tokenIn}/{tokenOut}/{quantity}

3. Get Token Price
   GET /api/price/{token}

## Usage

Make LLM requests to the endpoints above. Refer to the full API documentation for detailed parameter and response information.

## Development

1. Set `NEAR_ENV=mainnet` environment variable
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm run dev`

navigate to `http://localhost:3000/reference` to view the API documentation.
