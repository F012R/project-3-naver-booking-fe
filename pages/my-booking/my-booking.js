document.addEventListener("DOMContentLoaded", function () {
  loadComponent("booking-summary", "components/booking-summary.html");
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
