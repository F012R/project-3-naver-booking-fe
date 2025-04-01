document.addEventListener("DOMContentLoaded", function () {
  loadComponent("booking-summary", "components/booking-summary.html");
  loadComponent("booking-history", "components/booking-history.html", function() {
    fetchReservationData();
  });
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

// 예약 내역을 가져오는 함수
function fetchReservationData() {
  fetch('../../assets/jsons/booking-history-dummy-data.json')  
    .then(response => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 정상적이지 않습니다.');
      }
      return response.json();
    })
    .then(data => {
      renderReservations(data);
    })
    .catch(error => {
      console.error('JSON 파일 로딩 중 오류 발생:', error);
    });
}

function renderReservations(data) {
  const bookingHistoryElement = document.querySelector('.booking-history .wrap_mylist .list_cards');
  bookingHistoryElement.innerHTML = "";
  data.forEach(item => {
    // 예약 상태가 취소된 경우 'card used cancel(취소된 예약)' 처리
    if (item.reservation_info.cancel_flag === 1) {
      const cancelledCardHTML = `
        <li class="card used cancel" data-id="${item.reservation_info.id}">
          <div class="link_booking_details">
            <div class="card_header">
              <div class="left"></div>
              <div class="middle">
                <div class="reservation-container_cancel">
                  <img src="../../../assets/images/reservation_cancel_icon.png" alt="취소된 예약 아이콘">
                  <span class="tit">취소된 예약</span>
                </div>
              </div>
              <div class="right"></div>
            </div>
          </div>
          <article class="card_item">
            <div class="card_body">
              <div class="left"></div>
              <div class="middle">
                <div class="card_detail">
                  <em class="booking_number">No.${item.reservation_info.id}</em>
                  <h4 class="tit">${item.product_description}</h4>
                  <ul class="detail">
                    <li class="item">
                      <span class="item_tit">일정</span>
                      <em class="item_dsc">${item.display_info.opening_hours}</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">내역</span>
                      <em class="item_dsc">내역이 없습니다.</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">장소</span>
                      <em class="item_dsc">${item.display_info.place_name}</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">업체</span>
                      <em class="item_dsc">업체명이 없습니다.</em>
                    </li>
                  </ul>
                  <div class="price_summary">
                    <span class="price_tit">결제 예정금액</span>
                    <em class="price_amount">
                      <span>${item.product_price}</span>
                      <span class="unit">원</span>
                    </em>
                  </div>
                </div>
              </div>
              <div class="right"></div>
            </div>
            <div class="card_footer">
              <div class="left"></div>
              <div class="middle"></div>
              <div class="right"></div>
            </div>
          </article>
        </li>
      `;
      
      // 취소된 예약 정보를 추가
      bookingHistoryElement.innerHTML += cancelledCardHTML;
    }
    // 예약 상태가 확정된 경우 'card confirmed' 처리
    else if (item.reservation_info.cancel_flag === 0) {
      const confirmedCardHTML = `
        <li class="card confirmed" data-id="${item.reservation_info.id}">
          <div class="link_booking_details">
            <div class="card_header">
              <div class="left"></div>
              <div class="middle">
                <div class="reservation-container">
                  <img src="../../../assets/images/reservation_icon.png" alt="예약확정 아이콘">
                  <span class="tit">예약 확정</span>
                </div>
              </div>
              <div class="right"></div>
            </div>
          </div>
          <article class="card_item">
            <div class="card_body">
              <div class="left"></div>
              <div class="middle">
                <div class="card_detail">
                  <em class="booking_number">No.${item.reservation_info.id}</em>
                  <h4 class="tit">${item.product_description}</h4>
                  <ul class="detail">
                    <li class="item">
                      <span class="item_tit">일정</span>
                      <em class="item_dsc">${item.display_info.opening_hours}</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">내역</span>
                      <em class="item_dsc">내역이 없습니다.</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">장소</span>
                      <em class="item_dsc">${item.display_info.place_name}</em>
                    </li>
                    <li class="item">
                      <span class="item_tit">업체</span>
                      <em class="item_dsc">업체명이 없습니다.</em>
                    </li>
                  </ul>
                  <div class="price_summary">
                    <span class="price_tit">결제 예정금액</span>
                    <em class="price_amount">
                      <span>${item.product_price}</span>
                      <span class="unit">원</span>
                    </em>
                  </div>
                  <div class="booking_cancel">
                    <button class="btn cancel-btn"><span>취소</span></button>
                  </div>
                </div>
              </div>
              <div class="right"></div>
            </div>
          </article>
        </li>
      `;
      
      // 확정된 예약 정보를 추가
      bookingHistoryElement.innerHTML += confirmedCardHTML;
    }
  });

  // '취소' 버튼 클릭 시 이벤트 처리
  const cancelButtons = document.querySelectorAll('.cancel-btn');
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const card = this.closest('li');
      const reservationId = card.getAttribute('data-id');
      
      // 해당 예약의 cancel_flag를 1로 변경
      const reservation = data.find(item => item.reservation_info.id == reservationId);
      reservation.reservation_info.cancel_flag = 1;

      // UI 변경 -> 추후 서버와 연동하여 실제 데이터 변경 필요
      card.classList.remove('confirmed');
      card.classList.add('used', 'cancel');
      card.querySelector('.tit').textContent = '취소된 예약';

      
    });
  });
}






