import { Plugin } from "@elizaos/core";
import { addPointsAction } from "./action";

export const addPoint: Plugin = {
  name: "addPoints",
  description:
    "arguments: weight (number or string); adds points to the user based on weight",
  actions: [addPointsAction],
  evaluators: [],
  providers: [],
};

export default addPoint;
