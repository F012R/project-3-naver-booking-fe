document.addEventListener("DOMContentLoaded", function () {
  loadComponent("header", "/pages/main/header.html", setupLoginStatusElement);
  loadComponent("promotion", "/pages/main/promotion.html", loadPromotionBanner);
  loadComponent("category", "/pages/main/category.html", initCategory);
  loadComponent("footer", "/pages/main/footer.html");
  loadComponent("product", "/pages/main/product.html", initProductSection);
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

function initProductSection() {
  // product 영역 관련 처음 실행될 함수.
  var eventTab = document.querySelector(".event-tab");
  var moreButton = document.querySelector(".btn-more");
  const MORE_NUM = 4; // more 버튼을 누를 때 추가되는 개수

  // "전체" 카테고리로 데이터 만든 후 보여줌
  productData.initDataAndShowFirst(eventTab);

  // 더보기 버튼을 누르면
  moreButton.addEventListener("click", function () {
    const tab = moreButton.closest(".event-tab");
    var loadedDataNum = tab.querySelectorAll("article").length;
    var isCountUnder = productData.showData(
      loadedDataNum,
      loadedDataNum + MORE_NUM,
      tab
    );

    // 추가로 보여줄 데이터가 없으면 더보기 버튼은 사라짐
    if (!isCountUnder) {
      moreButton.style.display = "none";
    }
  });
}

// 카테고리에 맞는 productData (기본: 0)
var productData = {
  dataList: {},
  categoryId: 0,
  loadedDataCount: 0,
  initDataAndShowFirst: async function (targetElement) {
    // data만들어짐 / targetElement에 4개 보여짐
    await productData.initData();
    var status = productData.showData(0, 4, targetElement);
    if (!status) {
      const addButton = targetElement.querySelector(".btn-more");
      addButton.style.display = "none";
    }
  },
  initData: async function () {
    // 현재 categoryId에 맞게 this.dataList가 만들어짐
    let data = await getProductData("../../assets/jsons/product.json");
    // json: {id: 1, categoryId: 1, description: "title", content: "설명",  placeName: "장소"}
    this.dataList = this.filteringById(data, this.categoryId);
    await this.addImgUrlToDataList();
  },
  addImgUrlToDataList: async function () {
    // dataList에 imgUrl 추가하기
    var imgUrlList = await getProductData(
      "../assets/jsons/product_img_url.json"
    );
    // json: {id: 1, productId: 1, productImageUrl: "파일명(ex. 1_th_1.png)"}
    imgUrlList.forEach((element) => {
      var productId = element.productId;
      for (var i = 0, len = this.dataList.length; i < len; i++) {
        if (productId === this.dataList[i].id) {
          this.dataList[i].imgUrl = element.productImageUrl;
          break;
        }
      }
    });
  },
  // 현재 선택한 category에 맞게 json filter
  filteringById: function (jsonData, categoryId) {
    if (categoryId === 0) {
      // 0: 전체 선택한 경우
      return jsonData;
    }
    return jsonData.filter((data) => data["categoryId"] === categoryId);
  },
  setCategoryId: function (id) {
    this.categoryId = id;
  },
  showData: function (startIndex, lastIndex, targetElement) {
    // startIndex ~ lastIndex-1 까지 targetElement에 추가
    var isUnder = true;
    if (lastIndex > this.dataList.length) {
      // lastIndex가 데이터길이를 초과하면 false, 아니면 ture return
      isUnder = false;
      lastIndex = this.dataList.length;
    }

    const leftContaier = targetElement.querySelector(".left-container");
    const rightContainer = targetElement.querySelector(".right-container");
    for (let i = startIndex; i < lastIndex; i++) {
      if (i % 2 == 0) {
        leftContaier.innerHTML += this.makeProductListTemplate(
          this.dataList[i]
        );
      } else {
        rightContainer.innerHTML += this.makeProductListTemplate(
          this.dataList[i]
        );
      }
    }

    return isUnder;
  },
  // 템플릿에 데이터를 넣어 반환
  makeProductListTemplate: function (data) {
    var html = document.querySelector(".template-item-list").innerHTML;
    var resultHTML = html
      .replaceAll("${id}", data.id)
      .replace("${imgUrl}", "../assets/images/" + data.imgUrl)
      .replaceAll("${description}", data.description)
      .replace("${content}", data.content)
      .replace("${placeName}", data.placeName);
    return resultHTML;
  },
};

// json 데이터를 가져오는 함수
async function getProductData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("데이터 가져오기 실패");
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// 다른 카테고리를 선택하면 product 영역 변화
function changeCategory(categoryId, targetElement) {
  // 기존의 상품 목록 지우기
  targetElement.querySelector(".left-container").innerHTML = "";
  targetElement.querySelector(".right-container").innerHTML = "";

  // 카테고리 바꾸기 : 데이터 바꾸고, 상품 4개 보이게 하기
  productData.setCategoryId(categoryId);
  productData.initDataAndShowFirst(targetElement);
}

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

function loadPromotionBanner() {
  const bannerContainer = document.querySelector(".promotion-banner");
  const slider = bannerContainer.querySelector(".slider");
  const images = slider.querySelectorAll(".slide-item");
  let currentImageIndex = 0;

  /*
  // (예정) 프로모션 이미지 불러오기 후 li 태그, img 태그, alt 속성 삽입하기
  function loadPromotionBanner() {
    fetch('/api/promotions')
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          const slider = document.querySelector(".promotion-banner");
          result.data.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'slide-item';
            const img = document.createElement('img');
            img.src = item.productImageUrl;
            img.alt = `프로모션 이미지 ${item.id}`;
            li.appendChild(img);
            slider.appendChild(li);
          });
          startBannerAnimation(slider, slider.querySelectorAll('.slide-item'), 0);
        } else {
          throw new Error(result.message);
        }
      })
      .catch(error => {
        console.error('프로모션 데이터 로딩 중 오류 발생:', error);
      });
  }
  */

  startBannerAnimation(slider, images, currentImageIndex);
}

function startBannerAnimation(slider, images, currentImageIndex) {
  function moveToNextSlide() {
    currentImageIndex++;
    if (currentImageIndex >= images.length - 1) {
      resetSliderPosition();
    } else {
      updateSliderPosition();
    }
  }

  function resetSliderPosition() {
    currentImageIndex = 0;
    slider.style.transition = "none";
    slider.style.transform = "translateX(0)";
    setTimeout(() => {
      slider.style.transition = "transform 0.5s ease";
    }, 50);
  }

  function updateSliderPosition() {
    slider.style.transform = `translateX(-${currentImageIndex * 50}%)`;
  }

  setInterval(moveToNextSlide, 3000);
}

// 카테고리 관련 초기화 함수
function initCategory() {
  const categoryTabs = document.querySelectorAll(".category-tabs li");
  const itemCountSpan = document.querySelector(".item-count span");

  let currentCategory = "all";

  // 데이터 가져오는 함수
  function fetchDataByCategory(category) {
    fetch(`/api/data?category=${category}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        itemCountSpan.innerHTML = `${data.items.length}개`;
      })
      .catch((error) => console.error("아이템 로딩 실패:", error));
  }

  // 카테고리 탭 클릭 이벤트
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelector(".category-tabs .active")
        ?.classList.remove("active");
      this.classList.add("active");

      currentCategory = this.getAttribute("data-category");
      fetchDataByCategory(currentCategory);
    });
  });

  fetchDataByCategory(currentCategory);
}
