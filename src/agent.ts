import { Agent } from '@openserv-labs/sdk';
import { z } from 'zod';

import { getTokenInfo } from './capabilities/tokenInfo';
import { getProjectResearch } from './capabilities/projectResearch';
import { getNewsAnalysis } from './capabilities/newsAnalysis';
import { getSentimentAnalysis } from './capabilities/sentimentAnalysis';
import { generateReport } from './capabilities/reportGeneration';

/**
 * Creates and configures the DeFi Research Agent with all capabilities
 * @returns Configured Agent instance
 */
export function createResearchAgent() {
  const agent = new Agent({
    systemPrompt: `
      You are DeFiResearch, an expert AI agent specializing in cryptocurrency and blockchain project research.
      Your goal is to provide comprehensive, balanced analysis of crypto tokens to help users make informed decisions.
      Always be objective, transparent about limitations in your data, and avoid making specific investment recommendations.
      
      When users ask about tokens, you should:
      1. Identify the token they're referring to (matching to CoinGecko IDs when possible)
      2. Gather relevant market data and project information
      3. Analyze recent news and sentiment if requested
      4. Present information in a clear, structured format
      
      Common token IDs include:
      - bitcoin (BTC)
      - ethereum (ETH)
      - solana (SOL)
      - cardano (ADA)
      - polkadot (DOT)
      - avalanche-2 (AVAX)
      
      If a user asks for a complete analysis, generate a full research report that combines all available data.
    `,
    apiKey: process.env.OPENSERV_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY
  });

  // Add token info capability
  agent.addCapability({
    name: 'getTokenInfo',
    description: 'Get basic price and market data for a cryptocurrency token',
    schema: z.object({
      tokenId: z.string().describe('The CoinGecko ID of the token (e.g., bitcoin, ethereum, solana)'),
    }),
    async run({ args }) {
      return await getTokenInfo(args.tokenId);
    }
  });

  // Add project research capability
  agent.addCapability({
    name: 'getProjectResearch',
    description: 'Get detailed information about a blockchain project',
    schema: z.object({
      tokenId: z.string().describe('The CoinGecko ID of the token'),
    }),
    async run({ args }) {
      return await getProjectResearch(args.tokenId);
    }
  });

  // Add news analysis capability
  agent.addCapability({
    name: 'getNewsAnalysis',
    description: 'Get and analyze recent news about a cryptocurrency project',
    schema: z.object({
      tokenName: z.string().describe('The name of the token (e.g., Bitcoin, Ethereum, Solana)'),
      days: z.number().default(7).describe('Number of days to look back for news'),
    }),
    async run({ args }) {
      return await getNewsAnalysis(args.tokenName, args.days);
    }
  });

  // Add sentiment analysis capability
  agent.addCapability({
    name: 'getSentimentAnalysis',
    description: 'Analyze social media sentiment for a cryptocurrency',
    schema: z.object({
      tokenName: z.string().describe('The name of the token (e.g., Bitcoin, Ethereum, Solana)'),
    }),
    async run({ args }) {
      return await getSentimentAnalysis(args.tokenName);
    }
  });

  // Add report generation capability
  agent.addCapability({
    name: 'generateReport',
    description: 'Generate a comprehensive research report for a cryptocurrency',
    schema: z.object({
      tokenId: z.string().describe('The CoinGecko ID of the token'),
      tokenName: z.string().describe('The name of the token'),
      includeNews: z.boolean().default(true).describe('Whether to include news analysis'),
      includeSentiment: z.boolean().default(true).describe('Whether to include sentiment analysis'),
    }),
    async run({ args }) {
      const tokenInfo = await getTokenInfo(args.tokenId);
      const projectInfo = await getProjectResearch(args.tokenId);
      
      let news = null;
      if (args.includeNews) {
        news = await getNewsAnalysis(args.tokenName, 7);
      }
      
      let sentiment = null;
      if (args.includeSentiment) {
        sentiment = await getSentimentAnalysis(args.tokenName);
      }
      
      return await generateReport(args.tokenName, tokenInfo, projectInfo, news, sentiment);
    }
  });

  return agent;
}