const SITES = [
  { name: "Read On Webtoon", url: "https://www.webtoons.com" },
  { name: "Read On Tapas", url: "https://tapas.io" },
  { name: "Read On Tappytoon", url: "https://www.tappytoon.com" },
  { name: "Read On Lezhin", url: "https://www.lezhinus.com" },
];

export default function ManhwaApp() {
  return (
    <div className="manhwa-app">
      <h2>Official Platforms</h2>

      <div className="manhwa-grid">
        {SITES.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="manhwa-card"
          >
            <span className="manhwa-name">{site.name}</span>
            <span className="manhwa-arrow">↗</span>
          </a>
        ))}
      </div>

      <p className="manhwa-note">
        Please Support The creators — read Manhwas on licensed platforms only.
      </p>
    </div>
  );
}
