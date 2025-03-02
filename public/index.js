document.addEventListener("DOMContentLoaded", function () {
  // 카테고리 컴포넌트 로드
  loadComponent("category", "../pages/main/category.html");

  function loadComponent(id, url, callback) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(id).innerHTML = data; 
        if (id === "category") initCategory(); 
        if(callback) callback();
      })
      .catch((error) => console.error(`${url} 로딩 중 오류 발생:`, error));
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
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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
        document.querySelector(".category-tabs .active")?.classList.remove("active");
        this.classList.add("active");

        currentCategory = this.getAttribute("data-category");
        fetchDataByCategory(currentCategory);
      });
    });

    fetchDataByCategory(currentCategory);
  }
});
