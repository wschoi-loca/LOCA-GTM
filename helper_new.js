function() {
    function sha512(message, callback) {
      try {
        // 텍스트를 ArrayBuffer로 변환
        var encoder = new TextEncoder();
        var data = encoder.encode(message);
        
        // SHA-512 해시 생성 (Promise 사용)
        crypto.subtle.digest('SHA-512', data).then(function(hashBuffer) {
          // ArrayBuffer를 16진수 문자열로 변환
          var hashArray = Array.prototype.slice.call(new Uint8Array(hashBuffer));
          var hashHex = hashArray.map(function(b) {
            return b.toString(16).padStart(2, '0');
          }).join('');
          
          // 콜백 함수로 결과 전달
          callback(null, hashHex);
        }).catch(function(error) {
          // 에러 발생 시 콜백으로 에러 전달
          callback(error);
        });
      } catch (error) {
        // 예외 처리
        callback(error);
      }
    }
    
    // 사용 예시
    sha512(window._gtm.user.cno, function(error, hash) {
      if (error) {
        console.error('Error generating SHA-512 hash:', error);
      } else {
        return hash
      }
    });
    
    }