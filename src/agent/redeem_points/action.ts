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
import { redeemPointsExamples } from "./example";
import { LifeSource } from "..";
import { getRedeemPointsTemplate } from "./template";

export const redeemPointsAction: Action = {
  name: "REDEEM_POINTS",
  similes: [
    "REDEEM_POINTS",
    "POINTS_REDEMPTION",
    "USE_POINTS",
    "REDEEM_REWARD",
  ],
  description: "Redeem points based on a given points value.",
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
    const redeemPointsContext = composeContext({
      state,
      template: getRedeemPointsTemplate,
    });

    // context -> content
    const content = await generateMessageResponse({
      runtime,
      context: redeemPointsContext,
      modelClass: ModelClass.SMALL,
    });

    // parse content
    const hasInputs = content?.points && !content?.error;

    if (!hasInputs) {
      return;
    }

    try {
      const lifeSource = new LifeSource();

      // Step 1: Redeem points based on the points value
      await lifeSource.redeemCode(content.points as any);

      elizaLogger.info(`Points redeemed: ${content.points} points`);

      // Respond to the user
      callback({
        text: `Successfully redeemed ${content.points} points from your account.`,
        content: { points: content.points },
      });

      return true;
    } catch (error: any) {
      elizaLogger.error("Error in REDEEM_POINTS handler:", error);

      callback({
        text: `Error while redeeming points: ${error.message}`,
        content: { error: error.message },
      });

      return false;
    }
  },
  examples: redeemPointsExamples as ActionExample[][],
} as Action;
