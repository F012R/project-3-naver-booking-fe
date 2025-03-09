document.addEventListener("DOMContentLoaded", function () {
  loadComponent("title", "components/title.html");
  loadComponent("description", "components/description.html", setupProductDescription);
  loadComponent("event", "components/event.html");
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
