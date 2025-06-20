'use server';
/**
 * @fileOverview An AI flow to generate content for a project whitepaper.
 *
 * - generateWhitepaperContent - A function that orchestrates the whitepaper content generation.
 * - WhitepaperGenerationInput - The input type for the generateWhitepaperContent function.
 * - WhitepaperGenerationOutput - The return type for the generateWhitepaperContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhitepaperGenerationInputSchema = z.object({
  whitepaperTitle: z.string().default('Ecoho Gold Whitepaper').describe("The main title for the whitepaper."),
  projectName: z.string().default('Ecoho Gold').describe("The name of the project the whitepaper is for."),
  projectVision: z.string().describe("A concise statement of the project's long-term vision (e.g., To be Africa's leading commodity-backed cryptocurrency, fostering sustainable development and economic empowerment)."),
  problemStatement: z.string().describe("The problem the project aims to solve (e.g., Lack of accessible and transparent investment opportunities in African commodities, volatility of traditional cryptocurrencies)."),
  proposedSolution: z.string().describe("How the project solves the identified problem (e.g., Tokenizing real-world assets like gold, platinum, uranium, and oil, providing stability and tangible value via a BEP-20 token)."),
  keyFeatures: z.array(z.string()).min(1).describe("A list of key features or pillars of the project (e.g., 'Commodity-backed by Gold, Platinum, Uranium, Oil', 'Built on Binance Smart Chain', 'Focus on Eco-friendly projects', 'NFT Rewards Program', 'Facilitates Cross-Border Trade')."),
  tokenName: z.string().default('Ecoho Gold').describe("The name of the project's token."),
  tokenSymbol: z.string().default('ECOHO').describe("The ticker symbol for the token."),
  blockchainPlatform: z.string().default('Binance Smart Chain (BEP-20)').describe("The blockchain platform the token is built on."),
  tokenUtility: z.array(z.string()).min(1).describe("A list of the token's uses and utilities (e.g., 'Investment in tokenized commodities', 'Staking for rewards', 'Governance rights', 'Access to exclusive NFT drops', 'Payment for services within the ecosystem')."),
  tokenomicsSummary: z.string().describe("A brief overview of the tokenomics (e.g., 'Total Supply: 100,000,000 ECOHO. Circulating Supply: 40,000,000. Details on allocation for team, marketing, liquidity, and community rewards to be specified.')."),
  roadmapHighlights: z.array(z.string()).min(1).describe("Key milestones from the project roadmap (e.g., 'Q3 2024: Token Launch', 'Q4 2024: First NFT Collection Drop', 'Q1 2025: Staking Platform Launch', 'Q2 2025: Partnership with eco-projects')."),
  targetAudience: z.string().describe("The primary target audience for the whitepaper and project (e.g., 'Investors seeking stable crypto assets', 'Individuals interested in commodity markets', 'African diaspora looking for regional investment opportunities', 'Eco-conscious investors')."),
  teamSummary: z.string().optional().describe("A brief summary of the team's expertise and background (if to be included)."),
  desiredSections: z.array(z.string()).optional().default(['Introduction', 'Problem Statement', 'Our Solution: Ecoho Gold', 'Key Features', 'ECOHO Tokenomics', 'Utility of ECOHO Token', 'Roadmap', 'Team (Optional)', 'Conclusion', 'Disclaimer']).describe("A list of specific section titles for the whitepaper. If not provided, a default set will be used."),
  tone: z.string().optional().default('Professional, Innovative, and Visionary').describe("The desired tone of the whitepaper (e.g., 'Formal', 'Enthusiastic', 'Technical').")
});
export type WhitepaperGenerationInput = z.infer<typeof WhitepaperGenerationInputSchema>;

const WhitepaperGenerationOutputSchema = z.object({
  title: z.string().describe("The generated title of the whitepaper."),
  sections: z.array(z.object({
    sectionTitle: z.string().describe("The title of this whitepaper section."),
    sectionContent: z.string().describe("The generated content for this section, written in a clear and engaging manner.")
  })).describe("An array of generated sections, each with a title and content.")
});
export type WhitepaperGenerationOutput = z.infer<typeof WhitepaperGenerationOutputSchema>;

export async function generateWhitepaperContent(input: WhitepaperGenerationInput): Promise<WhitepaperGenerationOutput> {
  return whitepaperGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whitepaperGenerationPrompt',
  input: {schema: WhitepaperGenerationInputSchema},
  output: {schema: WhitepaperGenerationOutputSchema},
  prompt: `You are an expert whitepaper writer specializing in cryptocurrency and blockchain projects.
Your task is to generate the content for a whitepaper titled "{{whitepaperTitle}}" for the project "{{projectName}}".
The desired tone for the whitepaper is: {{tone}}.
The target audience is: {{targetAudience}}.

Below are key details about the project:
- Vision: {{projectVision}}
- Problem Statement: {{problemStatement}}
- Proposed Solution: {{proposedSolution}}
- Key Features:
{{#each keyFeatures}}
  - {{{this}}}
{{/each}}
- Token Name: {{tokenName}} (Symbol: {{tokenSymbol}})
- Blockchain: {{blockchainPlatform}}
- Token Utility:
{{#each tokenUtility}}
  - {{{this}}}
{{/each}}
- Tokenomics Summary: {{tokenomicsSummary}}
- Roadmap Highlights:
{{#each roadmapHighlights}}
  - {{{this}}}
{{/each}}
{{#if teamSummary}}
- Team Summary: {{teamSummary}}
{{/if}}

Please generate content for the following sections. If no specific sections are requested, use a standard whitepaper structure.
Requested Sections (if any, otherwise use default structure including Introduction, Problem, Solution, Features, Tokenomics, Utility, Roadmap, Team (if provided), Conclusion, Disclaimer):
{{#if desiredSections}}
{{#each desiredSections}}
  - {{{this}}}
{{/each}}
{{else}}
  - Introduction
  - Problem Statement
  - Our Solution: {{projectName}}
  - Key Features of {{projectName}}
  - The {{tokenSymbol}} Token: Tokenomics and Utility
  - Project Roadmap
  {{#if teamSummary}}
  - Our Team
  {{/if}}
  - Conclusion
  - Disclaimer
{{/if}}

For each section, provide a "sectionTitle" and detailed "sectionContent".
The output must be a JSON object matching the defined output schema, with a main "title" for the whitepaper and an array of "sections", where each section object has a "sectionTitle" and "sectionContent".
Ensure the content is comprehensive, well-structured, and persuasive for the target audience.
Expand on the provided summaries to create engaging and informative paragraphs for each section.
For the Tokenomics section, elaborate on the importance of a clear token distribution and utility.
For the Roadmap section, make it sound ambitious yet achievable.
The Introduction should grab the reader's attention and briefly introduce the project and its purpose.
The Conclusion should summarize the key value propositions and provide a strong call to action or forward-looking statement.
Include a standard legal disclaimer section stating that the whitepaper is for informational purposes only and not financial advice.`,
});

const whitepaperGenerationFlow = ai.defineFlow(
  {
    name: 'whitepaperGenerationFlow',
    inputSchema: WhitepaperGenerationInputSchema,
    outputSchema: WhitepaperGenerationOutputSchema,
  },
  async (input) => {
    // Ensure default sections are used if desiredSections is empty or not provided
    let sectionsToGenerate = input.desiredSections;
    if (!sectionsToGenerate || sectionsToGenerate.length === 0) {
      sectionsToGenerate = ['Introduction', 'Problem Statement', 'Our Solution: ' + input.projectName, 'Key Features', 'ECOHO Tokenomics', 'Utility of ECOHO Token', 'Roadmap'];
      if (input.teamSummary) {
        sectionsToGenerate.push('Team');
      }
      sectionsToGenerate.push('Conclusion', 'Disclaimer');
    }
    
    const processedInput = { ...input, desiredSections: sectionsToGenerate };

    const {output} = await prompt(processedInput);
    if (!output) {
      throw new Error("The AI model did not return any output for whitepaper generation.");
    }
    // Ensure the output has the title and sections as expected
    if (!output.title || !output.sections || !Array.isArray(output.sections)) {
        // Attempt to salvage if the output is just a string (e.g. the LLM failed to format as JSON)
        if (typeof output === 'string') {
            return {
                title: input.whitepaperTitle,
                sections: [{ sectionTitle: "Generated Content", sectionContent: output }]
            };
        }
        throw new Error("The AI model returned an invalid format. Expected a title and an array of sections.");
    }
    return output;
  }
);
```