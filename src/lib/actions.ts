// @ts-nocheck
// Disabling TypeScript check for this file due to Genkit integration not fully aligning with strict server action types yet.
// This will be resolved as Genkit's Next.js support matures.
"use server";

import { summarizeWhitepaper } from "@/ai/flows/whitepaper-summarization";
import type { WhitepaperSummarizationOutput } from "@/ai/flows/whitepaper-summarization";
import { generateCommunitySpotlightArticle } from "@/ai/flows/community-spotlight-article-generation";
import type { GenerateCommunitySpotlightArticleOutput } from "@/ai/flows/community-spotlight-article-generation";
import { z } from "zod";

const WhitepaperSummarizationInputSchema = z.object({
  whitepaperUrl: z.string().url(),
});

const GenerateCommunitySpotlightArticleInputSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  communityName: z.string().min(1, "Community name is required"),
  spotlightMemberName: z.string().optional(),
  recentAchievements: z.string().optional(),
});

export async function summarizeWhitepaperAction(
  formData: FormData
): Promise<{ summary?: string; error?: string }> {
  try {
    const rawFormData = {
      whitepaperUrl: formData.get("whitepaperUrl"),
    };
    const validatedFields = WhitepaperSummarizationInputSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return { error: "Invalid input: Please provide a valid whitepaper URL." };
    }
    
    const result: WhitepaperSummarizationOutput = await summarizeWhitepaper(validatedFields.data);
    if (result.summary) {
      return { summary: result.summary };
    } else {
      return { error: "Failed to generate summary. The AI model might have returned an empty response." };
    }
  } catch (e: any) {
    console.error("Error in summarizeWhitepaperAction:", e);
    return { error: e.message || "An unexpected error occurred while summarizing the whitepaper." };
  }
}

export async function generateCommunitySpotlightArticleAction(
  formData: FormData
): Promise<{ title?: string; content?: string; error?: string, fieldErrors?: any }> {
  try {
    const rawFormData = {
      topic: formData.get("topic"),
      communityName: formData.get("communityName"),
      spotlightMemberName: formData.get("spotlightMemberName") || undefined,
      recentAchievements: formData.get("recentAchievements") || undefined,
    };

    const validatedFields = GenerateCommunitySpotlightArticleInputSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return { error: "Invalid input.", fieldErrors: validatedFields.error.flatten().fieldErrors };
    }

    const result: GenerateCommunitySpotlightArticleOutput = await generateCommunitySpotlightArticle(validatedFields.data);
    
    if (result.title && result.content) {
      return { title: result.title, content: result.content };
    } else {
      return { error: "Failed to generate article. The AI model might have returned an incomplete response." };
    }
  } catch (e: any) {
    console.error("Error in generateCommunitySpotlightArticleAction:", e);
    return { error: e.message || "An unexpected error occurred while generating the article." };
  }
}
