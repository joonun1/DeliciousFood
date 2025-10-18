import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaHome, FaMap, FaHeart, FaUser, FaMicrophone, FaCamera } from "react-icons/fa";
import { api } from '../api/client';

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
  const [recentSearches, setRecentSearches] = useState([]);
  const [store, setStore] = useState(null);

  // ✅ 여기 추가: GET 호출 후 콘솔 확인
  useEffect(() => {
    async function fetchStore() {
      try {
        const data = await api.getStore("68de5ecfc695e985509bd75d");
        console.log("✅ GET 호출 성공:", data);
        setStore(data);

      } catch (err) {
        console.error("❌ GET 호출 실패:", err.message);
      }
    }
    fetchStore();
  }, []);

  // 검색어 엔터 시 최근 검색어 추가
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setRecentSearches((prev) => {
        if (prev.includes(query.trim())) return prev;
        return [query.trim(), ...prev].slice(0, 5); // 최대 5개
      });
      setQuery('');
    }
  };

  return (
    <div className="page-root">
      <div className="entire-container">
        {/* 홈 화면 */}
        {page === "home" && (
          <>
            {/* 음식 이미지 + 상단 요소 + 댓글 (food-section) */}
            <div className="food-section">
              {/* 상단 바 요소들 */}
              <div className="food-section-header">
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
                </div>
              </div>
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
            {/* 가게 정보 (food-section 바깥, 하단 바 위) */}
            <div className="restaurant-info">
              <span className="name">{store.name}</span>
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
                onKeyDown={handleSearchKeyDown}
                className="search-input"
              />
            </div>

            {/* 최근 검색 */}
            <div className="recent-section">
              <div className="recent-header">
                <span>Recent</span>
                <button className="more-btn">More &gt;</button>
              </div>
              <div className="recent-tags">
                {recentSearches.map((item, idx) => (
                  <span key={idx} className="recent-tag">
                    {item}
                    <span
                      style={{ marginLeft: 6, cursor: 'pointer' }}
                      onClick={() =>
                        setRecentSearches(recentSearches.filter((v, i) => i !== idx))
                      }
                    >
                      ✕
                    </span>
                  </span>
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
