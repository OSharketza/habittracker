const https = require('https');

async function scrapeSingularity(limit = 3) {
    // Sorting by top of the week
    const url = `https://www.reddit.com/r/singularity/top/.json?limit=${limit}&t=week`;
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

(async () => {
    try {
        const posts = await scrapeSingularity(3);
        posts.forEach((p, i) => {
            console.log(`--- POST ${i + 1} ---`);
            console.log(`Score: ${p.score}`);
            console.log(`Title: ${p.title}`);
            console.log(`URL: https://www.reddit.com${p.permalink}`);
            console.log(`Comments: ${p.num_comments}`);
            console.log('');
        });
    } catch (err) {
        console.error('Scraping failed:', err.message);
        process.exit(1);
    }
})();
