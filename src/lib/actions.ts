
// @ts-nocheck
// Disabling TypeScript check for this file due to Genkit integration not fully aligning with strict server action types yet.
// This will be resolved as Genkit's Next.js support matures.
"use server";

import { generateCommunitySpotlightArticle } from "@/ai/flows/community-spotlight-article-generation";
import type { GenerateCommunitySpotlightArticleOutput } from "@/ai/flows/community-spotlight-article-generation";
import { z } from "zod";
import { askCompanyChatbot } from "@/ai/flows/company-chatbot-flow";

const GenerateCommunitySpotlightArticleInputSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  communityName: z.string().min(1, "Community name is required"),
  spotlightMemberName: z.string().optional(),
  recentAchievements: z.string().optional(),
});

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

// --- NFT Transfers Action ---

interface AlchemyTransfer {
  blockNum: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  erc721TokenId: string | null;
  erc1155Metadata: { tokenId: string; value: string; }[] | null;
  asset: string | null;
  category: string;
  rawContract: {
    value: string | null;
    address: string | null;
    decimal: string | null;
  };
  metadata?: {
    blockTimestamp: string;
  };
}

const TARGET_TO_ADDRESS = "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1";
const TARGET_CONTRACT_ADDRESSES = ["0x06012c8cf97BEaD5deAe237070F9587f8E7A266d"];

export async function getRecentNftTransfersAction(): Promise<{ transfers?: AlchemyTransfer[]; error?: string }> {
  const apiKey = process.env.ETHEREUM_ALCHEMY_API_KEY;

  if (!apiKey || apiKey === 'YOUR_ETHEREUM_ALCHEMY_API_KEY_HERE') {
    return { transfers: [], error: "Alchemy API key for Ethereum is not configured on the server." };
  }
  
  const ALCHEMY_API_ENDPOINT = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;

  const payload = {
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toAddress: TARGET_TO_ADDRESS,
        contractAddresses: TARGET_CONTRACT_ADDRESSES,
        category: ["erc721", "erc1155"],
        withMetadata: true,
        excludeZeroValue: false, 
        maxCount: "0xa",
      },
    ],
    id: 0,
  };

  try {
    const response = await fetch(ALCHEMY_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Alchemy API Error: ${response.status}. ${errorBody}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(`Alchemy API Error: ${result.error.message} (Code: ${result.error.code})`);
    }

    return { transfers: result.result?.transfers || [] };
  } catch (error: any) {
    console.error('Failed to fetch NFT transfers from Alchemy (Ethereum) in server action:', error);
    return { transfers: [], error: error.message || 'An unknown error occurred while fetching NFT transfers.' };
  }
}

// --- Company Chatbot Action ---

const CompanyChatbotInputSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
});

export async function askCompanyChatbotAction(
  formData: FormData
): Promise<{ answer?: string; error?: string, fieldErrors?: any }> {
  try {
    const rawFormData = {
      question: formData.get("question"),
    };

    const validatedFields = CompanyChatbotInputSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return { error: "Invalid input.", fieldErrors: validatedFields.error.flatten().fieldErrors };
    }

    const result = await askCompanyChatbot({ question: validatedFields.data.question });
    
    if (result.answer) {
      return { answer: result.answer };
    } else {
      return { error: "Failed to get an answer. The AI model might have returned an incomplete response." };
    }
  } catch (e: any) {
    console.error("Error in askCompanyChatbotAction:", e);
    return { error: e.message || "An unexpected error occurred while getting an answer." };
  }
}
