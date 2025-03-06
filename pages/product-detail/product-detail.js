document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html");
  loadComponent("description", "components/description.html");
  loadComponent("event", "components/event.html", loadEventInfo);
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

function loadEventInfo() {
  // 이벤트 정보란
  const currentProductId = 3;  

  (async()  => {
    var productPriceData = await getJsonByUrl("../../assets/jsons/product_price.json");
    productPriceData = filterJsonByKey(productPriceData, "productId", currentProductId);
    var eventInfoText = makeEventInfo(productPriceData);
    document.querySelector(".event-detail-content").innerHTML = eventInfoText;
  }) ();
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

function filterJsonByKey(jsonData, key, value) {
  return jsonData.filter(data => data[key] === value);
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
    result += (typeNameMap[element.priceTypeName] + rate + "%, ");
  });

  if (status) {   // 가격 정보 중 하나라도 할인하는 것이 있으면 
    result = result.slice(0, -2);  // ", " 제거
    result += " 할인";
  } else {
    result = "할인 정보가 없습니다.";
  }
  return result;
}