import { useState } from "react";

function computeYAP(metrics) {
  const followersScore = Math.log10(metrics.followers + 1) * 30;
  const engagementScore = metrics.avgEngagementRate * 1000;
  const reachScore = Math.log10(metrics.reach + 1) * 20;
  const activityScore = Math.min(50, metrics.tweets / 1000);
  return Math.round(
    followersScore * 0.45 +
      engagementScore * 0.35 +
      reachScore * 0.15 +
      activityScore * 0.05
  );
}

export default function Home() {
  const [a, setA] = useState("elonmusk");
  const [b, setB] = useState("nasa");
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData(handle, setData) {
    const res = await fetch(`/api/twitter/metrics?handle=${handle}`);
    const json = await res.json();
    json.yap = computeYAP(json);
    setData(json);
  }

  async function duel() {
    setLoading(true);
    await Promise.all([fetchData(a, setDataA), fetchData(b, setDataB)]);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Twitter Duel ⚡</h1>

      <div className="mb-4">
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Handle A"
        />
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Handle B"
        />
        <button
          onClick={duel}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading..." : "Fight!"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[dataA, dataB].map((m, i) =>
          m ? (
            <div key={i} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">@{m.handle}</h2>
              <p>Followers: {m.followers.toLocaleString()}</p>
              <p>Reach: {m.reach.toLocaleString()}</p>
              <p>Engagement: {(m.avgEngagementRate * 100).toFixed(2)}%</p>
              <p>YAP Score: {m.yap}</p>
            </div>
          ) : (
            <div key={i} className="border p-4 text-gray-500">
              No data
            </div>
          )
        )}
      </div>

      {dataA && dataB && (
        <div className="mt-4 font-bold text-xl">
          Winner:{" "}
          {dataA.yap === dataB.yap
            ? "Tie!"
            : dataA.yap > dataB.yap
            ? `@${dataA.handle}`
            : `@${dataB.handle}`}
        </div>
      )}
    </div>
  );
}
