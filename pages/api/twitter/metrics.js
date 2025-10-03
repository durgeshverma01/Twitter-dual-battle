export default async function handler(req, res) {
  const { handle } = req.query;

  if (!handle) {
    return res.status(400).json({ error: "Handle required" });
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${handle}?user.fields=public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const user = data.data;

    const followers = user.public_metrics.followers_count;
    const tweets = user.public_metrics.tweet_count;

    // Dummy engagement + reach (API directly nahi deta)
    const avgEngagementRate = Math.random() * 0.1 + 0.01; // 1–11%
    const reach = Math.floor(followers * (1 + avgEngagementRate * 10));

    res.status(200).json({
      handle: user.username,
      followers,
      tweets,
      reach,
      avgEngagementRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
