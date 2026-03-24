# Reddit API JSON Parameters

When appending `.json` to a Reddit URL, you can use these query parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | number | 25 | Max number of items to return (max 100). |
| `t` | string | `all` | Time period for "top": `hour`, `day`, `week`, `month`, `year`, `all`. |
| `after` | string | - | Fullname of the last item for pagination. |
| `before` | string | - | Fullname of the first item for pagination. |

## Example URL
`https://www.reddit.com/r/n8n/top/.json?t=week&limit=10`
