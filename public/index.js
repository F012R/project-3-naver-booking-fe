document.addEventListener("DOMContentLoaded", function () {
    const categoryContainer = document.querySelector("#category"); // id로 요소 찾기

    // category.html 로드 함수
    function loadCategoryHTML() {
        fetch('/pages/main/category.html')  
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                categoryContainer.innerHTML = html; // #category에 category.html 삽입
                initCategory(); // 카테고리 관련 초기화 함수 호출
            })
            .catch(error => console.error("category.html 로딩 실패:", error));
    }

    // 카테고리 관련 초기화 함수
    function initCategory() {
        const categoryTabs = document.querySelectorAll(".category-tabs li"); 
        const itemCountSpan = document.querySelector(".item-count span"); 

        let currentCategory = "all"; 

        // 데이터 가져오는 함수
        function fetchDataByCategory(category) {
            fetch(`http://localhost:3000/api/data?category=${category}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    itemCountSpan.innerHTML = `${data.items.length}개`;
                })
                .catch(error => console.error("아이템 로딩 실패:", error));
        }

        // 카테고리 탭 클릭 이벤트
        categoryTabs.forEach(tab => {
            tab.addEventListener("click", function () {
                document.querySelector(".category-tabs .active")?.classList.remove("active");
                this.classList.add("active");

                currentCategory = this.getAttribute("data-category");
                fetchDataByCategory(currentCategory);
            });
        });

        fetchDataByCategory(currentCategory);
    }

    loadCategoryHTML();
});
