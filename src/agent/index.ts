/** @format */

import { FIAT_DECIMALS, PROTOCOL_ADDRESS } from "../utils/constants";
import abi from "@/assets/json/abi.json";
import erc20abi from "@/assets/json/erc20.json";
import { Contract, num } from "starknet";
import { getStarknet } from "get-starknet";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const geminiApiKeys = [
  import.meta.env.GEMINI_API_KEY_1 || "API_KEY_1",
  import.meta.env.GEMINI_API_KEY_2 || "API_KEY_2",
  import.meta.env.GEMINI_API_KEY_3 || "API_KEY_3",
  import.meta.env.GEMINI_API_KEY_4 || "API_KEY_4",
  import.meta.env.GEMINI_API_KEY_5 || "API_KEY_5",
  import.meta.env.GEMINI_API_KEY_6 || "API_KEY_6",
  import.meta.env.GEMINI_API_KEY_7 || "API_KEY_7",
  import.meta.env.GEMINI_API_KEY_8 || "API_KEY_8",
  import.meta.env.GEMINI_API_KEY_9 || "API_KEY_9",
  import.meta.env.GEMINI_API_KEY_10 || "API_KEY_10",
  import.meta.env.GEMINI_API_KEY_11 || "API_KEY_11",
  import.meta.env.GEMINI_API_KEY_12 || "API_KEY_12",
  import.meta.env.GEMINI_API_KEY_13 || "API_KEY_13",
  import.meta.env.GEMINI_API_KEY_14 || "API_KEY_14",
  import.meta.env.GEMINI_API_KEY_15 || "API_KEY_15",
  import.meta.env.GEMINI_API_KEY_16 || "API_KEY_16",
  import.meta.env.GEMINI_API_KEY_17 || "API_KEY_17",
  import.meta.env.GEMINI_API_KEY_18 || "API_KEY_18",
  import.meta.env.GEMINI_API_KEY_19 || "API_KEY_19",
  import.meta.env.GEMINI_API_KEY_20 || "API_KEY_20",
  import.meta.env.GEMINI_API_KEY_21 || "API_KEY_21",
  import.meta.env.GEMINI_API_KEY_22 || "API_KEY_22",
  import.meta.env.GEMINI_API_KEY_23 || "API_KEY_23",
  import.meta.env.GEMINI_API_KEY_24 || "API_KEY_24",
  import.meta.env.GEMINI_API_KEY_25 || "API_KEY_25",
  import.meta.env.GEMINI_API_KEY_26 || "API_KEY_26",
  import.meta.env.GEMINI_API_KEY_27 || "API_KEY_27",
  import.meta.env.GEMINI_API_KEY_28 || "API_KEY_28",
  import.meta.env.GEMINI_API_KEY_29 || "API_KEY_29",
  import.meta.env.GEMINI_API_KEY_30 || "API_KEY_30",
  import.meta.env.GEMINI_API_KEY_31 || "API_KEY_31",
  import.meta.env.GEMINI_API_KEY_32 || "API_KEY_32",
  import.meta.env.GEMINI_API_KEY_33 || "API_KEY_33",
  import.meta.env.GEMINI_API_KEY_34 || "API_KEY_34",
  import.meta.env.GEMINI_API_KEY_35 || "API_KEY_35",
  import.meta.env.GEMINI_API_KEY_36 || "API_KEY_36",
  import.meta.env.GEMINI_API_KEY_37 || "API_KEY_37",
  import.meta.env.GEMINI_API_KEY_38 || "API_KEY_38",
  import.meta.env.GEMINI_API_KEY_39 || "API_KEY_39",
  import.meta.env.GEMINI_API_KEY_40 || "API_KEY_40",
  import.meta.env.GEMINI_API_KEY_41 || "API_KEY_41",
  import.meta.env.GEMINI_API_KEY_42 || "API_KEY_42",
  import.meta.env.GEMINI_API_KEY_43 || "API_KEY_43",
  import.meta.env.GEMINI_API_KEY_44 || "API_KEY_44",
  import.meta.env.GEMINI_API_KEY_45 || "API_KEY_45",
  import.meta.env.GEMINI_API_KEY_46 || "API_KEY_46",
  import.meta.env.GEMINI_API_KEY_47 || "API_KEY_47",
  import.meta.env.GEMINI_API_KEY_48 || "API_KEY_48",
  import.meta.env.GEMINI_API_KEY_49 || "API_KEY_49",
  import.meta.env.GEMINI_API_KEY_50 || "API_KEY_50",
];

export class LifeSourceAgent {
  tools: any;
  toolsDescription: any;
  executionContext: any;
  currentApiKeyIndex = 0;

  constructor() {
    this.tools = {
      getUsdToTokenPrice: this.getUsdToTokenPrice,
      approve: this.approve,
      donate: this.donateToFoundation,
      redeemCode: this.redeemCode,
      addPoints: this.addPoints,
    };
    this.toolsDescription = {
      getUsdToTokenPrice:
        "arguments: tokenAddress (string), amountInUsd (number or string); returns the amount of tokens equivalent to the USD value,return the amount to approve and donate",
      approve:
        "arguments: tokenAddress (string), amount (number or string); approves the protocol to spend the specified amount",
      donate:
        "arguments: tokenAddress (string), amountInUsd (number or string); donates the specified USD value in tokens to the foundation, call get_usd_to_token_price to get the amount of tokens in STARKNET, approve it and then call donate",
      redeemCode:
        "arguments: points (number or string); redeems points for a code",
      addPoints:
        "arguments: weight (number or string); adds points to the user based on weight",
    };
    this.executionContext = {};
  }

  private getNextApiKey = () => {
    this.currentApiKeyIndex =
      (this.currentApiKeyIndex + 1) % geminiApiKeys.length; // Circular rotation of API keys
    return geminiApiKeys[this.currentApiKeyIndex];
  };

  private async getSNConnection() {
    let starknet = getStarknet();
    if (!starknet.isConnected) {
      await starknet.enable();
    }
    if (starknet.selectedAddress) {
      let account = starknet.account;
      return account;
    }
  }

  private async protocolContract() {
    let account = await this.getSNConnection();
    let contract = new Contract(abi, PROTOCOL_ADDRESS, account);
    return { contract, account };
  }

  private async erc20Contract(address: string) {
    let account = await this.getSNConnection();
    let contract = new Contract(erc20abi, address, account);
    return { contract, account };
  }

  private async getUsdToTokenPrice({
    tokenAddress,
    amountInUsd,
  }: {
    tokenAddress: string;
    amountInUsd: number | string;
  }): Promise<number> {
    amountInUsd = Number(amountInUsd) * FIAT_DECIMALS;
    let { contract: protocolContract, account } = await this.protocolContract();
    const getUsdToTokenPriceCall = protocolContract.populate(
      "get_usd_to_token_price",
      [tokenAddress, amountInUsd]
    );
    const amountToDonate: any = await account!.callContract(
      getUsdToTokenPriceCall
    );
    return Number(amountToDonate.result[0]);
  }

  private async donateToFoundation({
    tokenAddress,
    amountInUsd,
  }: {
    tokenAddress: string;
    amountInUsd: number | string;
  }) {
    amountInUsd = Number(amountInUsd) * FIAT_DECIMALS;
    let { contract: protocolContract, account } = await this.protocolContract();
    const donateCall = protocolContract.populate("donate_to_foundation", [
      tokenAddress,
      amountInUsd,
    ]);
    const donateTx = await account!.execute(donateCall);
    await account?.waitForTransaction(donateTx.transaction_hash);
    return donateTx;
  }
  private async redeemCode(points: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const redeemCode = protocolContract.populate("redeem_code", [points]);
    const redeemTx = await account!.execute(redeemCode);
    await account?.waitForTransaction(redeemTx.transaction_hash);
    return redeemTx;
  }
  private async addPoints(weight: number | string) {
    let { contract: protocolContract, account } = await this.protocolContract();
    const addPoints = protocolContract.populate("add_point_from_weight", [
      weight,
    ]);
    const addPointsTx = await account!.execute(addPoints);
    await account?.waitForTransaction(addPointsTx.transaction_hash);
    return addPointsTx;
  }

  private async approve({
    tokenAddress,
    amount,
  }: {
    tokenAddress: string;
    amount: number | string;
  }) {
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
  private async openAILLM(prompt: string): Promise<string | null> {
    try {
      const openai = new OpenAI({
        apiKey: openAIApiKey,
        dangerouslyAllowBrowser: true,
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
      });

      return chatCompletion.choices[0].message.content;
    } catch (error) {
      return null;
    }
  }
  private async googleLLM(prompt: string): Promise<string | null> {
    try {
      const geminiApiKey = this.getNextApiKey();
      const googleAI = new GoogleGenerativeAI(geminiApiKey);
      const model = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      return null;
    }
  }

  private async promptLLM(prompt: string): Promise<string> {
    const openaiLLM = await this.openAILLM(prompt);
    if (openaiLLM) {
      return openaiLLM!;
    }
    const googleLLM = await this.googleLLM(prompt);
    if (googleLLM) {
      return googleLLM!;
    }

    return prompt;
  }

  private async getNextAction(
    task: string,
    context: { [key: string]: any }
  ): Promise<{ [key: string]: any }> {
    const prompt = `
    STRK_ADDR (STARKNET): 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
    ETH_ADDR (ETHEREUM): 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
    Task: ${task}
    Available tools: ${JSON.stringify(this.toolsDescription)}
    Current context: ${JSON.stringify(context)}
    Determine the next action to take based on the current context and available tools.
    Previous results can be referenced using {{result_X}} where X is the step number.
    Respond in JSON format as:
    {{"tool": "tool_name","args": "arguments"}}
    if task is complete,respond with:
    {{"task": "TASK_COMPLETE","args": ""}}
    `;
    const nextAction = await this.promptLLM(prompt);
    return JSON.parse(nextAction);
  }

  private async executeAction(
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
      // replace context variables in args
      for (const key in context) {
        args = args.replace(`{{${key}}}`, context[key].toString());
      }
    }
    return tool.bind(this)(args);
  }

  public async solveTask(task: string): Promise<string[]> {
    const context: { [key: string]: any } = {};
    const results = [];
    let step = 0;
    while (true) {
      const action = await this.getNextAction(task, context);
      console.log(`Planned action: ${JSON.stringify(action)}`);
      if (action["tool"] == "TASK_COMPLETE") {
        break;
      }
      const result = await this.executeAction(action, context);
      console.log(`Result: ${JSON.stringify(result)}`);
      step += 1;
      context[`result_${step}`] = result;
      results.push(result);
    }
    return results;
  }
}
