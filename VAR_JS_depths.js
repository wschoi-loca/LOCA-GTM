function () {
      var contentView = {{Page URL}};
      var contentViewName = {{content-view-name}};

      // content-view에서 프로토콜과 도메인 제거
      var contentViewPath = contentView.replace(/^https?:\/\/[^/]+/, '');
    
      // content-view를 / 기준으로 나누기
      var contentViewParts = contentViewPath.split('/').filter(Boolean);
    
      // content-view-name의 시작 인덱스를 찾기 (findIndex 대신 for 문 사용)
      var startIdx = -1;
      for (var i = 0; i < contentViewParts.length; i++) {
        if (contentViewName.indexOf(contentViewParts[i]) === 0) {
          startIdx = i;
          break;
        }
      }
    
      // 찾은 인덱스에서부터 depth 추출
      if (startIdx !== -1) {
        var depthParts = contentViewParts.slice(startIdx);
        if (depthParts.length >= 4) {
          var depth1 = depthParts[0];
          var depth2 = depthParts[1];
          var depth3 = depthParts[2];
          var depth4 = depthParts[3];
          var depth5 = depthParts.slice(4).join('-');
        
          var depths = {
            "1depth": depth1,
            "2depth": depth2,
            "3depth": depth3,
            "4depth": depth4,
            "5depth": depth5
          };
          return depths
        }
      }
      return null;
    
}