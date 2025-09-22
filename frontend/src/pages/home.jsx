import { useState } from "react";
import { FaSearch, FaBell, FaHome, FaMap, FaHeart, FaUser, FaMicrophone, FaCamera } from "react-icons/fa";

export default function HomeScreen() {
  const [comments] = useState([
    { id: 1, nation: "USA", user: "Kim", text: "It was so delicious that I want to visit again next time." },
    { id: 2, nation: "USA", user: "Tim", text: "The bossam set was so amazing !" },
    { id: 3, nation: "USA", user: "Tim", text: "The bossam set was so amazing!" }
  ]);

  const [location, setLocation] = useState("Anguk");
  const [showDropdown, setShowDropdown] = useState(false);
  const locations = ["Anguk", "Seoul", "Busan", "Daegu"];
  const [liked, setLiked] = useState(false);

  const [page, setPage] = useState("home"); // "home" | "search"
  const [query, setQuery] = useState("");

  const recentSearches = [];

  return (
    <div className="page-root">
      <div className="entire-container">
        {/* 홈 화면 */}
        {page === "home" && (
          <>
            {/* 상단 바 */}
            <div className="top-bar">
              <div className="location-dropdown">
                <button
                  className="location-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {location} ▼
                </button>
                {showDropdown && (
                  <ul className="dropdown-menu">
                    {locations.map((loc, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setLocation(loc);
                          setShowDropdown(false);
                        }}
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="icons">
                <FaSearch onClick={() => setPage("search")} />
                <FaBell />
              </div>
            </div>

            {/* 음식 이미지 + 댓글 */}
            <div className="food-section">
              <img src="/img/food.jpg" alt="food" className="food-bg" />
              <div className="comment-overlay">
                {comments.map((c) => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      <span className="nation-tag">{c.nation}</span>
                      <span className="username">{c.user}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 가게 정보 */}
            <div className="restaurant-info">
              <span className="name">On-tatteut Sotbap</span>
              <span className="distance">235m</span>
              <button
                className={`like-btn ${liked ? "liked" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <FaHeart />
              </button>
            </div>
          </>
        )}

        {/* 검색 화면 */}
        {page === "search" && (
          <>
            {/* 검색 상단 */}
            <div className="search-top-bar">
              <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>

            {/* 최근 검색 */}
            <div className="recent-section">
              <div className="recent-header">
                <span>Recent</span>
                <button className="more-btn">More &gt;</button>
              </div>
              <div className="recent-tags">
                {recentSearches.map((item, idx) => (
                  <span key={idx} className="recent-tag">{item} ✕</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 하단 네비게이션 (공통) */}
        <div className="bottom-nav">
          <div
            className={`nav-item ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            <FaHome /><p>Home</p>
          </div>
          <div
            className={`nav-item ${page === "search" ? "active" : ""}`}
            onClick={() => setPage("search")}
          >
            <FaSearch /><p>Search</p>
          </div>
          <div className="nav-item"><FaMap /><p>Map</p></div>
          <div className="nav-item"><FaHeart /><p>Liked</p></div>
          <div className="nav-item"><FaUser /><p>My</p></div>
        </div>
      </div>
    </div>
  );
}
