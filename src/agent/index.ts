/** @format */

import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import { Link } from "react-router-dom";
import logoUrl from "@/assets/images/logo.png";
import donateHeart from "@/assets/images/donate-heart.svg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import {
  useAccount,
  useContract,
  useSendTransaction,
  useReadContract,
} from "@starknet-react/core";
import { uint256 } from "starknet";
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
      searchDocs: this.searchDocs,
      calculate: this.calculate,
      writeFile: this.writeFile,
    };
    this.toolsDescription = {
      searchDocs:
        "available arguments are 'pricing' and 'features',return text",
      calculate:
        "the arguments should be an numerical expression that will be executed as eval() in interpreter,returns the output",
      writeFile: "the argument should be the text to be written in the file",
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

  private promptLLM(prompt: string): string {
    // const response = client.chat.completions.create({
    //   model: "gpt-4",
    //   as: "user",
    //   prompt,
    // });
    const response = "";
    return response;
  }
  private searchDocs(query: string): string | undefined | null {
    const docs: { [key: string]: string } = {
      pricing: "Basic Plan: $10/month\nPro plan: $20/month",
      features: "Features: AI chat,file storage, API access",
    };
    return docs[query] as any;
  }
  private calculate(expression: string): number {
    return eval(expression);
  }
  private writeFile(text: string) {
    return `Successfully wrote: ${text}`;
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
