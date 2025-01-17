import { Plugin } from "@elizaos/core";
import { donateUsdInTokensAction } from "./action";

export const donateToFoundation: Plugin = {
  name: "donate",
  description:
    "arguments: tokenAddress (string), amountInUsd (number or string); donates the specified USD value in tokens to the foundation, call get_usd_to_token_price to get the amount of tokens in STARKNET, approve it and then call donate",
  actions: [donateUsdInTokensAction],
  evaluators: [],
  providers: [],
};

export default donateToFoundation;
