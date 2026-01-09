import { useState, useEffect } from "react";
import { FaSearch, FaBell, FaHome, FaMap, FaStar, FaPhone, FaClock, FaShareAlt, FaHeart, FaUser, FaMicrophone, FaCamera } from "react-icons/fa";
import { api } from '../api/client';


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Leaflet 기본 아이콘 설정 (ES 모듈 방식)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});



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
  const [page, setPage] = useState("home"); // home | search | liked | detail | detailReview | my | map

  const [myTab, setMyTab] = useState("visits"); // visits | reviews | recent

  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  useEffect(() => {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setMyLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      console.error("❌ 위치 가져오기 실패:", err.message);
    }
  );
}, []);


function getDistanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // 지구 반지름 (m)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // meter
}


  const [stores, setStores] = useState([]);
  const [additionalStore, setAdditionalStore] = useState(null); // 새로 추가

  useEffect(() => {
  async function fetchStores() {
    try {
      const storeIds = ["692d29af680d3fcbc9cac55f", "69304a2322d0f3cb9952d621"];
      const results = await Promise.all(storeIds.map(id => api.getStore(id)));
      setStores(results); // 배열에 모든 식당 저장
      console.log("API STORE RAW:", results);

    } catch (err) {
      console.error("❌ GET 호출 실패:", err.message);
    }
    
  }
  fetchStores();
}, []);

const displayStores = stores
  .filter((s) => s.lat && s.lng)
  .map((s, index) => {
    const distance =
      myLocation
        ? getDistanceInMeters(
            myLocation.lat,
            myLocation.lng,
            s.lat,
            s.lng
          )
        : null;

    return {
      id: String(s.id),
      name: s.name,
      img: s.img ?? (index === 0 ? "/img/food.jpg" : "/img/noodle.jpg"),
      rating: s.rating,
      ratingCount: s.ratingCount,
      phone: s.phone,
      hours: s.hours,
      address: s.address,
      likedCount: s.likedCount,
      tags: s.tags ?? [],
      lat: s.lat,
      lng: s.lng,
      distance,   // ✅ 실제 거리
      reviews: [],
    };
  });



  //  const restaurants = [
  //   {
  //     id: 1,
  //     name: "On-tatteut Sotbap",
  //     storeId: "692960884b39f58aadb4079f",
  //     distance: "235m",
  //     img: "/img/food.jpg",
  //     rating: 4.7,
  //     phone: "02-123-4567",
  //     hours: "11:30 - 21:00",
  //     address: "12-3, Anguk-ro, Seoul",
  //     likedCount: "4.4K",
  //     tags: ["Local Pick", "Pork", "Preference 98%"],
  //     reviews: [
  //       { id: 1, user: "Tom", text: "It was so good, friendly staff!" },
  //       { id: 2, user: "Yuna", text: "Very local vibe and delicious food." },
  //     ],
  //     // 예시 좌표 (Anguk 근처)
  //     lat: 37.57, 
  //     lng: 126.98
  //   },
  //   {
  //     id: 2,
  //     name: "Jongno Noodle House",
  //     storeId: "68de5ecfc695e985509bd75d",
  //     distance: "190m",
  //     img: "/img/noodle.jpg",
  //     rating: 4.4,
  //     phone: "02-987-6543",
  //     hours: "10:00 - 21:30",
  //     address: "12 Jongno-gu, Seoul",
  //     likedCount: "2.8K",
  //     tags: ["Udon", "Tempura", "Local Favorite"],
  //     reviews: [{ id: 1, user: "Chris", text: "Best noodles I've had!" }],
  //     lat: 37.572,
  //     lng: 126.991
  //   },
  // ];

 const [likedList, setLikedList] = useState([]);


  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      setRecentSearches((prev) => {
        if (prev.includes(query.trim())) return prev;
        return [query.trim(), ...prev].slice(0, 5);
      });
      setQuery("");
    }
  };

  const toggleLike = (store) => {
  if (likedList.find((x) => x.id === store.id)) {
    setLikedList(likedList.filter((x) => x.id !== store.id));
  } else {
    setLikedList([...likedList, store]);
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
                  if (displayStores.length === 0) return;
                  setSelectedRestaurant(displayStores[0]);
                  setPage("detail");
                }}
              >
                <div className="restaurant-left">
  {displayStores.length > 0 && (
    <span className="name">
      {displayStores[0]?.name}
    </span>
  )}

  {displayStores.length > 0 && (
    <span className="distance">
  {displayStores[0]?.distance
    ? `${displayStores[0].distance}m`
    : "거리 계산 중"}
</span>

  )}
</div>


                <button
  className={`like-btn ${
    likedList.find((x) => x.id === displayStores[0]?.id) ? "liked" : ""
  }`}
  onClick={(e) => {
    e.stopPropagation();
    toggleLike(displayStores[0]);
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

            {myTab === "visits" && (
  <div className="my-visits-list">
    {displayStores.map((r) => {
      const isLiked = likedList.some((x) => x.id === r.id);

      return (
        <div
          key={r.id}
          className="my-visit-item"
          onClick={() => {
            setPrevPage("my");
            setSelectedRestaurant(r);
            setPage("detail");
          }}
        >
          {/* 식당 이미지 */}
          <img
            src={r.img}
            alt={r.name}
            className="visit-img"
          />

          {/* 식당 정보 */}
          <div className="visit-info">
            <div className="visit-title-row">
              <span className="visit-name">{r.name}</span>

              {/* ❤️ 좋아요 버튼 */}
              <FaHeart
                className={isLiked ? "heart liked" : "heart"}
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 방지
                  toggleLike(r);
                }}
              />
            </div>

            <div className="visit-rating-row">
              ⭐ {r.ratingAvg ?? r.rating ?? 0}
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}



            {myTab === "reviews" && (
  <div className="my-reviews-list">
    <div className="recent-empty">
      Reviews will be available soon.
    </div>
  </div>
)}

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
                  <p className="liked-distance">Nearby</p>
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

                  <span className="detail-distance">
                    {selectedRestaurant.distance
                    ? `${selectedRestaurant.distance}m`
                      : ""}
                  </span>

                </div>
              </div>

              <div className="detail-body">
                <h2 className="detail-name">
  {selectedRestaurant.name}
</h2>

                <p className="detail-rating">
                  <FaStar className="star" />
                  {selectedRestaurant.rating ?? "-"}
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

                  {selectedRestaurant.reviews?.slice(0, 1).map((rev) => (
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

            {selectedRestaurant.reviews?.map((rev) => (
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


        {/* --- MAP PAGE --- */}
        {page === "map" && (
        <div className="map-screen">
        <MapContainer center={[37.574, 126.985]} zoom={15}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {displayStores.map((s) => (
  <Marker
    key={s.id}
    position={[s.lat, s.lng]}
  >
    <Popup>
      {s.name} <br />
      {s.address}
    </Popup>
  </Marker>
))}


            </MapContainer>
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

            <div
              className={`nav-item ${page === "map" ? "active" : ""}`}
              onClick={() => setPage("map")}
            >
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
