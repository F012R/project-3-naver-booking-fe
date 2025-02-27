// product.html 불러오기 
document.addEventListener("DOMContentLoaded", function() {
    fetch('../pages/main/product.html')
    .then(response => response.text())
    .then(data => {
      const productElement = document.getElementById('product');
      productElement.innerHTML = data;
  
      // 삽입된 HTML에서 <script> 태그 찾아 실행하기
      const scripts = productElement.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.type === "text/template") {    // script 중 type="text/template"은 무시 
            return;
        }
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;        
        document.body.appendChild(newScript); // body에 추가하면 실행됨     
      });
    });
});

