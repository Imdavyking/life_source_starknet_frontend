import { ActionExample } from "@elizaos/core";

export const donateUsdInTokensExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "I want to donate $100 in STRK tokens.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me calculate how many STRK tokens are needed for a $100 donation.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "You will need 25 STRK tokens to donate $100. I will proceed to approve the tokens.",
        action: "APPROVE_TOKENS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "The tokens have been approved. Now, I will donate 25 STRK tokens to the foundation.",
        action: "DONATE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "The donation of $100 in STRK tokens was successful. Thank you for your contribution!",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Donate $500 worth of ETH.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me calculate how much ETH is needed for a $500 donation.",
        action: "GET_USD_TO_TOKEN_PRICE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "For $500, you will need 0.3 ETH. I will proceed to approve the tokens.",
        action: "APPROVE_TOKENS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "The tokens have been approved. Now, I will donate 0.3 ETH to the foundation.",
        action: "DONATE",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "The donation of $500 in ETH was successful. Thank you for your contribution!",
      },
    },
  ],
];
