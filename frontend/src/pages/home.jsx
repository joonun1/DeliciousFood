import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaHome, FaMap, FaStar, FaPhone, FaClock, FaShareAlt, FaHeart, FaUser, FaMicrophone, FaCamera } from "react-icons/fa";
import { api } from '../api/client';


export default function HomeScreen() {
  const [comments] = useState([
    { id: 1, nation: "USA", user: "Kim", text: "It was so delicious that I want to visit again next time." },
    { id: 2, nation: "USA", user: "Tim", text: "The bossam set was so amazing !" },
    { id: 3, nation: "USA", user: "Anna", text: "Local taste, very unique experience!" }
  ]);

  const [location, setLocation] = useState("Anguk");
  const [showDropdown, setShowDropdown] = useState(false);
  const locations = ["Anguk", "Seoul", "Busan", "Daegu"];
  const [liked, setLiked] = useState(false);
  

  const [prevPage, setPrevPage] = useState("home");
  const [page, setPage] = useState("home"); // home | search | liked | detail | detailReview | my

  const [myTab, setMyTab] = useState("visits"); // visits | reviews | recent

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);


  const [stores, setStores] = useState([]);
  const [additionalStore, setAdditionalStore] = useState(null); // 새로 추가

  useEffect(() => {
  async function fetchStores() {
    try {
      const storeIds = ["692960884b39f58aadb4079f", "68de5ecfc695e985509bd75d"];
      const results = await Promise.all(storeIds.map(id => api.getStore(id)));
      setStores(results); // 배열에 모든 식당 저장
    } catch (err) {
      console.error("❌ GET 호출 실패:", err.message);
    }
  }
  fetchStores();
}, []);
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

        {/* --- HOME --- */}
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

                <div className="icons" onClick={() => setPage("search")} style={{ cursor: "pointer" }}>
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

              <div
                className="restaurant-info"
                onClick={() => {
                  setPrevPage("home");
                  setSelectedRestaurant(restaurants[0]);
                  setPage("detail");
                }}
              >
                <div className="restaurant-left">
                  <span className="name">{stores[0]?.name ?? '가게 이름 없음'}</span>
                  <span className="distance">235m</span>
                </div>

                <button
                  className={`like-btn ${liked ? "liked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked(!liked);
                    toggleLike(restaurants[0]);
                  }}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </>
        )}


        {/* --- SEARCH --- */}
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


        {/* --- MY PAGE --- */}
        {page === "my" && (
          <div className="my-screen">
            <div className="my-profile">
              <span className="my-nation">USA</span>
              <h2 className="my-name">Isabella</h2>
            </div>

            <div className="my-tabs">
              <span
                className={myTab === "visits" ? "active" : ""}
                onClick={() => setMyTab("visits")}
              >
                My Visits
              </span>

              <span
                className={myTab === "reviews" ? "active" : ""}
                onClick={() => setMyTab("reviews")}
              >
                Reviews
              </span>

              <span
                className={myTab === "recent" ? "active" : ""}
                onClick={() => setMyTab("recent")}
              >
                Recent
              </span>
            </div>

            {/* --- My Visits --- */}
            {myTab === "visits" && (
              <div className="my-visits-list">
                {restaurants.map((r) => (
                  <div
                    key={r.id}
                    className="my-visit-item"
                    onClick={() => {
                      setPrevPage("my");
                      setSelectedRestaurant(r);
                      setPage("detail");
                    }}
                  >
                    <img src={r.img} alt={stores[0].name} className="visit-img" />

                    <div className="visit-info">
                      <div className="visit-title-row">
                        <span className="visit-name">{stores[0].name}</span>
                        <span className="visit-distance">{r.distance}</span>
                      </div>

                      <div className="visit-rating-row">⭐ {r.rating}</div>
                    </div>

                    <div className="visit-like-btn">
                      <FaHeart
                        className={
                          likedList.find((x) => x.id === r.id) ? "heart liked" : "heart"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(r);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* --- My Reviews (피그마 스타일) --- */}
            {myTab === "reviews" && (
              <div className="my-reviews-list">
                {restaurants.map((r) =>
                  r.reviews.map((rev) => (
                    <div key={rev.id} className="review-item">
                      <div className="review-header">
                        <span className="review-user">{rev.user}</span>
                        <span className="review-date">24.10.27</span>
                      </div>

                      <div className="review-stars">⭐⭐⭐⭐⭐</div>

                      {/* 사진 3장 가로로 나란히 */}
                      <div className="review-images-row">
                        <img src={r.img} className="review-img" />
                        <img src={r.img} className="review-img" />
                        <img src={r.img} className="review-img" />
                      </div>

                      <p className="review-text">{rev.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}


            {/* --- My Recent (비어있어도 클릭 동작은 정상) --- */}
            {myTab === "recent" && (
              <div className="recent-empty">No recent activity.</div>
            )}
          </div>
        )}


        {/* --- LIKED PAGE --- */}
        {page === "liked" && (
          <div className="liked-screen">
            <h2 className="liked-title">Liked Restaurants</h2>

            <div className="liked-list">
              {likedList.map((r) => (
                <div
                  key={r.id}
                  className="liked-item"
                  onClick={() => {
                    setPrevPage("liked");
                    setSelectedRestaurant(r);
                    setPage("detail");
                  }}
                >
                  <img src={r.img} alt={stores[0]?.name} />
                  <div className="liked-info">
                    <p className="liked-name">{r.name}</p>
                    <p className="liked-distance">{r.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* --- DETAIL PAGE --- */}
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
                  <button
                    className="back-btn"
                    onClick={() => setPage(prevPage)}
                  >
                    ←
                  </button>

                  <span className="detail-distance">{selectedRestaurant.distance}</span>
                </div>
              </div>

              <div className="detail-body">
                <h2 className="detail-name">{stores[0].name}</h2>

                <p className="detail-rating">
                  <FaStar className="star" /> {stores[0].ratingAvg}
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
                    <span
                      className="active"
                      style={{ cursor: "pointer" }}
                      onClick={() => setPage("detailReview")}
                    >
                      Review
                    </span>
                    <span>Menu</span>
                  </div>

                  {selectedRestaurant.reviews.slice(0, 1).map((rev) => (
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


        {/* --- DETAIL REVIEW PAGE --- */}
        {page === "detailReview" && selectedRestaurant && (
          <div className="detail-review-screen">

            <button className="back-btn" onClick={() => setPage("detail")}>
              ←
            </button>

            <h2 className="detail-review-title">Reviews</h2>

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
        )}

        {/* --- BOTTOM NAV --- */}
        {page !== "detail" && page !== "detailReview" && (
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

            <div
              className={`nav-item ${page === "my" ? "active" : ""}`}
              onClick={() => setPage("my")}
            >
              <FaUser />
              <p>My</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
