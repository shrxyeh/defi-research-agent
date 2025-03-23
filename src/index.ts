import dotenv from 'dotenv';
dotenv.config();

import { createResearchAgent } from './agent';

async function main() {
  try {
    console.log('Starting DeFi Research Agent...');
    
    // Check for API key
    if (!process.env.OPENSERV_API_KEY) {
      throw new Error('OPENSERV_API_KEY environment variable is required');
    }
    
    // Create and start the agent
    const agent = createResearchAgent();
    await agent.start();
    
    console.log('DeFi Research Agent is now running on port 7378');
    console.log('Press Ctrl+C to stop the agent');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down agent...');
      await agent.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start agent:', error);
    process.exit(1);
  }
}

// Run the main function
main();