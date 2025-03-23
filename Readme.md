# DeFi Research Agent

An AI-powered token research assistant built with OpenServ SDK that provides comprehensive cryptocurrency analysis.

## Features

- **Token Information**: Provides current prices, market cap, volume, and other key metrics
- **Project Research**: Analyzes project details, team information, and technology overview
- **News Analysis**: Collects and analyzes recent news with sentiment scoring
- **Social Media Sentiment**: Evaluates community sentiment from social media sources
- **Research Reports**: Generates comprehensive markdown reports combining all available data

## Use Cases

- Conduct initial research on new or existing tokens
- Track sentiment shifts for tokens in your portfolio
- Generate objective reports before making investment decisions
- Stay updated on project developments and community sentiment

## Getting Started

### Prerequisites

- Node.js 18 or newer
- OpenServ API key (get one at [platform.openserv.ai](https://platform.openserv.ai))
- OpenAI API key (for agent reasoning capabilities)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/defi-research-agent.git
   cd defi-research-agent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```
   OPENSERV_API_KEY=your_openserv_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Start the agent:
   ```
   npm start
   ```

## Usage

Once the agent is registered on the OpenServ platform, you can interact with it by:

1. Asking for token information:
   ```
   Can you give me the current price and market cap of Ethereum?
   ```

2. Requesting project details:
   ```
   Tell me about the Solana project and its technology
   ```

3. Getting news analysis:
   ```
   What's the latest news about Bitcoin?
   ```

4. Analyzing sentiment:
   ```
   What's the current sentiment around Cardano?
   ```

5. Generating a full report:
   ```
   Generate a comprehensive research report for Polkadot
   ```

## Registering on OpenServ Platform

1. Go to [platform.openserv.ai](https://platform.openserv.ai) and sign up/login
2. Navigate to the Developer section
3. Create a new agent with the following details:
   - Name: DeFi Research Agent
   - Description: AI-powered token research assistant that provides comprehensive cryptocurrency analysis
   - Capabilities: Token research, project analysis, news monitoring, sentiment tracking, and report generation
   - Endpoint: Your deployed agent URL (e.g., https://your-deployment-url.com)
4. Get your API key from the platform

## Deployment Options

1. **Local Development**: Use `npm run dev` for local testing
2. **Cloud Deployment**: Deploy to services like:
   - Heroku
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - Digital Ocean App Platform
   - Railway

## License

MIT

---

Built for the OpenServ Hackathon