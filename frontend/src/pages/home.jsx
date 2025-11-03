import { useState } from "react";
import {
  FaSearch,
  FaHome,
  FaMap,
  FaHeart,
  FaUser,
  FaShareAlt,
} from "react-icons/fa";

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
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const restaurants = [
    {
      id: 1,
      name: "On-tatteut Sotbap",
      distance: "235m",
      img: "/img/food.jpg",
      reviews: [
        { id: 1, user: "Tom", text: "It was so good, friendly staff!" },
        { id: 2, user: "Yuna", text: "Very local vibe and delicious food." },
      ],
    },
    {
      id: 2,
      name: "Jongno Noodle House",
      distance: "190m",
      img: "/img/food2.jpg",
      reviews: [
        { id: 1, user: "Chris", text: "Best noodles I've had!" },
      ],
    },
  ];

  const [likedList, setLikedList] = useState([
    restaurants[0],
    restaurants[1],
  ]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setRecentSearches((prev) => {
        if (prev.includes(query.trim())) return prev;
        return [query.trim(), ...prev].slice(0, 5);
      });
      setQuery("");
    }
  };

  const toggleLike = (r) => {
    if (likedList.find((x) => x.id === r.id)) {
      setLikedList(likedList.filter((x) => x.id !== r.id));
    } else {
      setLikedList([...likedList, r]);
    }
  };

  return (
    <div className="page-root">
      <div className="entire-container">
        {/* ✅ 홈 화면 */}
        {page === "home" && (
          <>
            <div className="food-section">
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

            <div className="restaurant-info">
              <span className="name">On-tatteut Sotbap</span>
              <span className="distance">235m</span>
              <button
                className={`like-btn ${liked ? "liked" : ""}`}
                onClick={() => {
                  setLiked(!liked);
                  toggleLike(restaurants[0]);
                }}
              >
                <FaHeart />
              </button>
            </div>
          </>
        )}

        {/* ✅ 검색 화면 */}
        {page === "search" && (
          <>
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
                      style={{ marginLeft: 6, cursor: "pointer" }}
                      onClick={() =>
                        setRecentSearches(
                          recentSearches.filter((v, i) => i !== idx)
                        )
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

        {/* ✅ Liked 화면 */}
        {page === "liked" && (
          <div className="liked-screen">
            <h2 className="liked-title">Liked Restaurants</h2>
            <div className="liked-list">
              {likedList.length === 0 ? (
                <p className="empty-text">No liked restaurants yet.</p>
              ) : (
                likedList.map((r) => (
                  <div
                    key={r.id}
                    className="liked-item"
                    onClick={() => {
                      setSelectedRestaurant(r);
                      setPage("detail");
                    }}
                  >
                    <img src={r.img} alt={r.name} />
                    <div className="liked-info">
                      <p className="liked-name">{r.name}</p>
                      <p className="liked-distance">{r.distance}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {page === "detail" && selectedRestaurant && (
  <div className="detail-screen">
    {/* ✅ 스크롤 영역 */}
    <div className="detail-scroll-area">
      {/* 상단 이미지 */}
      <div className="detail-header">
        <img
          src={selectedRestaurant.img}
          alt={selectedRestaurant.name}
          className="detail-img"
        />
        <div className="detail-overlay">
          <button className="back-btn" onClick={() => setPage("liked")}>
            ←
          </button>
          <span className="detail-distance">{selectedRestaurant.distance}</span>
        </div>
      </div>

      {/* 식당 이름, 태그, 정보 */}
      <div className="detail-body">
        <h2 className="detail-name">{selectedRestaurant.name}</h2>
        <div className="detail-tags">
          <span># Local pick</span>
          <span># Pork</span>
          <span># Preference 98%</span>
        </div>

        <div className="detail-info-block">
          <p>⭐ 4.7</p>
          <p>Open: 11:30 - 21:00</p>
          <p>Restaurant liked 2000+</p>
          <p>Local’s Pick Top 1%</p>
        </div>

        {/* 아이콘 정보 */}
        <div className="detail-icons">
          <div>
            <FaMap /> <p>15 Seats</p>
          </div>
          <div>
            <FaShareAlt /> <p>WiFi</p>
          </div>
          <div>
            <FaUser /> <p>English / Japanese</p>
          </div>
          <div>
            <FaSearch /> <p>Apple Pay</p>
          </div>
        </div>

        {/* 지도 */}
        <div className="detail-map-section">
          <p className="map-label">3 minutes walk</p>
          <img src="/img/map-example.png" alt="Map" className="detail-map" />
        </div>

        {/* 리뷰 */}
        <div className="detail-review-section">
          <div className="review-tabs">
            <span className="active">Review 265</span>
            <span>Menu</span>
          </div>

          {selectedRestaurant.reviews.map((rev) => (
            <div key={rev.id} className="review-item">
              <div className="review-header">
                <span className="review-user">{rev.user}</span>
                <span className="review-date">24.10.27</span>
              </div>
              <div className="review-stars">⭐⭐⭐⭐☆</div>
              <p className="review-text">{rev.text}</p>
            </div>
          ))}

          <button className="review-more">Review More (109)</button>
        </div>
      </div>
    </div>

    {/* ✅ 하단 고정 바 (피그마 구조, 기존 bottom-nav 높이 맞춤) */}
    <div className="detail-bottom-bar">
      <button className="detail-btn">
        <FaHeart /> <span>4.4K</span>
      </button>
      <button className="detail-btn">
        <FaShareAlt /> <span>Share</span>
      </button>
      <button className="detail-btn way">
        <FaMap /> <span>Finding the way</span>
      </button>
    </div>
  </div>
)}

        {/* ✅ 하단 네비게이션 고정 */}
        <div className="bottom-nav">
          <div
            className={`nav-item ${page === "home" ? "active" : ""}`}
            onClick={() => setPage("home")}
          >
            <FaHome />
            <p>Home</p>
          </div>
          <div
            className={`nav-item ${page === "search" ? "active" : ""}`}
            onClick={() => setPage("search")}
          >
            <FaSearch />
            <p>Search</p>
          </div>
          <div className="nav-item">
            <FaMap />
            <p>Map</p>
          </div>
          <div
            className={`nav-item ${page === "liked" ? "active" : ""}`}
            onClick={() => setPage("liked")}
          >
            <FaHeart />
            <p>Liked</p>
          </div>
          <div className="nav-item">
            <FaUser />
            <p>My</p>
          </div>
        </div>
      </div>
    </div>
  );
}
