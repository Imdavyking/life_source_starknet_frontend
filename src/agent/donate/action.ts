import { composeContext, elizaLogger } from "@elizaos/core";
import { generateMessageResponse } from "@elizaos/core";
import {
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  ModelClass,
  State,
} from "@elizaos/core";
import { donateUsdInTokensExamples } from "./example";
import { LifeSourceAgent } from "..";
import { getDonationTemplate } from "./template";

export const donateUsdInTokensAction: Action = {
  name: "DONATE_USD_IN_TOKENS",
  similes: ["DONATE_TOKENS", "TOKEN_DONATION", "DONATE_USD", "DONATE_IN_TOKEN"],
  description:
    "Donate the equivalent token amount in USD to the foundation by calculating the token value, approving the transfer, and donating.",
  validate: async (runtime: IAgentRuntime) => true,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    // Initialize/update state
    if (!state) {
      state = (await runtime.composeState(message)) as State;
    }
    state = await runtime.updateRecentMessageState(state);

    // state -> context
    const tokenPriceContext = composeContext({
      state,
      template: getDonationTemplate,
    });

    // context -> content
    const content = await generateMessageResponse({
      runtime,
      context: tokenPriceContext,
      modelClass: ModelClass.SMALL,
    });

    // parse content
    const hasInputs =
      content?.tokenAddress && content?.amountInUsd && !content?.error;

    if (!hasInputs) {
      return;
    }

    try {
      const lifeSource = new LifeSourceAgent();

      // Step 1: Get the token amount for the given USD value
      const tokenAmount = await lifeSource.getUsdToTokenPrice({
        tokenAddress: content.tokenAddress as any,
        amountInUsd: content.amountInUsd as any,
      });

      elizaLogger.info(
        `Token amount calculated: ${content.amountInUsd} USD = ${tokenAmount} tokens`
      );

      // Step 2: Approve the token transfer
      await lifeSource.approve({
        tokenAddress: content.tokenAddress as any,
        amount: tokenAmount,
      });

      elizaLogger.info(
        `Tokens approved successfully: ${tokenAmount} tokens at ${content.tokenAddress}`
      );

      // Step 3: Make the donation
      await lifeSource.donateToFoundation({
        tokenAddress: content.tokenAddress as any,
        amountInUsd: content.amountInUsd as any,
      });

      elizaLogger.success(
        `Donation successful: ${content.amountInUsd} USD (${tokenAmount} tokens) `
      );

      // Respond to the user
      callback({
        text: `Successfully donated ${content.amountInUsd} USD in tokens (${tokenAmount}) to the foundation. Thank you!`,
        content: { tokenAmount },
      });

      return true;
    } catch (error: any) {
      elizaLogger.error("Error in DONATE_USD_IN_TOKENS handler:", error);

      callback({
        text: `Error during the donation process: ${error.message}`,
        content: { error: error.message },
      });

      return false;
    }
  },
  examples: donateUsdInTokensExamples as ActionExample[][],
} as Action;
