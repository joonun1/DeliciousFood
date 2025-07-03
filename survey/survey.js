function nextPage(n) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page${n}`).classList.add('active');
  }
  
  function prevPage(n) {
    if (n <= 1) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page${n - 1}`).classList.add('active');
  }
  document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
  
    function updateSliderColor(value) {
      const max = parseInt(slider.max);
      const percentage = (value / max) * 100 + "%";
      slider.style.setProperty('--progress', percentage);
    }
  
    slider.addEventListener("input", function () {
      updateSliderColor(this.value);
    });
  
    updateSliderColor(slider.value); // 초기 상태 반영
  });