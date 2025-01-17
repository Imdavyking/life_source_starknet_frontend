import { ActionExample } from "@elizaos/core";

export const addPointsExamples: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Add 100 points for me.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me add 100 points to your account.",
        action: "ADD_POINTS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "100 points have been successfully added to your account.",
      },
    },
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Add 500 points based on my weight.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me add 500 points to your account based on the provided weight.",
        action: "ADD_POINTS",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "500 points have been successfully added to your account based on the weight provided.",
      },
    },
  ],
];
