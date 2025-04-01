// data-gtm-click 또는 data-gtm-visibility가 있는 요소를 제외하기 위한 함수
function hasClosestWithPrefix(element, prefix) {
  try {
    return element.closest(`[${prefix}]`) !== null;
  } catch (error) {
    console.error(`Error in hasClosestWithPrefix: ${error.message}`);
    return false;
  }
}

// 특정 클래스를 가진 가장 가까운 부모 요소를 찾는 함수
function hasClosestWithClass(element, classNames) {
  try {
    for (const className of classNames) {
      if (element.closest(`.${className}`)) {
        return true;
      }
    }
  } catch (error) {
    console.error(`Error in hasClosestWithClass: ${error.message}`);
  }
  return false;
}

// 특정 ID를 가진 가장 가까운 부모 요소를 찾는 함수
function hasClosestWithId(element, id) {
  try {
    return element.closest(`#${id}`) !== null;
  } catch (error) {
    console.error(`Error in hasClosestWithId: ${error.message}`);
    return false;
  }
}

// Helper function to get the label value based on specified conditions
function getLabelValue(element) {
  let value = "";
  try {
    const svgCloseCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M21 3 3 21M3 3l18 18"]');
    const svgMoveCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m9 18 6-6-6-6"]');
    const svgQuestionCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"][fill="none"][viewBox="0 0 20 20"][class="w-6 h-6"]');
    const svgBackCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m10 20-9-8 9-8"]');
    const svgShareCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"]');

    const applyTransformations = (text, patterns) => {
      if (!text) return "";
      let transformedText = text;
      patterns.forEach(pattern => {
        transformedText = transformedText.replace(new RegExp(pattern, 'g'), '|');
      });
      return transformedText;
    };

    const patterns = ['\\n', '<br\\s*\\/?>', '\\t' , '\\n\\n',  '\\n\\n\\n'];

    const conditions = [
      () => {
        const altElement = element.querySelector("[alt]");
        return altElement ? applyTransformations(altElement.getAttribute("alt"), patterns) : "";
      },
      () => applyTransformations(element.innerText, patterns),
      () => applyTransformations(element.textContent, patterns),
      () => applyTransformations(element.outerText, patterns),
      () => {
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
    if (elementTitle) {
      value += '>' + elementTitle;
    }

    return value.length > 100 ? value.substring(0, 100) : value;
  } catch (error) {
    console.error(`Error in getLabelValue: ${error.message}`);
    return "";
  }
}

const clickSelectors = [
  "button:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  "a:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  ".swiper-slide:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
  "input:not([data-gtm-click]):not([data-gtm-auto-click]):not(:has(button, a)):not(:has(button, a))"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)",
];

document.querySelectorAll(clickSelectors.join(",")).forEach((element) => {
  try {
    if (!hasClosestWithPrefix(element, "data-gtm-click")) {
      const excludeClasses = ['popup-layer', 'bottomsheet', 'bottom-modal', 'default-modal', 'menu'];
      if (!hasClosestWithClass(element, excludeClasses) && 
          !hasClosestWithId(element, "locaHeader")) {
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
  } catch (error) {
    console.error(`Error processing clickSelectors: ${error.message}`);
  }
});

document.querySelectorAll(".swiper-slide:not([data-gtm-visibility]):not([data-gtm-auto-view])"+
":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
":not(#locaHeader)").forEach((element) => {
  try {
    if (!hasClosestWithPrefix(element, "data-gtm-visibility")) {
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
  } catch (error) {
    console.error(`Error processing swiper-slide elements: ${error.message}`);
  }
});