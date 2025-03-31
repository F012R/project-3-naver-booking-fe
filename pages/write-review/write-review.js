document.addEventListener("DOMContentLoaded", function () {
  loadComponent(
    "regist-review",
    "/pages/write-review/components/regist-review.html",
    setReviewFeatures
  );
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

function setReviewFeatures() {
  addStarRating();
  addPhotoUpload();
  addRedirectButton();
}

// 별점 기능 추가: 사용자가 클릭한 별점의 값을 별점 오른쪽에 표시
function addStarRating() {
  document.querySelectorAll(".star").forEach(function (star) {
    star.addEventListener("click", function () {
      document.querySelector(".stars-score").textContent = this.value;
    });
  });
}

// 사진 업로드: [사진 추가] 버튼 클릭시 파일 입력창 출출력
function addPhotoUpload() {
  const fileInput = document.querySelector(".fileInput");
  const imageTrigger = document.querySelector(".imageTrigger");

  imageTrigger.addEventListener("click", function (event) {
    event.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      // 첨부할 수 있는 확장자 제한: jpg 또는 png
      const allowedExtensions = /(\.jpg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        alert("jpg 또는 png 파일만 업로드 가능합니다.");
        fileInput.value = "";
        return;
      }
      // 첨부한 파일 이름 표시
      document.querySelector(".fileLabel").textContent = file.name;
    } else {
      // 파일이 없을 경우, 기본 텍스트로 되돌리기
      document.querySelector(".fileLabel").textContent = "사진 추가";
    }
  });
}

// 리뷰 등록 버튼 클릭 시 페이지 이동: 한줄평 최소 글자 수와 별점 선택 여부를 확인한 뒤, 두 조건이 모두 충족되었을 경우에만 페이지 이동
function addRedirectButton() {
  const submitButton = document.querySelector(".submit-review");
  const reviewText = document.querySelector(".write-review");
  const stars = document.querySelectorAll(".star");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // 최소 글자 수 충족 여부
    if (reviewText.value.trim().length < 5) {
      alert("최소 다섯 글자 이상 입력해주세요.");
      return;
    }

    let isStarSelected = false;
    stars.forEach(function (star) {
      // 별점 선택 여부
      if (star.checked) {
        isStarSelected = true;
      }
    });

    if (!isStarSelected) {
      alert("별점을 선택해주세요.");
      return;
    }
    window.location.href = "/pages/my-booking/my-booking.html";
  });
}
