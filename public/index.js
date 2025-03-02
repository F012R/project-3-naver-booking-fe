 // header 컴포넌트 추가
 document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "../pages/main/header.html", () => {
      const userEmail = localStorage.getItem("userEmail");
      const emailElement = document.getElementById("user-email");
      
      if (emailElement) {
        emailElement.textContent = userEmail ? userEmail : "예약확인";
        emailElement.addEventListener("click", function () {
          window.location.href = userEmail ? "my-booking.html" : "login.html";
        });
      }
    });
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
