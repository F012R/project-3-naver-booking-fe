document.addEventListener("DOMContentLoaded", function () {
  loadComponent(
    "booking-summary",
    "components/booking-summary.html",
    initializeBookingTabs,
    filterBookingHistory
  );
  loadComponent("booking-history", "components/booking-history.html");
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

// booking-summary의 js
function initializeBookingTabs() {
  const tabs = document.querySelectorAll(".tab");

  if (!tabs.length) return;

  const firstTab = tabs[0];
  firstTab.classList.add("active");
  const firstTabImage = firstTab.querySelector(".tab-icon");
  firstTabImage.src = "/assets/images/all_calendar_green.png";

  tabs.forEach((tab) => {
    if (tab === firstTab) return;

    const tabImage = tab.querySelector(".tab-icon");
    const tabCategory = tab.getAttribute("data-tab");

    if (tabCategory === "전체") {
      tabImage.src = "/assets/images/all_calendar.png";
    } else if (tabCategory === "이용예정") {
      tabImage.src = "/assets/images/Planned_to_use.png";
    } else if (tabCategory === "이용완료") {
      tabImage.src = "/assets/images/use_complete.png";
    } else if (tabCategory === "취소·환불") {
      tabImage.src = "/assets/images/cancellation.png";
    }

    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        const tImage = t.querySelector(".tab-icon");

        if (t.getAttribute("data-tab") === "전체") {
          tImage.src = "/assets/images/all_calendar.png";
        } else if (t.getAttribute("data-tab") === "이용예정") {
          tImage.src = "/assets/images/Planned_to_use.png";
        } else if (t.getAttribute("data-tab") === "이용완료") {
          tImage.src = "/assets/images/use_complete.png";
        } else if (t.getAttribute("data-tab") === "취소·환불") {
          tImage.src = "/assets/images/cancellation.png";
        }
      });

      tab.classList.add("active");
      const clickedTabImage = tab.querySelector(".tab-icon");

      if (tabCategory === "전체") {
        clickedTabImage.src = "/assets/images/all_calendar_green.png";
      } else if (tabCategory === "이용예정") {
        clickedTabImage.src = "/assets/images/Planned_to_use_green.png";
      } else if (tabCategory === "이용완료") {
        clickedTabImage.src = "/assets/images/use_complete_green.png";
      } else if (tabCategory === "취소·환불") {
        clickedTabImage.src = "/assets/images/cancellation_green.png";
      }

      filterBookingHistory(tabCategory);
    });
  });
}

function filterBookingHistory(category) {
  const bookingItems = document.querySelectorAll(".booking-item");

  bookingItems.forEach((item) => {
    switch (category) {
      case "전체":
        item.style.display = "block";
        break;
      case "이용예정":
        item.style.display = item.classList.contains("upcoming")
          ? "block"
          : "none";
        break;
      case "이용완료":
        item.style.display = item.classList.contains("completed")
          ? "block"
          : "none";
        break;
      case "취소·환불":
        item.style.display = item.classList.contains("canceled")
          ? "block"
          : "none";
        break;
    }
  });
}
