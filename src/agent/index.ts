/** @format */

import { PROTOCOL_ADDRESS } from "../utils/constants";
import abi from "@/assets/json/abi.json";
import erc20abi from "@/assets/json/erc20.json";
import { Contract } from "starknet";
import { getStarknet } from "get-starknet";

export class LifeSourceAgent {
  tools: any;
  toolsDescription: any;
  executionContext: any;

  constructor() {
    this.tools = {
      getUsdToTokenPrice: this.getUsdToTokenPrice,
      approve: this.approve,
      donate: this.donateToFoundation,
    };
    this.toolsDescription = {
      getUsdToTokenPrice:
        "arguments: tokenAddress (string), amountInUsd (number or string); returns the amount of tokens equivalent to the USD value",
      approve:
        "arguments: tokenAddress (string), amount (number or string); approves the protocol to spend the specified amount",
      donate:
        "arguments: tokenAddress (string), amountInUsd (number or string); donates the specified USD value in tokens to the foundation",
    };
    this.executionContext = {};
  }

  async getSNConnection() {
    let starknet = getStarknet();
    if (!starknet.isConnected) {
      await starknet.enable();
    }
    if (starknet.selectedAddress) {
      let account = starknet.account;
      return account;
    }
  }

  async protocolContract() {
    let account = await this.getSNConnection();
    let contract = new Contract(abi, PROTOCOL_ADDRESS, account);
    return { contract, account };
  }

  async erc20Contract(address: string) {
    let account = await this.getSNConnection();
    let contract = new Contract(erc20abi, address, account);
    return { contract, account };
  }

  async getUsdToTokenPrice(tokenAddress: string, amountInUsd: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const getUsdToTokenPriceCall = protocolContract.populate(
      "get_usd_to_token_price",
      [tokenAddress, amountInUsd]
    );
    const amountToDonate = await account!.callContract(getUsdToTokenPriceCall);
    return amountToDonate;
  }

  async donateToFoundation(tokenAddress: string, amountInUsd: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const donateCall = protocolContract.populate("donate_to_foundation", [
      tokenAddress,
      amountInUsd,
    ]);
    const donateTx = await account!.execute(donateCall);
    await account?.waitForTransaction(donateTx.transaction_hash);
    return donateTx;
  }
  async redeemCode(points: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const redeemCode = protocolContract.populate("redeem_code", [points]);
    const redeemTx = await account!.execute(redeemCode);
    await account?.waitForTransaction(redeemTx.transaction_hash);
    return redeemTx;
  }
  async addPoints(weight: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const addPoints = protocolContract.populate("add_point_from_weight", [
      weight,
    ]);
    const addPointsTx = await account!.execute(addPoints);
    await account?.waitForTransaction(addPointsTx.transaction_hash);
    return addPointsTx;
  }

  async approve(tokenAddress: string, amount: number | string) {
    let { contract: erc20Contract, account } = await this.erc20Contract(
      tokenAddress
    );
    const approveCall = erc20Contract.populate("approve", [
      PROTOCOL_ADDRESS,
      amount,
    ]);
    const approveTx = await account!.execute(approveCall);
    await account?.waitForTransaction(approveTx.transaction_hash);
    return approveTx;
  }

  private promptLLM(prompt: string): string {
    // const response = client.chat.completions.create({
    //   model: "gpt-4",
    //   as: "user",
    //   prompt,
    // });
    const response = "";
    return response;
  }
  /**
   * Decide the next action to be taken by the agent
   */
  private getNextAction(
    task: string,
    context: { [key: string]: any }
  ): { [key: string]: any } {
    const prompt = `
    Task: ${task}
    Available tools: ${this.toolsDescription}
    Current context: ${context}
    Determine the next action to take based on the current context and available tools.
    Previous results can be referenced using {{result_X}} where X is the step number.
    Respond in JSON format as:
    {{"tool": "tool_name","args": "arguments"}}
    if task is complete,respond with:
    {{"task": "TASK_COMPLETE","args": ""}}
    `;
    const nextAction = this.promptLLM(prompt);
    return JSON.parse(nextAction);
  }
  private executeAction(
    action: { [key: string]: any },
    context: { [key: string]: any }
  ) {
    if (action["tool"] == "TASK_COMPLETE") {
      return "Task completed";
    }
    const tool = this.tools[action["tool"]];
    if (!tool) {
      return `Tool ${action["tool"]} not found`;
    }
    let args = action["args"];
    if (typeof args == "string") {
      for (const key in context) {
        args = args.replace(`{{${key}}}`, context[key].toString());
      }
    }
    return tool(args);
  }

  public solveTask(task: string): string[] {
    const context: { [key: string]: any } = {};
    const results = [];
    let step = 0;
    while (true) {
      const action = this.getNextAction(task, context);
      console.log(`Planned action: ${JSON.stringify(action)}`);
      if (action["tool"] == "TASK_COMPLETE") {
        break;
      }
      const result = this.executeAction(action, context);
      console.log(`Result: ${result}`);
      step += 1;
      context[`result_${step}`] = result;
      results.push(result);
    }
    return results;
  }
}
