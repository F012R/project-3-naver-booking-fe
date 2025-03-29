document.addEventListener("DOMContentLoaded", function () {
  loadComponent("product-info", "components/product-info.html");
  loadComponent("reservation-form", "components/reservation-form.html", initProductForm);
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

// reservation-from 시작

// 한 Ticket 타입 정보
function Ticket(priceTypeName, price, discountRate) {
  this.price = price;
  this.typeName = priceTypeName;
  this.discountRate = discountRate; // 할인율
  this.ticketNum = 0; // 사용자가 지정한 티켓 수
}
// 프로토타입 메서드
Ticket.prototype = {
  getTicketNum() {
    return this.ticketNum;
  },
  getPrice() {
    return this.price;
  },
  updateTicketNum(diff) {
    // diff 만큼 티켓 수가 변함
    this.ticketNum += diff;
    if (this.ticketNum < 0) {
      this.ticketNum = 0;
      return false;
    }
    return true;
  },
};

// Ticket 객체 모아두기
const ticketList = [];
const ticketListObj = {
  tickets: ticketList,
  sumTicketCount() {
    var sum = 0;
    this.tickets.forEach((element) => {
      sum += element.getTicketNum();
    });
  },
  isValid() {
    tickets.forEach((element) => {
      if (element.getTicketNum() > 0) {
        return true;
      }
    });
    return false;
  },
};

// 티켓 정보 불러와 초기화하기
function initProductForm() {
  const currentProductId = 3; // 임의로 현재 productId 줌.

  (async () => {
    var productPriceData = await getProductPriceJson(currentProductId);
    productPriceData.forEach((element) => {
      ticketList.push(new Ticket(element.priceTypeName, element.price, element.discountRate));
      var eventInfoText = makeTicketInfo(element, productPriceData.indexOf(element));
      document.querySelector(".ticket-count").innerHTML += eventInfoText;
    });
  })();

  var foldingBtn = document.querySelectorAll(".folding-btn");
  foldingBtn.forEach((element) => {
    element.addEventListener("click", function (evt) {
      tosContainer = evt.target.closest(".single-tos-container");
      tosDesc = tosContainer.querySelector(".tos-description");
      tosDesc.classList.add("hidden");
      tosContainer.querySelector(".unfolding-btn").classList.remove("hidden");
      evt.target.classList.add("hidden");
      console.log(evt.target);
    });
  });

  var foldingBtn = document.querySelectorAll(".unfolding-btn");
  foldingBtn.forEach((element) => {
    element.addEventListener("click", function (evt) {
      console.log("unfolding");
      tosContainer = evt.target.closest(".single-tos-container");
      tosDesc = tosContainer.querySelector(".tos-description");
      tosDesc.classList.remove("hidden");
      tosContainer.querySelector(".folding-btn").classList.remove("hidden");
      evt.target.classList.add("hidden");
      console.log(evt.target);
    });
  });
}

// ticket 정보를 담는 영역 HTML 만들기
function makeTicketInfo(data, index) {
  const typeNameMap = {
    // priceTypeName의 의미
    A: "성인",
    B: "유아",
    Y: "청소년",
    S: "세트",
    D: "장애인",
    C: "지역주민",
    E: "얼리버드",
    V: "V석",
    R: "R석",
    S: "S석",
    D: "평일",
  };

  var rate = parseInt(data.discountRate);
  var notDef = "미정";
  let result = `
      <li class="single-ticket-type">
        <div class="ticket-info">
          <div class="ticket-type-name">${typeNameMap[data.priceTypeName] || notDef} </div>
          <div class="ticket-type-price">${data.price.toLocaleString("ko-KR")}원</div>
          <div class="ticket-discount-info">${data.price.toLocaleString("ko-KR")}원 ${
    rate > 0 ? `(${rate}% 할인가)` : ""
  }</div>
        </div>
        <div class="right-ticket-controll">
          <div class="ticket-price-controll">
            <button class="minus-btn" onclick="minus(evt, this, ${index})" disabled></button>
            <input type="tel" class="ticket-type-num" value="0" name="${data.priceTypeName}TypeTicketNum" readonly/>
            <button class="plus-btn" onclick="plus(evt, this, ${index})"></button>
          </div>
          <div><span class="type-sum-price">0</span>원</div>
        </div>
      </li>
      `;

  return result;
}

// price 데이터를 가져오는 함수
async function getProductPriceJson(value) {
  try {
    const response = await fetch("/assets/jsons/product_price.json");
    if (!response.ok) throw new Error("데이터 가져오기 실패");
    var jsonData = await response.json();
    return jsonData.filter((data) => data["productId"] === value);
    // return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function minus(evt, targetElement, index) {
  evt.preventDefault();
  ticketList[index].updateTicketNum(-1); // 버튼을 누른 ticket의 티켓 수 감소

  var sumPriceElement = targetElement.closest(".single-ticket-type").querySelector(".type-sum-price");
  var sumPrice = ticketList[index].getTicketNum() * ticketList[index].price;
  sumPriceElement.innerText = sumPrice.toLocaleString("ko-KR"); // 티켓 금액 합산 수정
  updateSumTicketCount(); // 모든 타입의 티켓 금액 합산 업데이트

  var parentElement = targetElement.closest(".ticket-price-controll");
  var ticketNum = parentElement.querySelector(".ticket-type-num");
  ticketNum.value = ticketList[index].getTicketNum(); // 티켓 수 업데이트 : 1 감소

  if (ticketNum.value === "0") {
    // 티켓 수가 0이면 마이너스 버튼 비활성화 및 버튼 색 변경
    parentElement.querySelector(".minus-btn").disabled = true;
    parentElement.querySelector(".minus-btn").classList.remove("active-minus-btn");
    parentElement.querySelector(".ticket-type-num").classList.remove("active-minus-btn");
  }
}

function plus(evt, targetElement, index) {
  evt.preventDefault();
  ticketList[index].updateTicketNum(1);
  var sumPriceElement = targetElement.closest(".single-ticket-type").querySelector(".type-sum-price");
  var sumPrice = ticketList[index].getTicketNum() * ticketList[index].price;

  sumPriceElement.innerText = sumPrice.toLocaleString("ko-KR");

  updateSumTicketCount();

  var parentElement = targetElement.closest(".ticket-price-controll");
  var ticketNum = parentElement.querySelector(".ticket-type-num");
  ticketNum.value = ticketList[index].getTicketNum();

  // plus 버튼 클릭 -> 티켓 수가 1 이상-> minus-btm 활성화 및 색 변화
  parentElement.querySelector(".minus-btn").disabled = false;
  parentElement.querySelector(".minus-btn").classList.add("active-minus-btn");
  parentElement.querySelector(".ticket-type-num").classList.add("active-minus-btn");

  // console.log("pllus");
}

function updateSumTicketCount() {
  var sumCount;
  sumCount = 0;
  ticketList.forEach((e) => {
    sumCount += e.getTicketNum();
  });

  var target = document.querySelector(".total-ticket-count");
  target.innerText = sumCount;
}
