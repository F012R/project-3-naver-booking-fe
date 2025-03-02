document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html");
  loadComponent("description", "components/description.html");
  loadComponent("event", "components/event.html");
  loadComponent("booking", "components/booking.html");
  loadComponent("review", "components/review.html");
  loadComponent("detail", "components/detail.html");
  loadComponent("footer", "../main/footer.html");
});

function loadComponent(id, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((error) => console.error(`${url} 로딩 중 오류 발생:`, error));
}
