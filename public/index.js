document.addEventListener("DOMContentLoaded", function () {
  loadPromotionComponent()
    .then(() => {
      try {
        loadPromotionBanner();
      } catch (error) {
        console.error("프로모션 배너 로딩 중 오류 발생:", error);
      }
    })
    .catch((error) => console.error("프로모션 HTML 로딩 중 오류 발생:", error));
});

function loadPromotionComponent() {
  return fetch("../pages/main/promotion.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("promotion").innerHTML = data;
    });
}

function loadPromotionBanner() {
  const bannerContainer = document.querySelector(".promotion-banner");
  const slider = bannerContainer.querySelector(".slider");
  const image = slider.querySelectorAll(".slide-item");
  let currentImageIndex = 0;

  startBannerAnimation(slider, image, currentImageIndex);
}

function startBannerAnimation(slider, image, currentImageIndex) {
  function moveToNextSlide() {
    currentImageIndex++;
    if (currentImageIndex >= image.length - 1) {
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
