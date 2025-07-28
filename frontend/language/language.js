const languageListDiv = document.querySelector('.language'); // .language 클래스를 가진 div
const searchInput = document.getElementById('search-input');

// 만약 API에서 언어 목록을 받아오고 싶다면, 이 부분을 수정
let allLanguages = [
  "English", "Japanese", "Chinese", "French", "Korean", "Filipino",
  "Thai", "Dutch", "German", "Norweigan", "Spanish", "Italy"
];
let currentFilteredLanguages = [...allLanguages]; // 현재 필터링되어 화면에 표시될 언어 목록

function renderLanguages(languagesToRender) {
  languageListDiv.innerHTML = ''; 

  if (languagesToRender.length === 0) {
    languageListDiv.innerHTML = '<p style="color:#888; text-align:center;">검색 결과가 없습니다.</p>';
    return;
  }

  languagesToRender.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'language-btn';
    btn.textContent = lang;
    languageListDiv.appendChild(btn);
  });

  updateFadedButtons();
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  currentFilteredLanguages = allLanguages.filter(lang =>
    lang.toLowerCase().includes(searchTerm)
  );

  renderLanguages(currentFilteredLanguages);
});

languageListDiv.addEventListener('click', (event) => {
  const clickedButton = event.target;

  if (clickedButton.classList.contains('language-btn')) {
    if (clickedButton.classList.contains('disabled')) {
      return;
    }

    const allLanguageButtons = languageListDiv.querySelectorAll('.language-btn');
    allLanguageButtons.forEach(btn => {
      btn.classList.remove('selected');
    });

    clickedButton.classList.add('selected');
  }
});

function updateFadedButtons() {
  const buttons = Array.from(languageListDiv.querySelectorAll('.language-btn'));
 
  buttons.forEach(btn => btn.classList.remove('faded'));

  if (languageListDiv.scrollHeight > languageListDiv.clientHeight) {
    const visibleButtons = buttons.filter(btn => {
      const rect = btn.getBoundingClientRect();
      const containerRect = languageListDiv.getBoundingClientRect(); // 여기서 다시 가져옵니다.
      return rect.top < containerRect.bottom && rect.bottom > containerRect.top;
    });

    const count = visibleButtons.length;
    if (count >= 2) {
      visibleButtons[count - 1].classList.add('faded');
      visibleButtons[count - 2].classList.add('faded');
    } else if (count === 1) {
      visibleButtons[0].classList.add('faded');
    }
  }
}

languageListDiv.addEventListener('scroll', updateFadedButtons);

renderLanguages(allLanguages);