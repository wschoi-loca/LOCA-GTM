<script>
  (function () {
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
        var value = inputValues[key];

        if (value !== '' && value !== null && value !== undefined && value !== 'undefined' && value !== 'null') {
          if (typeof value === 'string') {
            value = value.replace(/\\n/g, ' ').substring(0, 500);
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
          object.event_name = 'screen_view';
          sendGAHybrid(object);
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

          window.dataLayer.push(webData);
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
        if (isGAAndroid || isGAIOS) {
          Object.assign(eventData.eventParams, transactions);
          var appData = Object.assign({}, eventData, { items: items });
          sendGAHybrid(appData);
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
          window.dataLayer.push(webData);
        }
      } catch (e) {
        console.log('sendGAEcommerce 함수 ERROR');
        console.log(e.message);
      }
    }

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
        dataLayer4.push({
          event: 'error_gtmBody',
          error_message: 'getGtmBodyData: ' + error.message,
          page_path: window.location.pathname,
        });
        return null;
      }
    }

    // Main function to handle different events - attribute 말아주는 역할
    function handleEvent(element, eventType) {
      try {
        var userProperties = setUpAndPageParams.setUserProperties(); // 빈 객체로 초기화
        var pageParams = {
            ep_cd77_cur_page_title: {{VAR_JS_depthAll}},
            ep_cd78_cur_page_url: {{VAR_URLpath_decoded}}, // 도메인 제외 full url
            ep_new_tag: 'Y',
            ep_cd15_page_depth1: {{VAR_JS_1depth}},
            ep_cd16_page_depth2: {{VAR_JS_2depth}},
            ep_cd52_page_depth3: {{VAR_JS_3depth}},
            ep_page_depth4: {{VAR_JS_4depth}},
            ep_page_depth5: {{VAR_JS_5depth}},
            ep_cd11_native_yn: 'SPA',
            ep_cd43_act_id: {{VAR_pageData_act_id}},
            ep_cd44_ex_act_id: {{VAR_pageData_ex_act_id}},
            ep_cd45_ex_act_rpl_id: {{VAR_pageData_ex_act_rpl_id}},
            ep_cd56_cms_cno: {{VAR_pageData_cmscno}},
        };


        if (eventType='page') {
             // page
             // attribute 말아주기
            var ga4Data = {
                eventType: 'screen_view',
                screen_name: {{VAR_JS_depthAll}},
                location: {{VAR_fullURL_decoded}},
                userProperties: window._gtm.removeEmptyElement(userProperties),
                pageParams: window._gtm.removeEmptyElement(pageParams), 
                sectionParams: window._gtm.removeEmptyElement(sectionParams), 
                eventParams: window._gtm.removeEmptyElement(eventParams), 
                eCommerceParams: window._gtm.removeEmptyElement(eCommerceParams), 
            };
            console.log('::page-attributes::');
            console.log(ga4Data);
            mappingData(ga4Data);
        }

        // element가 정의되었는지 먼저 확인
        if (!element) {
            
            console.log('::GTM handler Error:: Element is undefined or null');
            console.log('::GTM handler Error:: Element is undefined or null::eventType->'+eventType)
            return; // element가 없으면 함수 종료
        }        

        // section
        var sectionParams = {}; // 초기화
        var sectionElement = element.closest('[data-gtm-section]');
        if (sectionElement) {
          sectionParams = getGtmBodyData(sectionElement) // 빈 객체로 초기화
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
            eCommerceParams = getGtmBodyData(eCommerceElement) 
          }
        } else {
          // visibility or click
          var eventElement = element.closest('[data-gtm-' + eventType + ']');
          if (eventElement) {
            eventParams = getGtmBodyData(eventElement)
          }
        }

        // attribute 말아주기
        var ga4Data = {
          eventType: eventType,
          screen_name: {{VAR_JS_depthAll}},
          location: {{VAR_fullURL_decoded}},
          userProperties: window._gtm.removeEmptyElement(userProperties),
          pageParams: window._gtm.removeEmptyElement(pageParams), 
          sectionParams: window._gtm.removeEmptyElement(sectionParams), 
          eventParams: window._gtm.removeEmptyElement(eventParams), 
          eCommerceParams: window._gtm.removeEmptyElement(eCommerceParams), 
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
      var eventParams = data.eventParams;
      var eCommerceParams = data.eCommerceParams;

      // 단순 속성 값 매핑
      var ep_category_depth1 = data.sectionParams.label1;
      eventParams.ep_category_depth1 = ep_category_depth1;
      eventParams.ep_category_depth2 = data.sectionParams.label2;
      eventParams.ep_category_depth3 = data.sectionParams.label3;
      var ep_section_index = data.sectionParams.index;
      eventParams.ep_section_index = ep_section_index;

      var ep_label_text = data.eventParams.label;
      eventParams.ep_label_text = ep_label_text;

      eventParams.ep_cd25_srch_keyword = data.eventParams.search_keyword;
      eventParams.ep_srch_keyword_type = data.eventParams.search_type;
      eventParams.ep_cd26_srch_result = data.eventParams.search_result;
      eventParams.ep_srch_result = data.eventParams.search_result;
      eventParams.ep_cd27_srch_res_clk_nm = data.eventParams.search_result_click;

      eventParams.ep_cd12_card_name = data.eventParams.card_name;
      eventParams.ep_card_name = data.eventParams.card_name;
      eventParams.ep_card_code = data.eventParams.card_code;
      eventParams.ep_cd64_card_apply_code = data.eventParams.card_new_or_exist;
      eventParams.ep_cd65_card_apply_kind = data.eventParams.card_type;
      eventParams.ep_cd13_fn_pd_nm = data.eventParams.fin_prod_name;
      eventParams.ep_cd17_fn_loan_amt = data.eventParams.fin_amount;
      eventParams.ep_cd19_rvo_egm_stt_rt = data.eventParams.revol_rate;
      eventParams.ep_cd20_rvo_egm_stt_te = data.eventParams.revol_term;
      eventParams.ep_cd48_pd_apply_nm = data.eventParams.prod_funnel_name;

      var ep_cd14_cts_nm = data.eventParams.cts_name;
      eventParams.ep_cd14_cts_nm = ep_cd42_cts_id;
      eventParams.ep_cd42_cts_id = data.eventParams.cts_id;
      var ep_cd79_sub_cts_id = data.eventParams.cts_sub_id;
      eventParams.ep_cd79_sub_cts_id = ep_cd79_sub_cts_id;
      var ep_section_index = data.sectionParams.index;
      eventParams.ep_section_index = ep_section_index;
      var ep_contents_index = data.eventParams.index;
      eventParams.ep_contents_index = ep_contents_index;

      // 어트리뷰트 조합 및 이벤트 이름 세팅
      var event_name;
      if (eventType === 'page') {
        event_name = 'screen_view';
      } else if (eventType === 'visibility' || eventType === 'click') {
        var isPopup = data.sectionParams.is_popup ? 'popup' : 'cts';
        var eventTypeMapped = eventType === 'visibility' ? 'view' : 'click';
        event_name = isPopup + '_' + eventTypeMapped;
      } else {
        event_name = eventType.replaceAll('-', '_');
      }

      // 카테고리 세팅
      var ep_category;
      if (eCommerceParams) {
        ep_category = '띵샵_이커머스';
      } else {
        var category = ep_cd14_cts_nm ? ep_cd14_cts_nm : ep_label_text ? ep_label_text : ep_category_depth1 ? ep_category_depth1 : 'n';
        ep_category = '콘텐츠_' + category + '_메인_' + '{{VAR_JS_1depth}}';
      }

      // 액션 세팅
      var ep_action;
      if (eCommerceParams) {
        var eCommerceClicks = ['select_item', 'add_to_cart'];
        ep_action = eCommerceClicks.includes(event_name) ? '클릭' : '노출';
      } else {
        ep_action = eventType === 'visibility' ? '노출' : '클릭';
      }

      // 라벨 세팅
      var ep_label;
      if (eCommerceParams) {
        ep_label = ep_cd14_cts_nm ? ep_cd14_cts_nm : ep_label_text ? ep_label_text : ep_category_depth1 ? ep_category_depth1 : 'n';
      } else {
        var id = ep_cd14_cts_nm ? ep_cd14_cts_nm : 'n';
        var sid = ep_cd79_sub_cts_id ? ep_cd79_sub_cts_id : 'n';
        var or1 = ep_section_index ? ep_section_index : 'n';
        var or2 = ep_contents_index ? ep_contents_index : 'n';
        var de = ep_cd14_cts_nm ? ep_cd14_cts_nm : ep_label_text ? ep_label_text : 'n';
        var clk = ep_label_text ? ep_label_text : 'n';

        if (eventType === 'visibility') {
          ep_label = 'id:' + id + '_sid:' + sid + '_or1:' + or1 + '_or2:' + or2 + '_de:' + de;
        } else if (eventType === 'click') {
          ep_label = 'id:' + id + '_sid:' + sid + '_or1:' + or1 + '_or2:' + or2 + '_de:' + de + '_clk:' + clk;
        }
      }

      // 최종 데이터 설정
      Object.assign(eventParams, data.pageParams, { ep_category: ep_category, ep_action: ep_action, ep_label: ep_label });

      var gaFinalData = {
        event_name: event_name,
        screen_name: data.screen_name,
        location: data.location,
        eventParams: removeEmptyElement(eventParams),
        userProperties: removeEmptyElement(userProperties),
      };

      if (eventType === 'page') {
        sendGAPage(gaFinalData);
      } else if (eCommerceParams) {
        var items = eCommerceParams.ecommerce.items;
        delete eCommerceParams.ecommerce.items;
        var transactions = removeEmptyElement(eCommerceParams.ecommerce);
        sendGAEcommerce(gaFinalData, items, transactions);
      } else {
        sendGAEvent(gaFinalData);
      }

      // 최종 데이터 전달
      console.log('::GA Final Data::');
      console.log(gaFinalData);
    }

    window._gtm = {
      sendGAHybrid: sendGAHybrid,
      removeEmptyElement: removeEmptyElement,
      sendGAPage: sendGAPage,
      sendGAEvent: sendGAEvent,
      sendGAEcommerce: sendGAEcommerce,
      handleEvent: handleEvent,
    };
  })();
</script>