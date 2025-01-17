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
import { addPointsExamples } from "./example";
import { LifeSource } from "..";
import { getAddPointsTemplate } from "./template";

export const addPointsAction: Action = {
  name: "ADD_POINTS",
  similes: ["ADD_POINTS", "POINTS_ADDITION", "GAIN_POINTS", "UPDATE_POINTS"],
  description: "Add points to the user based on a given weight value.",
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
    const addPointsContext = composeContext({
      state,
      template: getAddPointsTemplate,
    });

    // context -> content
    const content = await generateMessageResponse({
      runtime,
      context: addPointsContext,
      modelClass: ModelClass.SMALL,
    });

    // parse content
    const hasInputs = content?.weight && !content?.error;

    if (!hasInputs) {
      return;
    }

    try {
      const lifeSource = new LifeSource();

      // Step 1: Add points based on the weight value
      await lifeSource.addPoints(content.weight as any);

      elizaLogger.info(`Points added: ${content.weight} points`);

      // Respond to the user
      callback({
        text: `Successfully added ${content.weight} points to your account based on the weight provided.`,
        content: { weight: content.weight },
      });

      return true;
    } catch (error: any) {
      elizaLogger.error("Error in ADD_POINTS handler:", error);

      callback({
        text: `Error while adding points: ${error.message}`,
        content: { error: error.message },
      });

      return false;
    }
  },
  examples: addPointsExamples as ActionExample[][],
} as Action;
