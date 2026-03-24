const https = require('https');

/**
 * Scrapes top posts from a subreddit.
 * @param {string} subreddit 
 * @param {number} limit 
 */
async function scrape(subreddit, limit = 3) {
    const url = `https://www.reddit.com/r/${subreddit}/top/.json?limit=${limit}`;
    const options = {
        headers: { 'User-Agent': 'Antigravity-Internal-Scraper/1.0' }
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = '';
            if (res.statusCode !== 200) {
                return reject(new Error(`Reddit API error: ${res.statusCode}`));
            }
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.data.children.map(c => c.data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// CLI usage
if (require.main === module) {
    const sub = process.argv[2] || 'n8n';
    scrape(sub).then(posts => {
        posts.forEach((p, i) => console.log(`${i + 1}. [${p.score}] ${p.title}\n   ${p.url}\n`));
    }).catch(console.error);
}
