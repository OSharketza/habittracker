---
name: scraping-reddit
description: Extracts top posts, comments, or data from Reddit subreddits using the native .json API. Use when the user requests Reddit data, subreddit analysis, or post scraping.
---

# Scraping Reddit

Extract structured data from Reddit subreddits without external dependencies or heavy headless browsers.

## When to use this skill
- Fetching top/new/hot posts from a subreddit.
- Analyzing community discussions or product feedback on Reddit.
- Monitoring specific subreddits for keywords.
- Building data sets for research or AI training.

## Workflow

1.  **Target Selection**: Define the subreddit and the sorting method (Top, New, Hot).
2.  **Request Construction**: Build the URL using the `.json` suffix (e.g., `https://www.reddit.com/r/n8n/top/.json`).
3.  **User-Agent Configuration**: Set a unique, descriptive `User-Agent` header to avoid rate limiting or blocking.
4.  **Fetch & Parse**: Execute the HTTP GET request and parse the `data.children` array.
5.  **Data Extraction**: Extract fields like `title`, `score`, `url`, and `num_comments`.

## Implementation (Node.js)

```javascript
const https = require('https');

async function scrapeSubreddit(subreddit, limit = 3) {
  const url = `https://www.reddit.com/r/${subreddit}/top/.json?limit=${limit}`;
  const options = {
    headers: { 'User-Agent': 'Antigravity-Scraper/1.0' }
  };

  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).data.children));
    }).on('error', reject);
  });
}
```

## Best Practices
- **Respect Rate Limits**: Avoid aggressive burst requests. Use delays if scraping multiple subreddits.
- **Use Native API**: Always append `.json` to standard Reddit URLs; it is faster and more reliable than HTML selectors.
- **Filter Stickied Posts**: Check `data.stickied` if you want to avoid announcements or pinned posts.
- **Limit Results**: Use the `limit` query parameter to reduce bandwidth and processing time.

## Resources
- [Scraper Script](scripts/scraper.js)
- [Reddit API Parameters](resources/api_params.md)
