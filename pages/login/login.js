document.addEventListener("DOMContentLoaded", function () {
  loadComponent("login-form", "components/login-form.html", setLoginForm);
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

// 예약 확인을 위한 로그인 폼과 이메일 입력 칸을 찾아 초기 핸들러와 연결
function setLoginForm() {
  const form = document.querySelector(".reservation-check-form form");
  const emailInput = document.querySelector(".reservation-check-form input");

  addFormSubmitHandler(form, emailInput);
  emailInput.focus();
}

// 사용자가 폼을 제출할 경우, 기본 동작을 막고 handleEmailSubmission 함수 실행
function addFormSubmitHandler(form, emailInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleEmailSubmission(emailInput);
  });
}

// 이메일 형식이 올바를 경우 나의 예매내역 페이지로 이동, 이메일 형식이 올바르지 않을 경우 에러 메시지 출력
function handleEmailSubmission(emailInput) {
  const email = emailInput.value.trim();

  if (!isEmailValid(email)) {
    alert("유효한 이메일 주소를 입력해주세요.");
    emailInput.focus();
    return;
  }

  window.location.href = "/pages/my-booking/my-booking.html";
}

// 입력된 문자열이 올바른 이메일 형식인지 확인
function isEmailValid(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}
