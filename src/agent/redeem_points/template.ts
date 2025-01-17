export const getRedeemPointsTemplate = `
Respond with a JSON object containing the points value (number or string) extracted from the most recent message.

If the points value is missing or invalid, respond with an error.

The response must include:
- points: The points value as a number or string representing the points to be redeemed.

Example response:
\`\`\`json
{
    "points": "50"
}
\`\`\`
{{recentMessages}}
Extract points from the most recent message. 
Respond with a JSON markdown block containing points.`;
