import { config } from 'dotenv';
config();

// import '@/ai/flows/whitepaper-summarization.ts'; // Removed as it's not actively used by UI
import '@/ai/flows/community-spotlight-article-generation.ts';
import '@/ai/flows/whitepaper-generation-flow.ts';
import '@/ai/flows/company-chatbot-flow.ts';
