import { Plugin } from "@elizaos/core";
import { redeemPointsAction } from "./action";

export const redeemPoint: Plugin = {
  name: "redeemPoints",
  description:
    "arguments: points (number or string); redeems points for a code",
  actions: [redeemPointsAction],
  evaluators: [],
  providers: [],
};

export default redeemPoint;
