
(function() {
    // 사용자 속성 설정
    function setUserProperties() {
      var userProperties = {};
      
      return userProperties;
    }
    
    // 이벤트 매개변수 설정
    function setPageParams() {
      var pageParams = {
        ep_cd77_cur_page_title: {{VAR_JS_depthAll}},
        ep_cd78_cur_page_url: {{VAR_URLpath_decoded}}, // 도메인 제외 full url
        ep_new_tag: 'Y',
        ep_cd15_page_depth1:{{VAR_JS_1depth}},
        ep_cd16_page_depth2:{{VAR_JS_2depth}},
        ep_cd52_page_depth3:{{VAR_JS_3depth}},
        ep_page_depth4:{{VAR_JS_4depth}},
        ep_page_depth5:{{VAR_JS_5depth}},
        ep_cd11_native_yn:'SPA',
        ep_cd43_act_id: {{VAR_pageData_act_id}},
        ep_cd44_ex_act_id: {{VAR_pageData_ex_act_id}},
        ep_cd45_ex_act_rpl_id: {{VAR_pageData_ex_act_rpl_id}},
        ep_cd56_cms_cno: {{VAR_pageData_cmscno}},
      }
       
      return pageParams;
    };
    
    // 최종 sendGA 종합해주기
    function mappingData(data) {

        var eventType = data.eventType
        var pageParams = data.pageParams
        var sectionParams = data.sectionParams
        var eventParams = data.eventParams

        // 단순 속성 값 매핑 값들 세팅
     

        ep_category_depth1 = sectionParams.label1,
        ep_category_depth2 = sectionParams.label2,
        ep_category_depth3 = sectionParams.label3.
        ep_section_index = sectionParams.index,

        ep_label_text = eventParams.label,

        ep_cd25_srch_keyword = eventParams.search_keyword,
        ep_srch_keyword_type =  eventParams.search_type,
        ep_cd26_srch_result = eventParams.search_result,
        ep_srch_result  = eventParams.search_result,
        ep_cd27_srch_res_clk_nm = eventParams.search_result_click,

        ep_cd12_card_name = eventParams.card_name,
        ep_card_name = eventParams.card_name,
        ep_card_code = eventParams.card_code,
        ep_cd64_card_apply_code = eventParams.card_new_or_exist,
        ep_cd65_card_apply_kind = eventParams.card_type,
        ep_cd13_fn_pd_nm = eventParams.fin_prod_name,
        ep_cd17_fn_loan_amt = eventParams.fin_amount,
        ep_cd19_rvo_egm_stt_rt = eventParams.revol_rate,
        ep_cd20_rvo_egm_stt_te = eventParams.revol_term,
        ep_cd48_pd_apply_nm = eventParams.prod_funnel_name,

        ep_cd14_cts_nm = eventParams.cts_name,
        ep_cd42_cts_id = eventParams.cts_id,
        ep_cd79_sub_cts_id = eventParams.cts_sub_id,
        ep_section_index = sectionParams.index,
        ep_contents_index = eventParams.index,


        // 어트리뷰트 조합하는 값들 세팅
        //이벤트 이름 세팅
        var isPopup = sectionParams.is_popup ? "popup" : "cts";
        var eventTypeMapped = eventType === 'visibility' ? 'view' : eventType;
    
        // event_name 규칙에 따른 생성
        var event_name = '';
    
        // eventType이 'page'이고 mobile이 true이면 page_view, 아니면 screen_view
        if (eventType === 'page') {
            event_name = pageParams.isMO ? 'page_view' : 'screen_view';
        } else {
            event_name = `${isPopup}_${eventTypeMapped}`;
        }

        //카테고리 세팅
        //액션 세팅
        //라벨 세팅


        //최종으로 전달
        
  

    }
      
      var gaFinalData = {
        event_name: eventName,
        location: data.location,
        screen_name: data.screen_name,
        userProperties: window._gtm.removeEmptyElement(userProperties),
        eventParams: window._gtm.removeEmptyElement(eventParams)
      }

      return setData;
    };

    // Helper function to get and parse dataset gtmBody
    function getGtmBodyData(element) {
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
        dataLayer.push({
          event: 'error_gtmBody',
          error_message: 'getGtmBodyData: ' + error.message,
          page_path: window.location.pathname
        });
        return null;
      }
    }

    // Main function to handle different events - attribute 말아주는 역할
    function handleEvent(element, eventType) {
      try {
        // page
        var userProperties = removeEmptyElement(setUserProperties());
        var pageParams = removeEmptyElement(setPageParams());
        
        // section
        var sectionElement = element.closest('[data-gtm-section]');
        var sectionParams = Object.assign({}, removeEmptyElement(setPageParams()), getGtmBodyData(sectionElement) || {});

   

        // Determine if eventType is related to eCommerce
        var isEcommerceEvent = ['view-item-list', 'select-item', 'view-item', 'add-to-cart', 'begin-checkout', 'purchase', 'refund'].includes(eventType);


        // visibility or click or eCommerce
        var eventElement = element.closest('[data-gtm-' + (isEcommerceEvent ? 'ecommerce' : eventType) + ']');
        var eventParams = getGtmBodyData(eventElement);
        if (!eventData) return;

        // attribute 말아주기
        var ga4Data = {
          eventType: eventType,  
          screen_name: {{VAR_JS_depthAll}},
          location: {{VAR_fullURL_decoded}},
          userProperties: userProperties,
          pageParams: pageParams,
          sectionParams: sectionParams,
          eventParams: eventParams
        };
        mappingData(ga4Data);
        console.log('::attributes::');
        console.log(ga4Data);

        if (eventSuffix == 'page') {
          sendGAPage(ga4Data);
        } else if (isEcommerceEvent) {
          ga4Data.event_name = eventSuffix.replaceAll('-', '_');
          var items = eventData.ecommerce.items;
          delete eventData.ecommerce.items;
          var transactions = eventData.ecommerce
          sendGAEcommerce(ga4Data, items, transactions);
        } else {
          ga4Data.event_name = (isPopup ? 'popup_' : 'cts_') + eventSuffix;
          sendGAEvent(ga4Data);
        }

      } catch (error) {
        console.log('::GTM handler Error::');
        console.log(error)
      }
    }

    // 앱 구분자 설정
    var browserInfo = navigator.userAgent;
    var isGAAndroid = browserInfo.indexOf('GA_Android') > -1;
    var isGAIOS = browserInfo.indexOf('GA_iOS_WK') > -1;
    var commonGAData = {};

    // 앱으로 데이터 전달 함수
    function sendGAHybrid(object) {
      try {
        var GAData;
        if (object.event_name == 'screen_view') {
          GAData = Object.assign({}, object);
        } else {
          var eventParams = Object.assign({}, commonGAData.eventParams, object.eventParams);
          var userProperties = Object.assign({}, commonGAData.userProperties, object.userProperties);
          delete object.eventParams;
          delete object.userProperties;
          GAData = Object.assign({}, object, { screen_name: commonGAData.screen_name, location: commonGAData.location, eventParams: eventParams, userProperties: userProperties });
        }

        console.log('::Final-sendGAHybrid::');
        console.log(GAData);
        isGAAndroid ? window.lotteCardgascriptAndroid.GAHybrid(JSON.stringify(GAData)) : webkit.messageHandlers.lotteCardgascriptCallbackHandler.postMessage(JSON.stringify(GAData));
      } catch (e) {
        console.log('sendGAHybrid 함수 ERROR');
        console.log(e.message);
      }
    }

    // 값 정리 및 제한 함수
    function removeEmptyElement(inputValues) {
      var returnValue = {};

      for (var key in inputValues) {
        var value = inputValues[key];  // Change let to var

        // 빈 값 제거
        if (value !== '' && value !== null && value !== undefined && value !== "undefined" && value !== "null") {

          // 값이 문자열인지 확인
          if (typeof value === 'string') {
            // 개행 문자 제거 후 띄어쓰기로 변환
            value = value.replace(/\\n/g, ' ');

            // 값 글자수를 500자 이하로 제한
            if (value.length > 500) {
              value = value.substring(0, 500);
            }
          }

          returnValue[key] = value;
        }
      }

      return returnValue;
    }

    // 스크린뷰 전송 함수
    function sendGAPage(object) {
      try {
        commonGAData = Object.assign({}, object);
        if (isGAAndroid || isGAIOS) {
          object.event_name = "screen_view";
          sendGAHybrid(object);
        } else {
          var webData = Object.assign({ 
            event: 'loca_page', 
            title: object.screen_name, 
            location: object.location 
          }, 
            object.userProperties,
            object.eventParams);
        
          window.dataLayer.push(webData);
          console.log(window.dataLayer);
        }
      } catch (e) {
        console.log('sendGAPage 함수 ERROR');
        console.log(e.message);
      }
    }

  // 스크린뷰 외 이벤트 전송 함수
  function sendGAEvent(object) {
    try {
      if (isGAAndroid || isGAIOS) {
        sendGAHybrid(object);
      } else {
        var webData = Object.assign({
          event: 'loca_event', 
          event_name: object.event_name,
          title: object.screen_name, 
          location: object.location 
        }, 
          object.userProperties,
          object.eventParams);
        
        window.dataLayer.push(webData);
      }
    } catch (e) {
      console.log('sendGAEvent 함수 ERROR');
      console.log(e.message);
    }
  }
  
  // 전자상거래 이벤트 전송 함수
  function sendGAEcommerce(eventData, items, transactions) {
    try {
      var actionList = ['select_item', 'add_to_cart'];
      eventData.ep_category = '띵샵_이커머스';
      eventData.ep_action = actionList.includes(eventData.event_name) ? '클릭' : '노출';
      
      if (isGAAndroid || isGAIOS) {
        var appData = Object.assign(eventData, items, transactions);
        sendGAHybrid(appData);
      } else {
        var webData = Object.assign({ event: 'loca_ecommerce' }, eventData);
        var ecommerceData = Object.assign({ items: items }, transactions);
        webData = Object.assign(webData, { ecommerce : ecommerceData });
        window.dataLayer.push(webData);
        console.log(window.dataLayer);
      }
    } catch (e) {
      console.log('sendGAEcommerce 함수 ERROR');
      console.log(e.message);
    }
  }

  window._gtm = {
    getGtmBodyData: getGtmBodyData,
    handleEvent: handleEvent,
    removeEmptyElement: removeEmptyElement,
    sendGAHybrid: sendGAHybrid,
    sendGAPage: sendGAPage,
    sendGAEvent: sendGAEvent,
    sendGAEcommerce: sendGAEcommerce
  };

  })();

