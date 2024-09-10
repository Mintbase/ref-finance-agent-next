import { NextResponse } from 'next/server';
import bitteDevJson from "../../../../../bitte.dev.json"

export async function GET() {
    const pluginData = {
        "openapi": "3.0.0",
        "info": {
            "title": "Ref Finance API",
            "description": "API for interacting with Ref Finance operations including token metadata retrieval and token swaps.",
            "version": "1.0.0"
        },
        "servers": [
            {
                "url": `${bitteDevJson.url}`
            }
        ],
        "x-mb": {
            "account-id": "bitte.near",
            "assistant": {
                "title": "Ref Finance Assistant",
                "description": "Helps with token swaps and token metadata retrieval.",
                "instructions": "You should perform token swaps and token metadata retrieval.",
                "tools": [{ type: "generate-transaction" }]
            }
        },
        "paths": {
            "/api/{token}": {
                "get": {
                    "description": "Fetch metadata for a specific token.",
                    "operationId": "getTokenMetadata",
                    "parameters": [
                        {
                            "in": "path",
                            "name": "token",
                            "required": true,
                            "schema": {
                                "type": "string"
                            },
                            "description": "The token identifier for which metadata is being requested."
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Token metadata retrieved successfully.",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string"
                                            },
                                            "symbol": {
                                                "type": "string"
                                            },
                                            "decimals": {
                                                "type": "integer"
                                            },
                                            "id": {
                                                "type": "string"
                                            },
                                            "spec": {
                                                "type": "string"
                                            },
                                            "icon": {
                                                "type": "string"
                                            }
                                        },
                                        "required": [
                                            "name",
                                            "symbol",
                                            "decimals",
                                            "id",
                                            "spec",
                                            "icon"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/swap/{tokenIn}/{tokenOut}/{quantity}": {
                "get": {
                    "description": "Estimate swap details between two tokens.",
                    "operationId": "estimateTokenSwap",
                    "parameters": [
                        {
                            "in": "path",
                            "name": "tokenIn",
                            "required": true,
                            "schema": {
                                "type": "string"
                            },
                            "description": "The identifier for the input token in the swap."
                        },
                        {
                            "in": "path",
                            "name": "tokenOut",
                            "required": true,
                            "schema": {
                                "type": "string"
                            },
                            "description": "The identifier for the output token in the swap."
                        },
                        {
                            "in": "path",
                            "name": "quantity",
                            "required": true,
                            "schema": {
                                "type": "string"
                            },
                            "description": "The amount of the input token to swap."
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Swap estimate retrieved successfully.",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "priceImpact": {
                                                    "type": "string"
                                                },
                                                "route": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "string"
                                                    }
                                                },
                                                "estimatedAmountOut": {
                                                    "type": "string"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return NextResponse.json(pluginData);
}