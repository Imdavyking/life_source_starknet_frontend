import { Plugin } from "@elizaos/core";
import { getUsdToTokenPriceAction } from "./action";

export const getUsdToTokenPrice: Plugin = {
  name: "getUsdToTokenPrice",
  description:
    "arguments: tokenAddress (string), amountInUsd (number or string); returns the amount of tokens equivalent to the USD value.",
  actions: [getUsdToTokenPriceAction],
  evaluators: [],
  providers: [],
};

export default getUsdToTokenPrice;
