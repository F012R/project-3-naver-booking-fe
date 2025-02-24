document.addEventListener("DOMContentLoaded", function () {
  fetch("../pages/main/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch((error) => console.error("footer.html 로딩 중 오류 발생:", error));
});
