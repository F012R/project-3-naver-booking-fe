document.addEventListener("DOMContentLoaded", function () {
  fetch("../pages/main/promotion.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("promotion").innerHTML = data;
    })
    .catch((error) =>
      console.error("promotion.html 로딩 중 오류 발생:", error)
    );
});
