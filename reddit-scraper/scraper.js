const https = require('https');

async function getTopPosts(subreddit) {
    const url = `https://www.reddit.com/r/${subreddit}/top/.json?limit=3`;

    // A descriptive User-Agent is required to prevent Reddit from blocking the request
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Node.js Scraper) Antigravity-Agent/1.0'
        }
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = '';

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch: HTTP ${res.statusCode}`));
                return;
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const posts = json.data.children.map(child => ({
                        title: child.data.title,
                        score: child.data.score,
                        url: `https://www.reddit.com${child.data.permalink}`
                    }));
                    resolve(posts);
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

const subreddit = process.argv[2] || 'n8n';

console.log(`\n🚀 Scraping top 3 posts from r/${subreddit}...\n`);

getTopPosts(subreddit)
    .then(posts => {
        posts.forEach((post, index) => {
            console.log(`${index + 1}. [Score: ${post.score}] ${post.title}`);
            console.log(`   🔗 ${post.url}\n`);
        });
        console.log('✅ Scrape complete!');
    })
    .catch(err => {
        console.error('❌ Error during scraping:', err.message);
        process.exit(1);
    });
