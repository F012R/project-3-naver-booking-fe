document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html");
  loadComponent("description", "components/description.html");
  loadComponent("event", "components/event.html");
  loadComponent("booking", "components/booking.html");
  loadComponent("review", "components/review.html");
  loadComponent("detail", "components/detail.html", function () {
    initDetailTabs(); // 상세정보 로드 후 initDetailTabs 실행
    loadJsonData();   // JSON 데이터 로드
  });
  loadComponent("footer", "../main/footer.html");
});

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
        const storeAddr = document.querySelector('.store-addr-bold');
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

function loadComponent(id, url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); 
    })
    .catch((error) => console.error(`${url} 로딩 중 오류 발생:`, error));
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
