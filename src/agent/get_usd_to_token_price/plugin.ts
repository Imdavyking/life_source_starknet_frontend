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
import { getUsdToTokenPriceTemplate } from "./template";
import { getUsdToTokenPriceExamples } from "./example";
import { LifeSource } from "..";
export const getUsdToTokenPriceAction: Action = {
  name: "GET_USD_TO_TOKEN_PRICE",
  similes: [
    "TOKEN_PRICE",
    "USD_TO_TOKEN",
    "TOKEN_CONVERSION",
    "CONVERT_TO_TOKEN",
    "TOKEN_VALUE",
    "TOKEN_RATE",
  ],
  description: "Get the equivalent token amount for a specified USD value",
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
      template: getUsdToTokenPriceTemplate,
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

    // Fetch token price & respond
    try {
      const lifeSource = new LifeSource();
      const tokenAmount = await lifeSource.getUsdToTokenPrice({
        tokenAddress: content.tokenAddress as any,
        amountInUsd: content.amountInUsd as any,
      });

      elizaLogger.success(
        `Successfully fetched token price for ${content.tokenAddress} and amount ${content.amountInUsd}`
      );

      if (callback) {
        callback({
          text: `The equivalent token amount for ${content.amountInUsd} USD at address ${content.tokenAddress} is ${tokenAmount}.`,
          content: tokenAmount,
        });

        return true;
      }
    } catch (error: any) {
      elizaLogger.error("Error in GET_USD_TO_TOKEN_PRICE handler:", error);

      callback({
        text: `Error fetching token price: ${error.message}`,
        content: { error: error.message },
      });

      return false;
    }

    return;
  },
  examples: getUsdToTokenPriceExamples as ActionExample[][],
} as Action;
