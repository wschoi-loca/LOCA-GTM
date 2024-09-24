function addGtmClickEvent() {
    // 모든 요소를 순회
    document.querySelectorAll('[data-gtm-click]').forEach(function(element) {
        // 클릭 이벤트 리스너 추가
        element.addEventListener('click', function(ev) {
            // 데이터 레이어에 값 푸시
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'gtm.click',
                'gtm.element': ev.target
            });
        });
    });
}

// 함수 실행
addGtmClickEvent();