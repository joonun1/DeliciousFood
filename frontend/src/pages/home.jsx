import { useState } from "react";
import { FaSearch, FaBell, FaHome, FaMap, FaHeart, FaUser } from "react-icons/fa";

export default function HomeScreen() {
  const [comments] = useState([
    { id: 1, nation: "USA", user: "Kim", text: "It was so delicious that I want to visit again next time." },
    { id: 2, nation: "USA", user: "Tim", text: "The bossam set was so amazing !" },
    { id: 3, nation: "USA", user: "Tim", text: "The bossam set was so amazing!" }
  ]);

  return (
    <div className="page-root">
        <div className="entire-container">
      {/* 상단 바 */}
      <div className="top-bar">
        <span className="location">Anguk ▼</span>
        <div className="icons">
          <FaSearch />
          <FaBell />
        </div>
      </div>

      {/* 음식 이미지 + 댓글 */}
        <div className="food-section">
        <img src="/img/food.jpg" alt="food" className="food-bg" />

        {/* 댓글 리스트 (겹쳐서 고정) */}
        <div className="comment-overlay">
  {comments.map(c => (
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
        <FaHeart className="like-icon" />
      </div>

      {/* 하단 네비게이션 */}
      <div className="bottom-nav">
        <div className="nav-item"><FaHome /><p>Home</p></div>
        <div className="nav-item"><FaSearch /><p>Search</p></div>
        <div className="nav-item"><FaMap /><p>Map</p></div>
        <div className="nav-item"><FaHeart /><p>Liked</p></div>
        <div className="nav-item"><FaUser /><p>My</p></div>
        </div>
      </div>
    </div>
  );
}
