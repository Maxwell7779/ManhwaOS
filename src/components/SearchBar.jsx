import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const SEARCH_APPS = [
  { name: "Welcome", key: "welcome" },
  { name: "Clock", key: "clock" },
  { name: "Manhwa", key: "manhwa" },
  { name: "About", key: "about" },
];

export default function SearchBar({ onOpenApp }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handle(e) {
      if (!e.target.closest(".floating-search-wrap")) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = SEARCH_APPS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="floating-search-wrap">
      <div
        className={`floating-search-bar${searchOpen ? " open" : ""}`}
        onClick={() => setSearchOpen(true)}
      >
        <Search size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
        {searchOpen ? (
          <input
            ref={searchRef}
            className="floating-search-input"
            placeholder="Search apps or manwha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                window.open(
                  `https://mangadex.org/search?q=${encodeURIComponent(searchQuery.trim())}`,
                  "_blank",
                );
                setSearchOpen(false);
                setSearchQuery("");
              }
            }}
          />
        ) : (
          <span className="floating-search-placeholder">Search apps...</span>
        )}
      </div>

      {searchOpen && (
        <div className="floating-search-dropdown">
          {searchQuery.trim() && (
            <a
              href={`https://mangadex.org/search?q=${encodeURIComponent(searchQuery.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-search-result"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
            >
              <span>Search "{searchQuery}" on MangaDex</span>
              <span style={{ fontSize: 10, opacity: 0.4 }}>↗</span>
            </a>
          )}
          {filtered.map((app) => (
            <button
              key={app.key}
              className="floating-search-result"
              onClick={() => {
                onOpenApp(app.key);
                setSearchOpen(false);
                setSearchQuery("");
              }}
            >
              <span>{app.name}</span>
              <span style={{ fontSize: 10, opacity: 0.4 }}>↗</span>
            </button>
          ))}
          {filtered.length === 0 && !searchQuery.trim() && (
            <div className="floating-search-empty">Type to search...</div>
          )}
        </div>
      )}
    </div>
  );
}
