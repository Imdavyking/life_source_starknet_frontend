import { ActionExample } from "@elizaos/core";

export const redeemPointsExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Redeem 100 points for me.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me redeem 100 points from your account.",
        action: "REDEEM_POINTS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "100 points have been successfully redeemed from your account.",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Redeem 250 points for a reward.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me redeem 250 points from your account for the reward.",
        action: "REDEEM_POINTS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "250 points have been successfully redeemed from your account for the reward.",
      },
    },
  ],
];
