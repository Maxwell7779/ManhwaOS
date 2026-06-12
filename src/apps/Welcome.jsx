export default function WelcomeApp() {
  return (
    <div className="welcome-app">
      <div className="welcome-logo">🌌</div>
      <h2>ManhwaOS</h2>
      <p className="welcome-sub">
        A web desktop for manhwa fans.
        <br />
        Wallpaper from <em>Omniscient Reader's Viewpoint</em>.
      </p>
      <div className="welcome-quote">
        "I was the only one who knew the ending of this story."
        <span>— Kim Dokja, ORV</span>
      </div>
      <div className="welcome-links">
        {[
          { name: "Webtoons", url: "https://www.webtoons.com", icon: "📗" },
          { name: "Tapas", url: "https://tapas.io", icon: "📘" },
          { name: "Tappytoon", url: "https://www.tappytoon.com", icon: "📙" },
          { name: "Lezhin", url: "https://www.lezhinus.com", icon: "📕" },
        ].map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="welcome-link"
          >
            <span>
              {site.icon} {site.name}
            </span>
            <span className="arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
