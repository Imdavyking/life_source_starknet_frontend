class LifeSourceAgent {
  tools: any;
  tools_description: any;
  execution_context: any;
  constructor() {
    this.tools = {
      search_docs: this.search_docs,
      calculate: this.calculate,
      write_file: this.write_file,
    };
    this.tools_description = {
      search_docs:
        "available arguments are 'pricing' and 'features',return text",
      calculate:
        "the arguments should be an numerical expression that will be executed as eval() in interpreter,returns the output",
      write_file: "the argument should be the text to be written in the file",
    };
    this.execution_context = {};
  }
  private call_llm(prompt: string): string {
    // const response = client.chat.completions.create({
    //   model: "gpt-4",
    //   as: "user",
    //   prompt,
    // });
    const response = "";
    return response;
  }
  private search_docs(query: string): string | undefined | null {
    const docs: { [key: string]: string } = {
      pricing: "Basic Plan: $10/month\nPro plan: $20/month",
      features: "Features: AI chat,file storage, API access",
    };
    return docs[query] as any;
  }
  private calculate(expression: string): number {
    return eval(expression);
  }
  private write_file(text: string) {
    return `Successfully wrote: ${text}`;
  }
  /**
   * Decide the next action to be taken by the agent
   */
  private get_next_action(
    task: string,
    context: { [key: string]: any }
  ): { [key: string]: any } {
    const prompt = `
    Task: ${task}
    Available tools: ${this.tools_description}
    Current context: ${context}
    Determine the next action to take based on the current context and available tools.
    Previous results can be referenced using {{result_X}} where X is the step number.
    Respond in JSON format as:
    {{"tool": "tool_name","args": "arguments"}}
    if task is complete,respond with:
    {{"task": "TASK_COMPLETE","args": ""}}
    `;
    const next_action = this.call_llm(prompt);
    return JSON.parse(next_action);
  }
  private execute_action(
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

  public solve_task(task: string): string[] {
    const context: { [key: string]: any } = {};
    const results = [];
    let step = 0;
    while (true) {
      const action = this.get_next_action(task, context);
      console.log(`Planned action: ${JSON.stringify(action)}`);
      if (action["tool"] == "TASK_COMPLETE") {
        break;
      }
      const result = this.execute_action(action, context);
      console.log(`Result: ${result}`);
      step += 1;
      context[`result_${step}`] = result;
      results.push(result);
    }
    return results;
  }
}
