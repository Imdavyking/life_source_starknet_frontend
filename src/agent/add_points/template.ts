export const getAddPointsTemplate = `
Respond with a JSON object containing the weight value (number or string) extracted from the most recent message.

If the weight value is missing or invalid, respond with an error.

The response must include:
- weight: The weight value as a number or string representing the points to be added.

Example response:
\`\`\`json
{
    "weight": "50"
}
\`\`\`
{{recentMessages}}
Extract weight from the most recent message. 
Respond with a JSON markdown block containing weight.`;
