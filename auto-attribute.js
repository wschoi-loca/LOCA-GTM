// data-gtm-click 또는 data-gtm-visibility가 있는 요소를 제외하기 위한 함수
function hasClosestWithPrefix(element, prefix) {
  return element.closest(`[${prefix}]`) !== null;
}

// 특정 클래스를 가진 가장 가까운 부모 요소를 찾는 함수
function hasClosestWithClass(element, classNames) {
  for (const className of classNames) {
    if (element.closest(`.${className}`)) {
      return true;
    }
  }
  return false;
}

// 특정 ID를 가진 가장 가까운 부모 요소를 찾는 함수
function hasClosestWithId(element, id) {
  return element.closest(`#${id}`) !== null;
}

// Helper function to get the label value based on specified conditions
function getLabelValue(element) {
  let value = "";
  const svgCloseCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M21 3 3 21M3 3l18 18"]');
  const svgMoveCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m9 18 6-6-6-6"]');
  const svgQuestionCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"][fill="none"][viewBox="0 0 20 20"][class="w-6 h-6"]');
  const svgBackCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m10 20-9-8 9-8"]');
  const svgShareCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"]');

  // Function to apply transformations based on provided regex patterns
  const applyTransformations = (text, patterns) => {
    if (!text) return "";
    let transformedText = text;
    patterns.forEach(pattern => {
      transformedText = transformedText.replace(new RegExp(pattern, 'g'), '|');
    });
    return transformedText;
  };

  // Define the patterns to be replaced
  const patterns = ['\\n', '<br\\s*\\/?>', '\\t'];

  // 라벨값을 가져오기 위한 조건들
  const conditions = [
    () => applyTransformations(element.innerText, patterns),
    () => applyTransformations(element.textContent, patterns),
    () => applyTransformations(element.outerText, patterns),
    () => {
      // Find the closest parent with innerText, up to 5 levels
      let parent = element.parentElement;
      let level = 0;
      while (parent && !parent.innerText && level < 5) {
        parent = parent.parentElement;
        level++;
      }
      return parent && parent.innerText ? applyTransformations(parent.innerText, patterns) : "";
    },
    () => element.getAttribute("text") ? applyTransformations(element.getAttribute("text"), patterns) : "",
    () => element.src,
    () => {
      const img = element.querySelector("img[src]");
      return img ? img.src : "";
    },
    () => element.className,
  ];

  for (const condition of conditions) {
    value = condition();
    if (value) break;
  }

  value = value.trim();

  // Check for specific SVGs and append label
  if (svgCloseCheck) {
    value += " 닫기";
  } else if (svgMoveCheck) {
    value += " 이동하기";
  } else if (svgQuestionCheck) {
    value += " 물음표";
  } else if (svgBackCheck) {
    value += " 뒤로가기";
  } else if (svgShareCheck) {
    value += " 공유하기";
  }

  var elementTitle = applyTransformations(element.title, patterns);
  if(elementTitle) {
    value += '>'+ elementTitle;
  }

  // Trim the value to 100 characters if necessary
  return value.length > 100 ? value.substring(0, 100) : value;
}

// Select elements based on given conditions and add data-gtm-auto-click attribute
const clickSelectors = [
  // 조건 1: button 태그 주변에 data-gtm-click 또는 data-gtm-auto-click이 없고, 하위에 button 또는 a 태그가 없는 경우
  // popup-layer, bottomsheet, bottom-modal, default-modal, menu 클래스 및 id="locaHeader"를 가진 요소 제외
  "button:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  
  // 조건 2: a 태그 주변에 data-gtm-click 또는 data-gtm-auto-click이 없고, 하위에 button 또는 a 태그가 없는 경우
  // popup-layer, bottomsheet, bottom-modal, default-modal, menu 클래스 및 id="locaHeader"를 가진 요소 제외
  "a:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  
  // 조건 3: .swiper-slide 클래스가 있는 태그에 data-gtm-click 또는 data-gtm-auto-click이 없는 경우
  // popup-layer, bottomsheet, bottom-modal, default-modal, menu 클래스 및 id="locaHeader"를 가진 요소 제외
  ".swiper-slide:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  
  // 조건 4: input 태그에 data-gtm-click 또는 data-gtm-auto-click이 없고, 부모 또는 자식 요소에 button 또는 a 태그가 없는 경우
  // popup-layer, bottomsheet, bottom-modal, default-modal, menu 클래스 및 id="locaHeader"를 가진 요소 제외
  "input:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a)):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
];

document.querySelectorAll(clickSelectors.join(",")).forEach((element) => {
  if (!hasClosestWithPrefix(element, "data-gtm-click")) {
    // 제외할 클래스, ID를 가진 부모 요소가 있는지 확인
    const excludeClasses = ['popup-layer', 'bottomsheet', 'bottom-modal', 'default-modal', 'menu'];
    if (!hasClosestWithClass(element, excludeClasses) && 
        !hasClosestWithId(element, "locaHeader")) {
      // Get the closest button or a parent element
      const parentElement = element.closest("button, a");
      if (parentElement) {
        parentElement.setAttribute("data-gtm-auto-click", "");
        const labelValue = getLabelValue(parentElement);
        if (labelValue) {
          parentElement.setAttribute(
            "data-gtm-auto-body",
            JSON.stringify({ label: labelValue, auto_tag_yn: "Y" })
          );
        }
      } else if (element.tagName.toLowerCase() === 'li' || element.tagName.toLowerCase() === 'input' || element.classList.contains('swiper-slide')) {
        element.setAttribute("data-gtm-auto-click", "");
        const labelValue = getLabelValue(element);
        if (labelValue) {
          element.setAttribute(
            "data-gtm-auto-body",
            JSON.stringify({ label: labelValue, auto_tag_yn: "Y" })
          );
        }
      }
    }
  }
});

// Select .swiper-slide elements and add data-gtm-auto-view attribute
// popup-layer, bottomsheet, bottom-modal, default-modal, menu 클래스 및 id="locaHeader"를 가진 요소 제외
document.querySelectorAll(".swiper-slide:not([data-gtm-visibility]):not([data-gtm-auto-view])"+
":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
":not(#locaHeader)").forEach((element) => {
  if (!hasClosestWithPrefix(element, "data-gtm-visibility")) {
    // 제외할 클래스, ID를 가진 부모 요소가 있는지 확인
    const excludeClasses = ['popup-layer', 'bottomsheet', 'bottom-modal', 'default-modal', 'menu'];
    if (!hasClosestWithClass(element, excludeClasses) && 
        !hasClosestWithId(element, "locaHeader")) {
      element.setAttribute("data-gtm-auto-view", "");
      const labelValue = getLabelValue(element);
      if (labelValue) {
        element.setAttribute(
          "data-gtm-auto-body",
          JSON.stringify({ label: labelValue })
        );
      }
    }
  }
});