export default function WelcomeApp() {
  return (
    <div className="welcome-app">
      <div className="welcome-logo">🌌</div>

      <h2>ManhwaOS</h2>

      <p className="welcome-sub">
        A webOS for manhwa fans.
        <br />
        Wallpaper from <em>Landscape Visuals aka pinterest</em>.
      </p>

      <div className="welcome-quote">
        "I was the only one who knew the ending of this story."
        <span>— Kim Dokja, ORV, he likes boys</span>
      </div>

      <div className="welcome-links">
        {[
          { name: "Read On Webtoon", url: "https://www.webtoons.com" },
          { name: "Read On Tapas", url: "https://tapas.io" },
          { name: "Read On Tappytoon", url: "https://www.tappytoon.com" },
          { name: "Read On Lezhin", url: "https://www.lezhinus.com" },
        ].map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="welcome-link"
          >
            <span>{site.name}</span>
            <span className="arrow">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
