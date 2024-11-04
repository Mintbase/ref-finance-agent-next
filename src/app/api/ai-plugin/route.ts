import { NextResponse } from "next/server";
import { DEPLOYMENT_URL } from "vercel-url";

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
  console.warn("Missing account info.");
}
if (!config || !config.url) {
  console.warn("Missing config or url in config.");
}

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "RefFinance API",
      description:
        "API for retrieving token metadata and swapping tokens through RefFinance.",
      version: "1.0.0",
    },
    servers: [
      {
        url: config?.url || DEPLOYMENT_URL,
      },
    ],
    "x-mb": {
      "account-id": key.accountId || "",
      assistant: {
        name: "RefFinance Agent",
        description:
          "An assistant that provides token metadata and swaps tokens through RefFinance.",
        instructions:
          "Get information for a given fungible token or swaps one token for another.",
        tools: [{ type: "generate-transaction" }],
      },
    },
    paths: {
      "/api/{token}": {
        get: {
          tags: ["token", "ft", "metadata"],
          summary: "Get token metadata from RefFinance",
          description:
            "This endpoint returns basic token metadata from RefFinance.",
          operationId: "get-token-metadata",
          parameters: [
            {
              name: "token",
              in: "path",
              description: "The symbol of the token to get metadata for.",
              required: true,
              schema: {
                type: "string",
              },
              example: "USDT",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      name: {
                        type: "string",
                      },
                      symbol: {
                        type: "string",
                      },
                      decimals: {
                        type: "number",
                      },
                      icon: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/swap/{tokenIn}/{tokenOut}/{quantity}": {
        get: {
          tags: ["token", "swap", "ft"],
          summary: "Swap fungible tokens through RefFinance",
          description:
            "Swap an amount of a given fungible token for an amount of another fungible token that equals in value.",
          operationId: "get-swap-tokens",
          parameters: [
            {
              name: "tokenIn",
              in: "path",
              description: "The symbol of the token given to swap.",
              required: true,
              schema: {
                type: "string",
              },
              example: "USDT",
            },
            {
              name: "tokenOut",
              in: "path",
              description: "The symbol of the wanted token to swap.",
              required: true,
              schema: {
                type: "string",
              },
              example: "NEAR",
            },
            {
              name: "quantity",
              in: "path",
              description:
                "The amount of the given token to swap for the wanted token.",
              required: true,
              schema: {
                type: "string",
              },
              example: "150",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        signerId: {
                          type: "string",
                          description:
                            "The account ID that will sign the transaction",
                        },
                        receiverId: {
                          type: "string",
                          description:
                            "The account ID of the contract that will receive the transaction",
                        },
                        actions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              type: {
                                type: "string",
                                description: "The type of action to perform",
                              },
                              params: {
                                type: "object",
                                properties: {
                                  methodName: {
                                    type: "string",
                                    description:
                                      "The name of the method to be called",
                                  },
                                  args: {
                                    type: "object",
                                    description:
                                      "Arguments for the function call",
                                  },
                                  gas: {
                                    type: "string",
                                    description:
                                      "Amount of gas to attach to the transaction",
                                  },
                                  deposit: {
                                    type: "string",
                                    description:
                                      "Amount to deposit with the transaction",
                                  },
                                },
                                required: [
                                  "methodName",
                                  "args",
                                  "gas",
                                  "deposit",
                                ],
                              },
                            },
                            required: ["type", "params"],
                          },
                        },
                      },
                      required: ["signerId", "receiverId", "actions"],
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "The error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return NextResponse.json(pluginData);
}
