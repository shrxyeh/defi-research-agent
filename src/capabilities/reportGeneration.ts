/**
 * Generates a comprehensive research report by combining token data, project information, 
 * news, and sentiment analysis
 * 
 * @param tokenName Name of the token
 * @param tokenInfo Token market data as JSON string
 * @param projectInfo Project information as JSON string
 * @param newsAnalysis News analysis as JSON string
 * @param sentimentAnalysis Sentiment analysis as JSON string
 * @returns Markdown formatted research report
 */
export async function generateReport(
  tokenName: string,
  tokenInfo: string,
  projectInfo: string,
  newsAnalysis: string | null,
  sentimentAnalysis: string | null
): Promise<string> {
  try {
    // Parse the JSON strings
    const tokenData = JSON.parse(tokenInfo);
    const projectData = JSON.parse(projectInfo);
    const newsData = newsAnalysis ? JSON.parse(newsAnalysis) : null;
    const sentimentData = sentimentAnalysis ? JSON.parse(sentimentAnalysis) : null;
    
    // Handle error cases
    if (tokenData.error) return `Error in token data: ${tokenData.error}`;
    if (projectData.error) return `Error in project data: ${projectData.error}`;
    
    // Format market data
    const formatNumber = (num: number | null | undefined) => {
      if (num === null || num === undefined) return 'N/A';
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
      return `$${num.toFixed(2)}`;
    };
    
    // Format percentage
    const formatPercentage = (pct: number | null | undefined) => {
      if (pct === null || pct === undefined) return 'N/A';
      const sign = pct >= 0 ? '+' : '';
      return `${sign}${pct.toFixed(2)}%`;
    };
    
    // Build the report
    let report = `# ${tokenName} (${tokenData.symbol}) Research Report\n\n`;
    
    // Market Data Section
    report += `## Market Data\n\n`;
    report += `* **Current Price**: $${tokenData.current_price.usd.toLocaleString()}\n`;
    report += `* **Market Cap**: ${formatNumber(tokenData.market_cap.usd)} (Rank #${tokenData.market_cap_rank})\n`;
    report += `* **24h Change**: ${formatPercentage(tokenData.price_change_24h_percentage)}\n`;
    report += `* **7d Change**: ${formatPercentage(tokenData.price_change_7d_percentage)}\n`;
    report += `* **30d Change**: ${formatPercentage(tokenData.price_change_30d_percentage)}\n`;
    report += `* **24h Volume**: ${formatNumber(tokenData.total_volume)}\n`;
    report += `* **Circulating Supply**: ${tokenData.circulating_supply?.toLocaleString() || 'N/A'} ${tokenData.symbol}\n`;
    report += `* **Total Supply**: ${tokenData.total_supply?.toLocaleString() || 'N/A'} ${tokenData.symbol}\n`;
    report += `* **Max Supply**: ${tokenData.max_supply?.toLocaleString() || 'N/A'} ${tokenData.symbol}\n\n`;
    
    // Project Overview Section
    report += `## Project Overview\n\n`;
    
    // Clean up description - remove HTML tags
    const description = projectData.description?.replace(/<[^>]*>/g, '') || 'No description available.';
    
    // Truncate if needed and add ellipsis
    const maxDescLength = 500;
    const truncatedDesc = description.length > maxDescLength
      ? description.substring(0, maxDescLength) + '...'
      : description;
    
    report += truncatedDesc + '\n\n';
    
    report += `* **Genesis Date**: ${projectData.genesis_date || 'N/A'}\n`;
    report += `* **Official Website**: ${projectData.homepage || 'N/A'}\n`;
    report += `* **Categories**: ${(projectData.categories || []).join(', ') || 'N/A'}\n\n`;
    
    // Community Metrics Section
    report += `## Community Metrics\n\n`;
    report += `* **Twitter Followers**: ${projectData.community_data?.twitter_followers?.toLocaleString() || 'N/A'}\n`;
    report += `* **Reddit Subscribers**: ${projectData.community_data?.reddit_subscribers?.toLocaleString() || 'N/A'}\n`;
    report += `* **Telegram Members**: ${projectData.community_data?.telegram_channel_user_count?.toLocaleString() || 'N/A'}\n`;
    report += `* **Positive Sentiment Votes**: ${projectData.sentiment_votes_up_percentage?.toFixed(1) || 'N/A'}%\n\n`;
    
    // Developer Activity Section
    report += `## Developer Activity\n\n`;
    report += `* **GitHub Stars**: ${projectData.developer_data?.stars?.toLocaleString() || 'N/A'}\n`;
    report += `* **Forks**: ${projectData.developer_data?.forks?.toLocaleString() || 'N/A'}\n`;
    report += `* **Contributors**: ${projectData.developer_data?.pull_request_contributors?.toLocaleString() || 'N/A'}\n`;
    report += `* **Commits (4 weeks)**: ${projectData.developer_data?.commit_count_4_weeks?.toLocaleString() || 'N/A'}\n\n`;
    
    // News Section (if available)
    if (newsData && !newsData.error) {
      report += `## Recent News\n\n`;
      
      report += `Overall news sentiment: **${newsData.overall_sentiment}** (score: ${newsData.average_sentiment_score})\n\n`;
      
      if (newsData.news && newsData.news.length > 0) {
        newsData.news.forEach((item: any, index: number) => {
          const date = new Date(item.published_at).toLocaleDateString();
          report += `${index + 1}. **${item.title}** (${date})\n`;
          report += `   Source: ${item.source} | Sentiment score: ${item.sentiment_score}\n\n`;
        });
      } else {
        report += `No recent news found for ${tokenName}.\n\n`;
      }
    }
    
    // Sentiment Analysis Section (if available)
    if (sentimentData && !sentimentData.error) {
      report += `## Social Media Sentiment\n\n`;
      report += `* **Overall Sentiment**: ${sentimentData.overall_sentiment.charAt(0).toUpperCase() + sentimentData.overall_sentiment.slice(1)}\n`;
      report += `* **Sentiment Score**: ${sentimentData.sentiment_score}\n`;
      report += `* **Tweet Volume**: ${sentimentData.tweet_volume.toLocaleString()}\n`;
      report += `* **Sentiment Breakdown**:\n`;
      report += `  * Positive: ${(sentimentData.sentiment_breakdown.positive * 100).toFixed(1)}%\n`;
      report += `  * Neutral: ${(sentimentData.sentiment_breakdown.neutral * 100).toFixed(1)}%\n`;
      report += `  * Negative: ${(sentimentData.sentiment_breakdown.negative * 100).toFixed(1)}%\n\n`;
      
      report += `### Trending Hashtags\n`;
      sentimentData.trending_hashtags.forEach((hashtag: string) => {
        report += `* ${hashtag}\n`;
      });
      report += '\n';
      
      if (sentimentData.influential_mentions && sentimentData.influential_mentions.length > 0) {
        report += `### Notable Mentions\n\n`;
        sentimentData.influential_mentions.forEach((mention: any) => {
          report += `* **@${mention.username}** (${mention.followers.toLocaleString()} followers):\n`;
          report += `  "${mention.tweet}"\n\n`;
        });
      }
    }
    
    // Links Section
    report += `## Important Links\n\n`;
    
    if (projectData.links?.blockchain_site && projectData.links.blockchain_site.length > 0) {
      report += `* **Blockchain Explorers**:\n`;
      projectData.links.blockchain_site.slice(0, 3).forEach((site: string) => {
        report += `  * ${site}\n`;
      });
      report += '\n';
    }
    
    if (projectData.links?.github_url && projectData.links.github_url.length > 0) {
      report += `* **GitHub**: ${projectData.links.github_url[0]}\n`;
    }
    
    if (projectData.links?.twitter_screen_name) {
      report += `* **Twitter**: https://twitter.com/${projectData.links.twitter_screen_name}\n`;
    }
    
    if (projectData.links?.subreddit_url) {
      report += `* **Reddit**: ${projectData.links.subreddit_url}\n`;
    }
    
    // Disclaimer
    report += `\n## Disclaimer\n\n`;
    report += `This report is generated for informational purposes only and should not be considered financial advice. `;
    report += `Always conduct your own research before making investment decisions. Data may be delayed or inaccurate. `;
    report += `This report was auto-generated on ${new Date().toLocaleDateString()}.`;
    
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    return `Error generating report: ${error instanceof Error ? error.message : String(error)}`;
  }
}