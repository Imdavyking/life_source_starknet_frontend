import { Plugin } from "@elizaos/core";
import { getUsdToTokenPriceAction } from "./getUsdToTokenPrice"; 


export const getUsdToTokenPrice: Plugin = {
  name: "getUsdToTokenPrice",
  description:
    "arguments: tokenAddress (string), amountInUsd (number or string); returns the amount of tokens equivalent to the USD value,return the amount to approve and donate",
  actions: [getUsdToTokenPriceAction],
  evaluators: [],
  providers: [],
};

export default getUsdToTokenPrice;
