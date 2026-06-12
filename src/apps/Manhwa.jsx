const SITES = [
  { name: "Webtoons", url: "https://www.webtoons.com", icon: "📗" },
  { name: "Tapas", url: "https://tapas.io", icon: "📘" },
  { name: "Tappytoon", url: "https://www.tappytoon.com", icon: "📙" },
  { name: "Lezhin", url: "https://www.lezhinus.com", icon: "📕" },
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
            <span className="manhwa-icon">{site.icon}</span>
            <span className="manhwa-name">{site.name}</span>
            <span className="manhwa-arrow">↗</span>
          </a>
        ))}
      </div>
      <p className="manhwa-note">
        Support creators — read on licensed platforms only.
      </p>
    </div>
  );
}
