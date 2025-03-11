data-gtm-section data-gtm-body={ label3: "반띵" }
    data-gtm-section data-gtm-body={ label2: "카드값반띵" } data-gtm-section-find-continue
        data-gtm-section data-gtm-body={ label1: "내카드반띵" } data-gtm-section-find-continue
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "내카드반띵배너1" }   // [최종 조합 데이터] label1: “내카드반띵” / label2 : “카드값반띵” / label3: “반띵” / label: “내카드반띵배너1”
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "내카드반띵배너2" }   // [최종 조합 데이터] label1: “내카드반띵” / label2 : “카드값반띵” / label3: “반띵” / label: “내카드반띵배너2”
        data-gtm-section data-gtm-body={ label1: "다른카드반띵" } data-gtm-section-find-continue
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "다른카드반띵배너1" } // [최종 조합 데이터] label1: “다른카드반띵” / label2 : “카드값반띵” / label3: “반띵” / label: “다른카드반띵배너1”
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "내카드반띵배너2" }  // [최종 조합 데이터] label1: “다른카드반띵” / label2 : “카드값반띵” / label3: “반띵” / label: “다른카드반띵배너2” 
    data-gtm-section data-gtm-body={ label2: "생활반띵" } data-gtm-section-find-continue
        data-gtm-section data-gtm-body={ label1: "교통비반띵" } data-gtm-section-find-continue
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "교통비반띵배너1" } // [최종 조합 데이터] label1: “교통비반띵” / label2 : “생활반띵” / label3: “반띵” / label: “교통비반띵배너1”
            data-gtm-visibility data-gtm-click data-gtm-body={ label: "교통비반띵배너2" } // [최종 조합 데이터] label1: “교통비반띵” / label2 : “생활반띵” / label3: “반띵” / label: “교통비반띵배너2”
        data-gtm-section data-gtm-body={ label1: "점심값반띵" } data-gtm-section-find-continue
            data-gtm-click data-gtm-body={ label: "점심값반띵배너1" } // [최종 조합 데이터] label1: “점심값반띵” / label2 : “생활반띵” / label3: “반띵” / label: “점심값반띵배너1”
            data-gtm-click data-gtm-body={ label: "점심값반띵배너2" } // [최종 조합 데이터] label1: “점심값반띵” / label2 : “생활반띵” / label3: “반띵” / label: “점심값반띵배너2”

위와 같이 attribute 가 들어가 있는 경우, 해당 attribute를 찾아서 조합하여 최종 데이터를 만들어야 한다.



      // Helper function to get and parse dataset gtmBody
      getGtmBodyData_v3: function (element, eventType) {
        try {
          if (!element) return null;

          var data = {};
          var isEcommerceEvent = ['view-item-list', 'select-item', 'view-item', 'add-to-cart', 'begin-checkout', 'purchase', 'refund', 'etc', 'select-item2'].includes(eventType);
  
          // Check if the event is an eCommerce event
          if (isEcommerceEvent) {
            var ecData;
            // If it is an eCommerce event and not 'etc' or 'select-item2'
            if (element.dataset.gtmEcommerce) {
              ecData = JSON.parse(element.dataset.gtmEcommerce);
            }
            data = Object.assign({}, ecData);

          } else if (element.dataset.gtmBody) {
            // Handle non-eCommerce events that have gtmBody data
            data = JSON.parse(element.dataset.gtmBody);
          } else {
            data = null;
          }
          return utils.deepCopy(data);  // Return deep copy of the combined data

        } catch (error) {
          dataLayer4.push({
            event: 'error_gtmBody',
            error_message: 'getGtmBodyData: ' + error.message,
            page_path: window.location.pathname
          });
          return null;
        }
      }.bind(utils),

    // 헬퍼 함수: handleEvent_v3 섹션 데이터 가져오기
    getSectionParams: function(element) {
    var sectionElement = element.closest('[data-gtm-section]');
    return sectionElement ? utils.getGtmBodyData_v3(sectionElement) || {} : {};
    },


    위 두함수는 data-gtm-body data-gtm-section 을 한개만 있을 경우의 함수인데 
    위 attribute 예시와 같이 data-gtm-section 이 여러개 일때 data-gtm-section-find-continue attribute 가 있으면 closest 로 data-gtm-section 찾고 해당 요소에서 또 data-gtm-section-find-continue attribute 가 있으면 상위  data-gtm-section 찾아서 
    최상위 data-gtm-section 까지 data-gtm-body 데이터를 가져오는 함수로 바꿔야 한다.