// nation.js

// 1. DOM 요소 가져오기
const nationListDiv = document.querySelector('.nation-list');
const searchInput = document.getElementById('search-input');

// 2. 국가 데이터 (HTML에 있던 목록을 기반으로 초기화)
let allNations = [
  "USA", "Japan", "China", "France", "Philippines", "Thailand", "Canada",
  "South Korea", "United Kingdom", "Australia", "Brazil", "India", "Mexico",
  "Spain", "Italy", "Russia", "Argentina", "Egypt", "Nigeria", "South Africa",
  "Sweden", "Norway", "Finland", "Denmark", "Switzerland", "Austria",
  "Belgium", "Portugal", "Greece", "Turkey", "Indonesia", "Vietnam",
  "Malaysia", "Singapore", "New Zealand"
];

let currentFilteredNations = [...allNations]; // 현재 필터링되어 화면에 표시될 국가 목록

// 3. 국가 버튼 렌더링 함수
function renderNations(nationsToRender) {
  nationListDiv.innerHTML = ''; // 기존 내용 초기화

  if (nationsToRender.length === 0) {
    nationListDiv.innerHTML = '<p style="color:#888; text-align:center;">검색 결과가 없습니다.</p>';
    return;
  }

  nationsToRender.forEach(nation => {
    const btn = document.createElement('button');
    btn.className = 'nation-btn';
    btn.textContent = nation;

    // 필요하다면 특정 국가를 disabled 상태로 만들 수 있습니다.
    // 예: if (nation === "Netherland" || nation === "Germany") {
    //       btn.classList.add('disabled');
    //       btn.disabled = true;
    //     }

    nationListDiv.appendChild(btn);
  });

  // 버튼 렌더링 후 스크롤 페이드 효과 업데이트 (초기 상태 반영)
  updateFadedButtons();
}

// 4. 검색 입력 이벤트 처리
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  currentFilteredNations = allNations.filter(nation =>
    nation.toLowerCase().includes(searchTerm)
  );

  renderNations(currentFilteredNations);
});

// 5. 버튼 클릭 이벤트 처리 (이벤트 위임 사용)
nationListDiv.addEventListener('click', (event) => {
  const clickedButton = event.target;

  // 클릭된 요소가 'nation-btn' 클래스를 가지고 있는지 확인
  if (clickedButton.classList.contains('nation-btn')) {
    // 'disabled' 상태인 버튼은 선택되지 않도록
    if (clickedButton.classList.contains('disabled')) {
      return;
    }

    // 모든 국가 버튼에서 'selected' 클래스 제거 (단일 선택 유지)
    const allNationButtons = nationListDiv.querySelectorAll('.nation-btn');
    allNationButtons.forEach(btn => {
      btn.classList.remove('selected');
    });

    // 클릭된 버튼에 'selected' 클래스 추가
    clickedButton.classList.add('selected');
  }
});

// 6. 스크롤 시 아래쪽 두 버튼 흐려지는 효과 (faded)
function updateFadedButtons() {
  const buttons = Array.from(nationListDiv.querySelectorAll('.nation-btn'));

  // 모든 버튼에서 'faded' 클래스 제거 (초기화)
  buttons.forEach(btn => btn.classList.remove('faded'));

  // 리스트가 실제로 스크롤 가능한지 확인
  if (nationListDiv.scrollHeight > nationListDiv.clientHeight) {
    // 현재 화면에 보이는 버튼들만 필터링
    const visibleButtons = buttons.filter(btn => {
      const rect = btn.getBoundingClientRect();
      const containerRect = nationListDiv.getBoundingClientRect();
      // 버튼의 상단이 컨테이너 하단보다 위에 있고, 버튼의 하단이 컨테이너 상단보다 아래에 있으면 보임
      return rect.top < containerRect.bottom && rect.bottom > containerRect.top;
    });

    // 보이는 버튼 중 마지막 두 개에 'faded' 클래스 추가
    const count = visibleButtons.length;
    if (count >= 2) {
      visibleButtons[count - 1].classList.add('faded');
      visibleButtons[count - 2].classList.add('faded');
    } else if (count === 1) {
      visibleButtons[0].classList.add('faded');
    }
  }
}

// 스크롤 이벤트에 'updateFadedButtons' 함수 연결
nationListDiv.addEventListener('scroll', updateFadedButtons);

// 페이지 초기 로드 시 국가 버튼 렌더링 및 페이드 효과 업데이트
renderNations(allNations);