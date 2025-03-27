// 브라우저 콘솔에 붙여넣기만 하면 작동하는 즉시 실행 함수
(function() {
    // 이전 핸들러가 있으면 제거하는 함수
    function removeExistingHandlers() {
      if (window._elementInspectorActive) {
        document.removeEventListener('click', window._elementInspectorClickHandler, true);
        console.log('이전 요소 검사기를 제거했습니다.');
      }
    }
  
    // 기존 핸들러 제거
    removeExistingHandlers();
    
    // 클릭 이벤트 핸들러 함수
    window._elementInspectorClickHandler = function(event) {
      // 기본 동작 방지
      event.preventDefault();
      event.stopPropagation();
      
      const element = event.target;
      
      // 요소 스타일 잠시 강조
      const originalOutline = element.style.outline;
      element.style.outline = '2px solid red';
      
      console.log('%c---- 클릭한 요소 정보 ----', 'background: #222; color: #bada55; font-size: 16px;');
      console.log('요소:', element);
      console.log('태그 이름:', element.tagName);
      console.log('ID:', element.id || '(없음)');
      console.log('클래스:', element.className || '(없음)');
      console.log('텍스트 내용:', element.textContent.trim().substring(0, 50) + (element.textContent.length > 50 ? '...' : ''));
      
      console.log('스타일:');
      const computedStyle = window.getComputedStyle(element);
      console.log('  너비:', computedStyle.width);
      console.log('  높이:', computedStyle.height);
      console.log('  색상:', computedStyle.color);
      console.log('  배경색:', computedStyle.backgroundColor);
      
      console.log('속성:');
      Array.from(element.attributes).forEach(attr => {
        console.log(`  ${attr.name}: ${attr.value}`);
      });
      
      console.log('DOM 경로:');
      let path = [];
      let currentElement = element;
      while (currentElement && currentElement !== document.body) {
        let selector = currentElement.tagName.toLowerCase();
        if (currentElement.id) {
          selector += `#${currentElement.id}`;
        }
        path.unshift(selector);
        currentElement = currentElement.parentElement;
      }
      console.log('  ' + path.join(' > '));
      
      console.log('%c-------------------------', 'background: #222; color: #bada55; font-size: 16px;');
      
      // 잠시 후 강조 효과 제거
      setTimeout(() => {
        element.style.outline = originalOutline;
      }, 1500);
      
      return false;
    };
    
    // 캡처 단계에서 클릭 이벤트 리스너 등록 (이벤트 버블링보다 먼저 실행)
    document.addEventListener('click', window._elementInspectorClickHandler, true);
    
    // 활성화 상태 표시
    window._elementInspectorActive = true;
    
    // 사용 안내 메시지
    console.log('%c요소 검사기가 활성화되었습니다! 페이지의 아무 요소나 클릭하세요.', 
                'background: #4CAF50; color: white; font-size: 14px; padding: 5px;');
    console.log('검사기를 종료하려면 다음 명령어를 실행하세요: document.removeEventListener("click", window._elementInspectorClickHandler, true)');
    
  })();