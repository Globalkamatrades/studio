'use server';

/**
 * @fileOverview Summarizes the ECOHO whitepaper to provide a quick understanding of the project.
 *
 * - summarizeWhitepaper - A function that summarizes the whitepaper.
 * - WhitepaperSummarizationInput - The input type for the summarizeWhitepaper function.
 * - WhitepaperSummarizationOutput - The return type for the summarizeWhitepaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WhitepaperSummarizationInputSchema = z.object({
  whitepaperUrl: z
    .string()
    .url()
    .describe('URL of the ECOHO whitepaper in PDF format.'),
});
export type WhitepaperSummarizationInput = z.infer<typeof WhitepaperSummarizationInputSchema>;

const WhitepaperSummarizationOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the ECOHO whitepaper main points.'),
});
export type WhitepaperSummarizationOutput = z.infer<typeof WhitepaperSummarizationOutputSchema>;

export async function summarizeWhitepaper(input: WhitepaperSummarizationInput): Promise<WhitepaperSummarizationOutput> {
  return summarizeWhitepaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'whitepaperSummarizationPrompt',
  input: {schema: WhitepaperSummarizationInputSchema},
  output: {schema: WhitepaperSummarizationOutputSchema},
  prompt: `Summarize the ECOHO whitepaper found at the following URL:\n\n{{{whitepaperUrl}}}`,
});

const summarizeWhitepaperFlow = ai.defineFlow(
  {
    name: 'summarizeWhitepaperFlow',
    inputSchema: WhitepaperSummarizationInputSchema,
    outputSchema: WhitepaperSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
```