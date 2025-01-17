export const getDonationTemplate = `
Respond with a JSON object containing the token address and amount in USD extracted from the most recent message. 

these are known addresses, if you get asked about them, use these:
- ETH/eth: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
- STRK/strk: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d

If any required argument (tokenAddress or amountInUsd) is missing or invalid, respond with an error.

The response must include:
- tokenAddress: The token address as a string
- amountInUsd: The amount in USD as a number or string


Example response:
\`\`\`json
{
    "tokenAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "amountInUsd": "100.00"
}
\`\`\`
{{recentMessages}}
Extract tokenAddress and amountInUsd from the most recent message. 
Respond with a JSON markdown block containing tokenAddress and amountInUsd.`;
