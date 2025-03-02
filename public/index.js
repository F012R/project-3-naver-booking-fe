document.addEventListener("DOMContentLoaded", function () {
  loadComponent(
    "promotion",
    "../pages/main/promotion.html",
    loadPromotionBanner
  );
  loadComponent("footer", "../pages/main/footer.html");
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
