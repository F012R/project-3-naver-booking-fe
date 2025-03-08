document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html");
  loadComponent("description", "components/description.html");
  loadComponent("event", "components/event.html");
  loadComponent("booking", "components/booking.html");
  loadComponent(
    "recent-review",
    "components/recent-review.html",
    loadRecentReviewDatas
  );
  loadComponent("detail", "components/detail.html");
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

// ▶ review
let reviewData = [];

// 더미 데이터 가져오기
function fetchReviewDatas() {
  return fetch("/assets/jsons/review-dummy-data.json")
    .then((response) => response.json())
    .then((data) => {
      reviewData = data;
      return data;
    })
    .catch((error) => {
      console.error("리뷰 데이터 로딩 중 오류 발생:", error);
      return []; // 에러 발생 시 빈 배열 반환
    });
}

// review-area - 데이터에 따라 한줄평 영역 HTML 생성하기
function createReviewItems() {
  const recentReviewsContainer = document.querySelector(".recent-reviews");
  // 한줄평 서식 템플릿으로 저장
  const reviewItemTemplate = document.querySelector(
    ".recent-reviews__item"
  ).outerHTML;
  recentReviewsContainer.innerHTML = "";

  // 한줄평 데이터 없을 경우
  if (!reviewData || reviewData.length === 0) {
    const noReviewElement = document.createElement("div");
    noReviewElement.className = "recent-reviews__no-items";
    noReviewElement.textContent = "등록된 한줄평이 없습니다.";
    recentReviewsContainer.appendChild(noReviewElement);
    return;
  }

  // 한줄평 영역 최대 3개까지 생성
  const itemCount = Math.min(3, reviewData.length);
  for (let i = 0; i < itemCount; i++) {
    recentReviewsContainer.innerHTML += reviewItemTemplate;
  }
}

// review-summary - 평균 평점 계산하기
function setAverageRating() {
  const ratings = reviewData.map((review) => review.score);
  const averageRating =
    ratings.reduce((sum, score) => sum + score, 0) / ratings.length;
  const formattedRating = averageRating.toFixed(1);

  const ratingElement = document.querySelector(".review-summary__value");
  ratingElement.textContent = formattedRating;

  return formattedRating;
}

// review-summary - 등록된 한줄평의 총 개수 계산하기
function setReviewCount() {
  const reviewCount = reviewData.length;

  const countElement = document.querySelector(".review-summary__count");
  countElement.textContent = reviewCount;

  return reviewCount;
}

// recent-reviews__item - 상품명 삽입하기
function setProductTitles() {
  const productTitleElements = document.querySelectorAll(
    ".recent-reviews__product-title"
  );
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    productTitleElements[i].textContent = reviewData[i].product_name;
  }
}

// recent-reviews__item - 내용 삽입하기
function setReviewTexts() {
  const reviewTextElements = document.querySelectorAll(".recent-reviews__text");
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    reviewTextElements[i].textContent = reviewData[i].comment;
  }
}

// recent-reviews__item - 이미지 삽입하기
function setReviewImages() {
  const imageContainers = document.querySelectorAll(".recent-reviews__image");
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    const review = reviewData[i];
    imageContainers[i].innerHTML = "";

    if (review.file_info && review.file_info.save_file_name) {
      const img = document.createElement("img");
      img.src = review.file_info.save_file_name + ".png";
      img.alt = "리뷰 이미지";
      imageContainers[i].appendChild(img);
      imageContainers[i].style.display = "flex";
    } else {
      imageContainers[i].style.display = "none";
    }
  }
}

// recent-reviews__item - 평점 삽입하기
function setReviewScores() {
  const scoreElements = document.querySelectorAll(".recent-reviews__score");
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    scoreElements[i].textContent = `${reviewData[i].score.toFixed(1)}`;
  }
}

// recent-reviews__item - ID 삽입하기
function setReviewerIds() {
  const idElements = document.querySelectorAll(".recent-reviews__id");
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    const originalId = reviewData[i].id;
    const englishChars = originalId.replace(/[^a-zA-Z]/g, "");
    const limitedId = englishChars.substring(0, 8); // 영문 ID 최대 8글자 추출하기
    const paddedId = limitedId.padEnd(8, "x"); // 8글자보다 짧은 경우 'x'로 채워넣기
    const maskedId = paddedId.slice(0, 4) + "*".repeat(4); // 앞 4글자를 제외한 나머지 글자 마스킹하기
    idElements[i].textContent = maskedId;
  }
}

// recent-reviews__item - 방문일자 삽입하기
function setReservationDates() {
  const dateElements = document.querySelectorAll(
    ".recent-reviews__reservation-date"
  );
  const maxReviews = Math.min(3, reviewData.length);

  for (let i = 0; i < maxReviews; i++) {
    const rawDate = reviewData[i].reservation_date;
    const formattedDate = rawDate.replace(/-/g, ".") + " 방문";
    dateElements[i].textContent = formattedDate;
  }
}

function loadRecentReviewDatas() {
  fetchReviewDatas().then(() => {
    reviewData.sort(
      // 방문일자 기준으로 한줄평 정렬
      (a, b) => new Date(b.reservation_date) - new Date(a.reservation_date)
    );

    const recentReviews = reviewData.slice(0, 3); // 정렬된 한줄평 중 최근에 작성된 한줄평 3개 선택

    setAverageRating();
    setReviewCount();
    createReviewItems(recentReviews);
    setProductTitles(recentReviews);
    setReviewTexts(recentReviews);
    setReviewImages(recentReviews);
    setReviewScores(recentReviews);
    setReviewerIds(recentReviews);
    setReservationDates(recentReviews);
  });
}
