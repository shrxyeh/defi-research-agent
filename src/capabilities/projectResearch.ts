import axios from 'axios';

/**
 * Retrieves detailed project information from CoinGecko API
 * @param tokenId The CoinGecko ID of the token
 * @returns JSON string with project data or error information
 */
export async function getProjectResearch(tokenId: string): Promise<string> {
  try {
    // Call CoinGecko API for detailed project information
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=true`
    );
    
    const data = response.data;
    
    // Extract relevant information
    const research = {
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      description: data.description.en,
      homepage: data.links.homepage[0],
      blockchain: data.asset_platform_id,
      categories: data.categories,
      genesis_date: data.genesis_date,
      sentiment_votes_up_percentage: data.sentiment_votes_up_percentage,
      sentiment_votes_down_percentage: data.sentiment_votes_down_percentage,
      community_data: {
        twitter_followers: data.community_data.twitter_followers,
        reddit_subscribers: data.community_data.reddit_subscribers,
        telegram_channel_user_count: data.community_data.telegram_channel_user_count,
      },
      developer_data: {
        forks: data.developer_data.forks,
        stars: data.developer_data.stars,
        subscribers: data.developer_data.subscribers,
        total_issues: data.developer_data.total_issues,
        closed_issues: data.developer_data.closed_issues,
        pull_requests_merged: data.developer_data.pull_requests_merged,
        pull_request_contributors: data.developer_data.pull_request_contributors,
        commit_count_4_weeks: data.developer_data.commit_count_4_weeks,
      },
      links: {
        blockchain_site: data.links.blockchain_site.filter(Boolean), // Remove empty values
        official_forum_url: data.links.official_forum_url.filter(Boolean),
        chat_url: data.links.chat_url.filter(Boolean),
        announcement_url: data.links.announcement_url.filter(Boolean),
        twitter_screen_name: data.links.twitter_screen_name,
        facebook_username: data.links.facebook_username,
        github_url: data.links.repos_url.github?.filter(Boolean),
        subreddit_url: data.links.subreddit_url,
      }
    };
    
    return JSON.stringify(research);
  } catch (error) {
    console.error('Error fetching project research:', error);
    return JSON.stringify({ 
      error: 'Unable to fetch project information',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}