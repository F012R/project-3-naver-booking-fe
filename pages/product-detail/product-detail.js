document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html", initializeTitleSlider);
  loadComponent("description", "components/description.html");
  loadComponent("event", "components/event.html");
  loadComponent("booking", "components/booking.html");
  loadComponent("review", "components/review.html");
  loadComponent("detail", "components/detail.html");
  loadComponent("footer", "../main/footer.html");
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

// title 영역 관련 처음 실행될 함수 
function initializeTitleSlider() {
  const sliderContainer = document.querySelector(".slider-container");
  const slider = document.querySelector(".slider");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const slideTitle = document.querySelector(".slide-title");
  const slideNumber = document.querySelector(".slide-number");

  // 임시 API 응답 데이터 (실제 API 연결 시 이 부분을 대체)
  const mockApiResponse = {
    success: true,
    data: [
      { type: "ma", src: "/assets/images/9_ma_25.png", title: "무민원화전" },
      { type: "et", src: "/assets/images/4_ma_12.png", title: "DESIGN EXPO" },
      // 기타 이미지가 여러 개 있더라도, 하나만 사용
    ],
  };

  let currentIndex = 0;
  let slideDataList = [];

  // API 호출 및 슬라이더 초기화 함수
  function fetchImagesAndInitializeSlider() {
    // 이곳에 실제 API 호출 (현재는 mock 데이터 사용)
    processImageData(mockApiResponse.data);
  }

  // 이미지 데이터 처리 및 슬라이더 초기화
  function processImageData(data) {
    // 메인 이미지 필터링
    const mainImageList = data.filter((image) => image.type === "ma");

    // 기타 이미지 필터링 (최대 1개만 사용)
    const extraImageList = data
      .filter((image) => image.type === "et")
      .slice(0, 1);

    // 메인 이미지와 기타 이미지 합치기
    slideDataList = [...mainImageList, ...extraImageList];

    // 기존 슬라이드 제거
    slider.innerHTML = "";

    // 새 슬라이드 추가
    slideDataList.forEach((slide, index) => {
      const imageElement = document.createElement("img");
      imageElement.src = slide.src;
      imageElement.classList.add("slide");
      imageElement.alt = slide.title || `슬라이드 ${index + 1}`;
      imageElement.style.transform = `translateX(${index * 100}%)`;
      slider.appendChild(imageElement);
    });

    // 슬라이드가 2개 이상이면 화살표와 슬라이드 번호 표시
    if (slideDataList.length > 1) {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
      slideNumber.style.display = "block";
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      slideNumber.style.display = "none";
    }

    // 초기 상태 설정
    currentIndex = 0;
    updateSlide();
  }

  // 슬라이드 업데이트 함수
  function updateSlide() {
    const slideElements = document.querySelectorAll(".slide");

    slideElements.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
    });

    // 슬라이드 타이틀 업데이트
    slideTitle.textContent =
      slideDataList[currentIndex].title || `${currentIndex + 1}번째 슬라이드`;

    // 슬라이드 번호 업데이트
    slideNumber.textContent = `${currentIndex + 1}/${slideElements.length}`;
  }

  // 이전 버튼 클릭 이벤트
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    } else {
      // 첫 번째 슬라이드에서 이전 버튼 클릭 시 마지막 슬라이드로
      currentIndex = slideDataList.length - 1;
      updateSlide();
    }
  });

  // 로그인 상태에 따른 이메일 표시
  function setupLoginStatusElement() {
    const userEmail = localStorage.getItem("userEmail");
    const emailElement = document.getElementById("user-email");

    if (emailElement) {
      emailElement.textContent = userEmail ? userEmail : "예약확인";
      emailElement.addEventListener("click", function () {
        window.location.href = userEmail ? "my-booking.html" : "login.html";
      });
    }
  }

  // 다음 버튼 클릭 이벤트
  nextBtn.addEventListener("click", () => {
    if (currentIndex < slideDataList.length - 1) {
      currentIndex++;
      updateSlide();
    } else {
      // 마지막 슬라이드에서 다음 버튼 클릭 시 첫 번째 슬라이드로
      currentIndex = 0;
      updateSlide();
    }
  });

  // 터치 스와이프 이벤트 처리
  let startX = 0;
  sliderContainer.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  sliderContainer.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50 && slideDataList.length > 1) {
      // 좌측으로 스와이프 (다음 슬라이드)
      if (diffX > 0) {
        if (currentIndex < slideDataList.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
      }
      // 우측으로 스와이프 (이전 슬라이드)
      else {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = slideDataList.length - 1;
        }
      }
      updateSlide();
    }
  });

  // 초기화 실행
  fetchImagesAndInitializeSlider();

  // 로그인 상태 설정 함수 호출
  setupLoginStatusElement();
}
