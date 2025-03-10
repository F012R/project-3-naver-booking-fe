document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html", initializeTitleSlider);
  loadComponent("description", "components/description.html", setupProductDescription);
  loadComponent("event", "components/event.html", loadEventInfo);
  loadComponent("booking", "components/booking.html");
  loadComponent("recent-review", "components/recent-review.html", loadRecentReviewDatas);
  loadComponent("detail", "components/detail.html", function () {
    initDetailTabs(); // 상세정보 로드 후 initDetailTabs 실행
    loadJsonData();   // JSON 데이터 로드
  });
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

function loadEventInfo() {
  // 이벤트 정보란
  const currentProductId = 3;  // 임의로 현재 productId 줌. 

  (async()  => {  
    var productPriceData = await getJsonByUrl("../../assets/jsons/product_price.json");
    productPriceData = filterJsonByKey(productPriceData, "productId", currentProductId);
    var eventInfoText = makeEventInfo(productPriceData);
    document.querySelector(".event-detail-content").innerHTML = eventInfoText;
  }) ();
}

// 상품 설명 펼쳐보기 초기화 
function setupProductDescription() {  
  const currentProductId = 5;

  (async() => {
      var currentProductData = await getJsonByUrl("/assets/jsons/detail_description.json"); // data 중 content에 줄바꿈이 있어 이를 '\\n'으로 대체해 json파일을 만듦 
      currentProductData = filterJsonByKey(currentProductData, "id", currentProductId);
      
      var descriptionHTML = currentProductData[0].content;
      descriptionHTML = descriptionHTML.replace(/\\n/g, '<br>');  
      var descriptioinPreviewArray = descriptionHTML.split("<br>");      

      document.querySelector(".description-preview").innerHTML = descriptioinPreviewArray[0] + "<br>" + descriptioinPreviewArray[1];   // preview 영역은 2줄 들어감 (data.content 기준, \n로 구분)
      document.querySelector(".description-full").innerHTML = descriptionHTML;   
  }) ();

  var twoBtn = document.querySelectorAll(".description-container button");
  twoBtn.forEach (el => {
    el.addEventListener("click", function() {   
      // 클래스에 hidden 을 추가/삭제 -> display: none style을 적용시키거나 없앰 
      document.querySelector('.preview-container').classList.toggle('hidden');
      document.querySelector('.full-container').classList.toggle('hidden');
    });
  });
}

function makeEventInfo(data) {
  const typeNameMap = { // priceTypeName의 의미  
    "A": "성인", 
    "B": "유아",
    "Y": "청소년", 
    "S": "세트",
    "D": "장애인",
    "C": "지역주민",
    "E": "얼리버드",
    "V": "V석", 
    "R": "R석", 
    "S": "S석", 
    "D": "평일",
  }

  var result = "[네이버 예약 특별할인]<br>";

  var status = false; 
  data.forEach(element => {
    var rate = parseInt(element.discountRate);
    if (rate === 0) {   // 할인율이 0%이면 표기하지 않는다 
        return;
    }
    status = true;
    result += (`${typeNameMap[element.priceTypeName]} ${rate}%, `);
  });

  if (status) {   // 가격 정보 중 하나라도 할인하는 것이 있으면 
    result = result.slice(0, -2);  // ", " 제거
    result += " 할인";
  } else {
    result = "할인 정보가 없습니다.";
  }
  return result;
}

// json 데이터를 가져오는 함수 
async function getJsonByUrl(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) 
          throw new Error('데이터 가져오기 실패');
      return await response.json();
  } catch (error) {
      console.error('Error:', error);
      return [];
  }
}
    
// jsondata 중 key 값이 value인 data를 반환  
function filterJsonByKey(jsonData, key, value) {
    return jsonData.filter(data => data[key] === value);
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
    const limitedId = originalId.substring(0, 8); // ID 최대 8글자 추출하기
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
    createReviewItems();
    setProductTitles();
    setReviewTexts();
    setReviewImages();
    setReviewScores();
    setReviewerIds();
    setReservationDates();

// ▶ title
// title 영역 관련 처음 실행될 함수 
function initializeTitleSlider() {
  const sliderContainer = document.querySelector(".slider-container");
  const slider = document.querySelector(".slider");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const slideTitle = document.querySelector(".slide-title");
  const slideNumber = document.querySelector(".slide-number");
  const logo = document.querySelector(".logo");

  // 로고 클릭 시 메인 페이지로 이동
  if (logo) {
    logo.addEventListener("click", function () {
      window.location.href = "../../public/index.html"; 
    });
  }

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

function loadJsonData() {
  // detail.json, mapImg.json, detailmap.json 파일을 병렬로 로드
  Promise.all([
    fetch('../../assets/jsons/detail.json').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }),
    fetch('../../assets/jsons/mapImg.json').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }),
    fetch('../../assets/jsons/detailmap.json').then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
  ])
    .then(([detailData, mapImgData, detailMapData]) => {
      const detailId = 1; // 예시로 id = 1을 사용 (추후 동적으로 변경 필요)
      const detailItem = detailData.find(item => item.id === detailId);
      const mapImgItem = mapImgData.find(item => item.id === detailId);
      const detailMapItem = detailMapData.find(item => item.id === detailId);

      // detail.json 데이터 처리
      if (detailItem) {
        const storeName = document.querySelector('.store-name');
        const contentElement = document.querySelector('.in-dsc');
        if (contentElement) {
          contentElement.textContent = detailItem.content || '';
        } else {
          console.warn('.in-dsc 요소를 찾을 수 없습니다.');
        }
        if (storeName) {
          storeName.textContent = detailItem.description || '';  // description(전시명)
        }
      }

      // mapImg.json 데이터 처리
      if (mapImgItem) {
        const storeMap = document.querySelector('.store-map');
        if (storeMap) {
          const mapImgUrl = mapImgItem.filename ? `../../assets/img_map/${mapImgItem.filename}` : ''; // 이미지 파일 경로
          storeMap.setAttribute('src', mapImgUrl);  // 지도 이미지 설정
        }
      }

      // detailmap.json 데이터 처리
      if (detailMapItem) {
        const storeAddr = document.querySelector('.location-container span');
        const storeAddrOld = document.querySelector('.store-addr .addr-old-detail');
        const storeTel = document.querySelector('.lst-store-info .item .item-lt span');

        // 도로명 주소 설정
        if (storeAddr) {
          storeAddr.textContent = detailMapItem.place_street || '';  // place_street(도로명 주소)
        }

        // 지번 주소 설정
        if (storeAddrOld) {
          storeAddrOld.textContent = detailMapItem.place_lot || '';  // place_lot(지번 주소)
        }

        // 전화번호 설정
        if (storeTel) {
          storeTel.textContent = detailMapItem.tel || '';  // tel(전화번호)
        }
      }
    })
    .catch(error => {
      console.error('JSON 파일 로드 실패:', error);
    });
}

function initDetailTabs() {
  const tabs = document.querySelectorAll(".info-tab-lst .anchor");
  const detailArea = document.querySelector(".detail-area-wrap");
  const locationArea = document.querySelector(".detail-location");

  if (!tabs || !detailArea || !locationArea) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", function (event) {
      event.preventDefault();
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      // 탭 클릭에 따라 영역 전환
      detailArea.classList.toggle("active", this.parentElement.classList.contains("_detail"));
      locationArea.classList.toggle("active", this.parentElement.classList.contains("_path"));
    });
  });
}
