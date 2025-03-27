document.addEventListener("DOMContentLoaded", function () {
  loadComponent("booking-summary", "components/booking-summary.html", initializeBookingTabs, filterBookingHistory);
  loadComponent("booking-history", "components/booking-history.html");
  loadComponent("footer", "/pages/main/footer.html");
});

function loadComponent(id, url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    })
    .catch((error) => console.error(`${url} 로딩 중 오류 발생:`, error));
}

function initializeBookingTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  if (!tabs.length) return;

  // Default to first tab being active
  const firstTab = tabs[0];
  firstTab.classList.add('active');
  const firstTabImage = firstTab.querySelector('.tab-icon');
  firstTabImage.src = '/assets/images/all_calendar_green.png'; // 첫 번째 탭의 이미지를 초록색으로 설정

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        const tabImage = t.querySelector('.tab-icon');
        tabImage.src = '/assets/images/all_calendar.png'; // 원래 이미지로 복원
      });

      // Set the clicked tab to active
      tab.classList.add('active');
      const clickedTabImage = tab.querySelector('.tab-icon');
      clickedTabImage.src = '/assets/images/all_calendar_green.png'; // 클릭된 이미지로 변경

      const tabCategory = tab.getAttribute('data-tab');
      filterBookingHistory(tabCategory);
    });
  });
}

function filterBookingHistory(category) {
  const bookingItems = document.querySelectorAll('.booking-item');
  
  bookingItems.forEach(item => {
    switch(category) {
      case '전체':
        item.style.display = 'block';
        break;
      case '이용예정':
        item.style.display = item.classList.contains('upcoming') ? 'block' : 'none';
        break;
      case '이용완료':
        item.style.display = item.classList.contains('completed') ? 'block' : 'none';
        break;
      case '취소·환불':
        item.style.display = item.classList.contains('canceled') ? 'block' : 'none';
        break;
    }
  });
}
