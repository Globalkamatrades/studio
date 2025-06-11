// use server'

/**
 * @fileOverview AI-driven community spotlight article generation flow.
 *
 * - generateCommunitySpotlightArticle - A function that generates news articles to incentivize community engagement.
 * - GenerateCommunitySpotlightArticleInput - The input type for the generateCommunitySpotlightArticle function.
 * - GenerateCommunitySpotlightArticleOutput - The return type for the generateCommunitySpotlightArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCommunitySpotlightArticleInputSchema = z.object({
  topic: z.string().describe('The topic of the news article.'),
  communityName: z.string().describe('The name of the community.'),
  spotlightMemberName: z.string().optional().describe('The name of the community member to spotlight.'),
  recentAchievements: z.string().optional().describe('Recent achievements of the spotlighted member.'),
});
export type GenerateCommunitySpotlightArticleInput = z.infer<typeof GenerateCommunitySpotlightArticleInputSchema>;

const GenerateCommunitySpotlightArticleOutputSchema = z.object({
  title: z.string().describe('The title of the generated news article.'),
  content: z.string().describe('The content of the generated news article.'),
});
export type GenerateCommunitySpotlightArticleOutput = z.infer<typeof GenerateCommunitySpotlightArticleOutputSchema>;

export async function generateCommunitySpotlightArticle(
  input: GenerateCommunitySpotlightArticleInput
): Promise<GenerateCommunitySpotlightArticleOutput> {
  return generateCommunitySpotlightArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCommunitySpotlightArticlePrompt',
  input: {schema: GenerateCommunitySpotlightArticleInputSchema},
  output: {schema: GenerateCommunitySpotlightArticleOutputSchema},
  prompt: `You are a community news article generator for {{communityName}}.\n\nGenerate a news article about {{topic}}.\n\n{{#if spotlightMemberName}}\nSpotlight a community member named {{spotlightMemberName}} and their recent achievements: {{recentAchievements}}.\n{{/if}}\n\nThe article should be engaging and incentivize community participation, rewarding active users with free tokens, and spotlighting the most active members to encourage participation.\n\nArticle Title: (write a title here)\nArticle Content: (write the full article here)`,
});

const generateCommunitySpotlightArticleFlow = ai.defineFlow(
  {
    name: 'generateCommunitySpotlightArticleFlow',
    inputSchema: GenerateCommunitySpotlightArticleInputSchema,
    outputSchema: GenerateCommunitySpotlightArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
