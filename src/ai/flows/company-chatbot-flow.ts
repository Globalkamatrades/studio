'use server';
/**
 * @fileOverview A company chatbot flow for answering user questions.
 *
 * - askCompanyChatbot - A function that handles user questions about the company.
 * - CompanyChatbotInput - The input type for the askCompanyChatbot function.
 * - CompanyChatbotOutput - The return type for the askCompanyChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompanyChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question about the company.'),
});
export type CompanyChatbotInput = z.infer<typeof CompanyChatbotInputSchema>;

const CompanyChatbotOutputSchema = z.object({
    answer: z.string().describe('The chatbot\'s answer to the user\'s question.'),
});
export type CompanyChatbotOutput = z.infer<typeof CompanyChatbotOutputSchema>;

export async function askCompanyChatbot(input: CompanyChatbotInput): Promise<CompanyChatbotOutput> {
  return companyChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'companyChatbotPrompt',
  input: {schema: CompanyChatbotInputSchema},
  output: {schema: CompanyChatbotOutputSchema},
  prompt: `You are a friendly and helpful company chatbot for "Ecoho Gold".
Your goal is to answer user questions based on the information provided below.
If the answer is not in the information, say "I'm sorry, I don't have information on that topic. Please try asking another question or contact us directly through one of our channels."
Keep your answers concise and helpful.

**Company & Project Information:**
- **Project Name:** Ecoho Gold (Token Symbol: ECOHO)
- **Mission:** To be Africa's leading commodity-backed cryptocurrency, fostering sustainable development and economic empowerment. We bridge Africa's wealth with global digital finance.
- **Blockchain:** Ethereum Network (ERC-20 standard).
- **Core Offerings:** Commodity-backed cryptocurrency and Music NFTs.
- **Token Utility:** Staking for rewards, governance and voting, purchasing Music NFTs, investing in eco-friendly projects, and general DeFi yield opportunities.
- **Tokenomics:**
  - Total Supply: 1,000,000,000 ECOHO
  - Circulating Supply: 400,000,000 ECOHO
  - Initial Liquidity: $20 ETH equivalent
  - Planned Launch: Q2 2025
- **How to Buy:** Initially available on Uniswap (a decentralized exchange). Listings on centralized exchanges like Bybit and KuCoin are planned.
- **NFTs:** Official Ecoho Gold NFTs are available for purchase on OpenSea. Each purchase rewards the buyer with 7 bonus ECOHO tokens.
- **Community Rewards:** We offer airdrops and community rewards for active members. Announcements are made on our official Telegram channel.
- **Contact Channels:**
  - Telegram: https://t.me/ecoho_gold_chat
  - WhatsApp: +27 65 533 5608
  - Twitter: @Ecoho_Gold
  - Email: Akhona@ecohogold.co.za
- **Company Details:** K2021753276 (SOUTH AFRICA) PTY Ltd, registered in Gauteng, South Africa.

**User's Question:**
"{{{question}}}"

Provide your answer based only on the information above.
`,
});

const companyChatbotFlow = ai.defineFlow(
  {
    name: 'companyChatbotFlow',
    inputSchema: CompanyChatbotInputSchema,
    outputSchema: CompanyChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return any output for the chatbot.");
    }
    return output;
  }
);
