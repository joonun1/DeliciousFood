import { useState, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaHome,
  FaMap,
  FaHeart,
  FaUser,
  FaMicrophone,
  FaCamera,
  FaStar,
  FaShareAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import { api } from "../api/client";

export default function HomeScreen() {
  const [comments] = useState([
    { id: 1, nation: "USA", user: "Kim", text: "It was so delicious that I want to visit again next time." },
    { id: 2, nation: "USA", user: "Tim", text: "The bossam set was so amazing !" },
    { id: 3, nation: "USA", user: "Anna", text: "Local taste, very unique experience!" },
  ]);

  const [location, setLocation] = useState("Anguk");
  const [showDropdown, setShowDropdown] = useState(false);
  const locations = ["Anguk", "Seoul", "Busan", "Daegu"];
  const [liked, setLiked] = useState(false);

  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ✅ 프론트 더미 데이터 (기존 HEAD 유지)
  const restaurants = [
    {
      id: 1,
      name: "On-tatteut Sotbap",
      distance: "235m",
      img: "/img/food.jpg",
      rating: 4.7,
      phone: "02-123-4567",
      hours: "11:30 - 21:00",
      address: "45-1, Anguk-ro, Seoul",
      likedCount: "4.4K",
      tags: ["Local Pick", "Pork", "Preference 98%"],
      reviews: [
        { id: 1, user: "Tom", text: "It was so good, friendly staff!" },
        { id: 2, user: "Yuna", text: "Very local vibe and delicious food." },
      ],
    },
    {
      id: 2,
      name: "Jongno Noodle House",
      distance: "190m",
      img: "/img/noodle.jpg",
      rating: 4.4,
      phone: "02-987-6543",
      hours: "10:00 - 21:30",
      address: "12 Jongno-gu, Seoul",
      likedCount: "2.8K",
      tags: ["Udon", "Tempura", "Local Favorite"],
      reviews: [{ id: 1, user: "Chris", text: "Best noodles I've had!" }],
    },
  ];

  const [likedList, setLikedList] = useState(restaurants);

  // ✅ 백엔드 연동 (추가된 부분)
  const [store, setStore] = useState(null);
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
        {/* HOME */}
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

                <div
                  className="icons"
                  onClick={() => setPage("search")}
                  style={{ cursor: "pointer" }}
                >
                  <FaSearch />
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

              {/* ✅ 가게 정보 표시 (백엔드 데이터 우선, 없으면 더미 사용) */}
              <div className="restaurant-info">
                <div className="restaurant-left">
                  <span className="name">{store?.name ?? restaurants[0].name}</span>
                  <span className="distance">{restaurants[0].distance}</span>
                </div>
                <div className="restaurant-right">
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
              </div>
            </div>
          </>
        )}

        {/* SEARCH */}
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

        {/* LIKED */}
        {page === "liked" && (
          <div className="liked-screen">
            <h2 className="liked-title">Liked Restaurants</h2>
            <div className="liked-list">
              {likedList.map((r) => (
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
              ))}
            </div>
          </div>
        )}

        {/* DETAIL */}
        {page === "detail" && selectedRestaurant && (
          <div className="detail-screen">
            <div className="detail-scroll-area">
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

              <div className="detail-body">
                <h2 className="detail-name">{selectedRestaurant.name}</h2>
                <p className="detail-rating">
                  <FaStar className="star" /> {selectedRestaurant.rating}
                </p>

                <div className="detail-tags">
                  {selectedRestaurant.tags.map((t, i) => (
                    <span key={i}>#{t}</span>
                  ))}
                </div>

                <div className="detail-info-block">
                  <p><FaPhone /> {selectedRestaurant.phone}</p>
                  <p><FaClock /> {selectedRestaurant.hours}</p>
                  <p>📍 {selectedRestaurant.address}</p>
                  <p>💬 Restaurant liked {selectedRestaurant.likedCount}</p>
                </div>

                <div className="detail-review-section">
                  <div className="review-tabs">
                    <span className="active">Review</span>
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
                </div>
              </div>
            </div>

            <div className="detail-bottom-bar-container">
              <div className="detail-bottom-bar">
                <button className="detail-btn" onClick={() => toggleLike(selectedRestaurant)}>
                  <FaHeart /> <span>{selectedRestaurant.likedCount}</span>
                </button>
                <button className="detail-btn" onClick={() => alert("Share!")}>
                  <FaShareAlt /> <span>Share</span>
                </button>
                <button className="detail-btn way" onClick={() => alert("Open map")}>
                  <FaMap /> <span>Find Way</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 네비게이션 (상세 화면에서는 숨김) */}
        {page !== "detail" && (
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
        )}
      </div>
    </div>
  );
}
