import { ActionExample } from "@elizaos/core";

export const getUsdToTokenPriceExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "How many STRK tokens can I get for $100?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me calculate how many STRK tokens you can get for $100.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "You can get 25 STRK tokens for $100.",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "How much ETH can I buy with $500?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me calculate how much ETH you can buy for $500.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "For $500, you can get 0.3 ETH.",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you check the token amount for $1,000 in STRK?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me check how many STRK tokens you can get for $1,000.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "For $1,000, you will receive 250 STRK tokens.",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "How many ETH can I get for $200?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll calculate the amount of ETH you can get for $200.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "You can get 0.12 ETH for $200.",
      },
    },
  ],
];
