<script>
(function () {
    // 앱 구분자 설정
    var browserInfo = navigator.userAgent;
    var isGAAndroid = browserInfo.indexOf('GA_Android') > -1;
    var isGAIOS = browserInfo.indexOf('GA_iOS_WK') > -1;
    var commonGAData = {};

    // 앱으로 데이터 전달 함수
    var utils = {
        // GAHybrid 데이터 전송 함수
        sendGAHybrid: function (object) {
          try {
            var GAData;
            if (object.event_name == 'screen_view') {
              GAData = Object.assign({}, object);
              console.log('::Final-sendGAHybrid::');
              console.log(GAData);
            } else {
              var eventParams = Object.assign({}, commonGAData.eventParams, object.eventParams);
              var userProperties = Object.assign({}, commonGAData.userProperties, object.userProperties);
              delete object.eventParams;
              delete object.userProperties;
              GAData = Object.assign({}, object, { screen_name: object.screen_name, location: object.location, eventParams: eventParams, userProperties: userProperties });
            }
      
            console.log('::Final-sendGAHybrid::');
            console.log(GAData);
            isGAAndroid ? window.lotteCardgascriptAndroid.GAHybrid(JSON.stringify(GAData)) : webkit.messageHandlers.lotteCardgascriptCallbackHandler.postMessage(JSON.stringify(GAData));
          } catch (e) {
            console.log('sendGAHybrid 함수 ERROR');
            console.log(e.message);
          }
        },
      
        // 값 정리 및 제한 함수
        removeEmptyElement: function (inputValues) {
          var returnValue = {};
      
          for (var key in inputValues) {
            var value = inputValues[key];
      
            if (value !== '' && value !== null && value !== undefined && value !== 'undefined' && value !== 'null') {
              if (typeof value === 'string') {
                value = value.replace(/\\n/g, ' ').substring(0, 500);
              }
              returnValue[key] = value;
            }
          }
      
          return returnValue;
        },
      
        // 스크린뷰 전송 함수
        sendGAPage: function (object) {
          try {
            commonGAData = Object.assign({}, object);
            console.log('::sendGAPage::')
            console.log(object)
            if (isGAAndroid || isGAIOS) {
              object.event_name = 'screen_view';
              window._gtmutils.sendGAHybrid(object);
            } else {
              var webData = Object.assign(
                {
                  event: 'loca_page',
                  title: object.screen_name,
                  location: object.location,
                },
                object.userProperties,
                object.eventParams
              );
      
              window.dataLayer4.push(webData);
            }
          } catch (e) {
            console.log('sendGAPage 함수 ERROR');
            console.log(e.message);
          }
        },
      
        // 스크린뷰 외 이벤트 전송 함수
        sendGAEvent: function (object) {
          try {
            if (isGAAndroid || isGAIOS) {
              window._gtmutils.sendGAHybrid(object);
            } else {
              var webData = Object.assign(
                {
                  event: 'loca_event',
                  event_name: object.event_name,
                  title: object.screen_name,
                  location: object.location,
                },
                object.userProperties,
                object.eventParams
              );
      
              window.dataLayer4.push(webData);
            }
          } catch (e) {
            console.log('sendGAEvent 함수 ERROR');
            console.log(e.message);
          }
        },
      
        // 전자상거래 이벤트 전송 함수
        sendGAEcommerce: function (eventData, items, transactions) {
          try {
            if (isGAAndroid || isGAIOS) {
              Object.assign(eventData.eventParams, transactions);
              var appData = Object.assign({}, eventData, { items: items });
              window._gtmutils.sendGAHybrid(appData);
            } else {
              var webData = Object.assign(
                {
                  event: 'loca_ecommerce',
                  event_name: eventData.event_name,
                  title: eventData.screen_name,
                  location: eventData.location,
                },
                eventData.userProperties,
                eventData.eventParams
              );
              var ecommerceData = Object.assign({ items: items }, transactions);
              Object.assign(webData, { ecommerce: ecommerceData });
              window.dataLayer4.push(webData);
            }
          } catch (e) {
            console.log('sendGAEcommerce 함수 ERROR');
            console.log(e.message);
          }
        },
      
        // Helper function to get and parse dataset gtmBody
        getGtmBodyData: function (element) {
          try {
            if (!element) {
              return null;
            }
      
            var data = {};
            if (element.dataset.gtmEcommerce) {
              data = JSON.parse(element.dataset.gtmEcommerce);
            } else if (element.dataset.gtmBody) {
              data = JSON.parse(element.dataset.gtmBody);
            } else {
              data = null;
            }
      
            return data;
          } catch (error) {
            dataLayer4.push({
              event: 'error_gtmBody',
              error_message: 'getGtmBodyData: ' + error.message,
              page_path: window.location.pathname,
            });
            return null;
          }
        }
      };
      

    // Main function to handle different events - attribute 말아주는 역할
    function handleEvent(element, eventType, pageParams) {
      try {

        // userProperties
        var userProperties = {};
        if (window._gtm && window._gtm.user) {
          userProperties.up_login_type = window._gtm.user.lgnType ? window._gtm.user.lgnType : undefined;
        }
  
        var pageParams = pageParams; 

        if (!element) {
            console.log('::GTM handler Error:: Element is undefined or null');
            return; // element가 없으면 함수 종료
        }
  
        // VUE2 page-body
        var custom_pageParams = {}; // 초기화
        var pageElement = document.querySelector('[data-gtm-page]');
        if (pageElement) {
          custom_pageParams = utils.getGtmBodyData(pageElement) // 빈 객체로 초기화
        }

        // section
        var sectionParams = {}; // 초기화
        var sectionElement = element.closest('[data-gtm-section]');
        if (sectionElement) {
          sectionParams = utils.getGtmBodyData(sectionElement) // 빈 객체로 초기화
        }

        // Determine if eventType is related to eCommerce
        var isEcommerceEvent = ['view-item-list', 'select-item', 'view-item', 'add-to-cart', 'begin-checkout', 'purchase', 'refund'].includes(eventType);

        // visibility or click or eCommerce
        var eCommerceParams = {}; // 빈 객체로 초기화
        var eventParams = {}; // 빈 객체로 초기화
        if (isEcommerceEvent) {
          // eCommerce
          var eCommerceElement = element.closest('[data-gtm-' + eventType + ']');
          if (eCommerceElement) {
            eCommerceParams = utils.getGtmBodyData(eCommerceElement) 
          }
        } else {
          // visibility or click
          var eventElement = element.closest('[data-gtm-' + eventType + ']');
          if (eventElement) {
            eventParams = utils.getGtmBodyData(eventElement)
          }
        }

        // attribute 말아주기
        var ga4Data = {
          eventType: eventType,
          screen_name: pageParams.ep_cd77_cur_page_title||custom_pageParams.page_title||'page_title 없음',
          location: pageParams.ep_cd123_cur_page_fullurl||document.location.href||'주소 없음',
          userProperties: utils.removeEmptyElement(userProperties),
          pageParams: utils.removeEmptyElement(pageParams), 
          sectionParams: utils.removeEmptyElement(sectionParams), 
          eventParams: utils.removeEmptyElement(eventParams), 
          eCommerceParams: utils.removeEmptyElement(eCommerceParams), 
        };

        console.log('::attributes::');
        console.log(ga4Data);
        mappingData(ga4Data);

      } catch (error) {
        console.log('::GTM handler Error::');
        console.log(error);
      }
    }
  
  function mappingData(data) {
    var eventType = data.eventType;
    var userProperties = data.userProperties;
    var sectionParams = data.sectionParams;
    var eventParams = data.eventParams;
    var eCommerceParams = data.eCommerceParams || {};
    var pageParams = data.pageParams
  
    // 맵핑 후 source에서 값을 삭제하는 함수
    function assignIfExists(target, source, keyMappings) {
        if (!source) return; // source가 없으면 함수 종료
        keyMappings.forEach(function(mapping) {
            if (source[mapping.source] !== undefined && source[mapping.source] !== null) {
                // source 값을 target으로 매핑
                target[mapping.target] = source[mapping.source];
                // 매핑된 후 source의 해당 키 삭제
                delete source[mapping.source];
            }
        });
    }

    
    // sectionParams 및 eventParams 매핑
    assignIfExists(sectionParams, data.sectionParams, [
        { source: 'label1', target: 'ep_category_depth1' },
        { source: 'label2', target: 'ep_category_depth2' },
        { source: 'label3', target: 'ep_category_depth3' },
        { source: 'index', target: 'ep_section_index' }
      ]);
    
    assignIfExists(eventParams, data.eventParams, [
        { source: 'label', target: 'ep_label_text' },
        { source: 'search_keyword', target: 'ep_cd25_srch_keyword' },
        { source: 'search_type', target: 'ep_srch_keyword_type' },
        { source: 'search_result', target: 'ep_cd26_srch_result' },
        { source: 'search_result_click', target: 'ep_cd27_srch_res_clk_nm' },
        { source: 'card_name', target: 'ep_cd12_card_name' },
        { source: 'card_code', target: 'ep_card_code' },
        { source: 'card_new_or_exist', target: 'ep_cd64_card_apply_code' },
        { source: 'card_type', target: 'ep_cd65_card_apply_kind' },
        { source: 'fin_prod_name', target: 'ep_cd13_fn_pd_nm' },
        { source: 'fin_amount', target: 'ep_cd17_fn_loan_amt' },
        { source: 'revol_rate', target: 'ep_cd19_rvo_egm_stt_rt' },
        { source: 'revol_term', target: 'ep_cd20_rvo_egm_stt_te' },
        { source: 'prod_funnel_name', target: 'ep_cd48_pd_apply_nm' },
        { source: 'cts_name', target: 'ep_cd14_cts_nm' },
        { source: 'cts_id', target: 'ep_cd42_cts_id' },
        { source: 'cts_sub_id', target: 'ep_cd79_sub_cts_id' },
        { source: 'index', target: 'ep_contents_index' }
      ]);
  
    // 이벤트 이름 세팅
    var event_name;
    var isPopup = data.sectionParams.is_popup ? 'popup' : 'cts';
    var eventTypeMapped = eventType === 'visibility' ? 'view' : 'click';
    event_name = isPopup + '_' + eventTypeMapped;
    if (Object.keys(eCommerceParams).length > 0) {
        event_name = eventType.replaceAll('-', '_');
    }
    
    // 카테고리 세팅
    var ep_category;
    if (Object.keys(eCommerceParams).length > 0) {
      ep_category = '띵샵_이커머스';
    } else {
      var category = eventParams.ep_cd14_cts_nm || eventParams.ep_label_text || eventParams.ep_category_depth1 || 'n';
      ep_category = '콘텐츠_' + category + '_메인_' + pageParams.ep_cd15_page_depth1;
    }
  
    // 액션 세팅
    var ep_action;
    if (Object.keys(eCommerceParams).length > 0) {
      var eCommerceClicks = ['select_item', 'add_to_cart'];
      ep_action = eCommerceClicks.includes(event_name) ? '클릭' : '노출';
    } else {
      ep_action = eventType === 'visibility' ? '노출' : '클릭';
    }
  
    // 라벨 세팅
    var ep_label;
    if (Object.keys(eCommerceParams).length > 0) {
      ep_label = eventParams.ep_cd14_cts_nm || eventParams.ep_label_text || eventParams.ep_category_depth1 || 'n';
    } else {
      var id = eventParams.ep_cd14_cts_nm || 'n';
      var sid = eventParams.ep_cd79_sub_cts_id || 'n';
      var or1 = eventParams.ep_section_index || 'n';
      var or2 = eventParams.ep_contents_index || 'n';
      var de = eventParams.ep_cd14_cts_nm || eventParams.ep_label_text || 'n';
      var clk = eventParams.ep_label_text || 'n';
  
      ep_label = eventType === 'visibility' 
        ? 'id:' + id + '_sid:' + sid + '_or1:' + or1 + '_or2:' + or2 + '_de:' + de
        : 'id:' + id + '_sid:' + sid + '_or1:' + or1 + '_or2:' + or2 + '_de:' + de + '_clk:' + clk;
    }
  
    // 최종 데이터 설정
    eventParams = Object.assign(eventParams, sectionParams ,pageParams, { ep_category: ep_category, ep_action: ep_action, ep_label: ep_label });
  
    var gaFinalData = {
      event_name: event_name,
      screen_name: data.screen_name,
      location: data.location,
      eventParams: utils.removeEmptyElement(eventParams),
      userProperties: utils.removeEmptyElement(userProperties),
    };
  
    if (Object.keys(eCommerceParams).length > 0) {
      var items = eCommerceParams.ecommerce ? eCommerceParams.ecommerce.items : [];
      var transactions = utils.removeEmptyElement(eCommerceParams.ecommerce || {});
      utils.sendGAEcommerce(gaFinalData, items, transactions);
    } else {
       utils.sendGAEvent(gaFinalData);
    }
  
    // 최종 데이터 전달
    console.log('::GA Final Data::');
    console.log(gaFinalData);
  }

    window._gtmutils = {
      sendGAHybrid: utils.sendGAHybrid,
      removeEmptyElement: utils.removeEmptyElement,
      sendGAPage: utils.sendGAPage,
      sendGAEvent: utils.sendGAEvent,
      sendGAEcommerce: utils.sendGAEcommerce,
      handleEvent: handleEvent,
    };
  })();
</script>