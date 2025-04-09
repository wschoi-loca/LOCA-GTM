
function hasClosestWithPrefix(element, prefix) {
  try {
    return element.closest("[" + prefix + "]") !== null;
  } catch (error) {
    console.error("Error in hasClosestWithPrefix: " + error.message);
    return false;
  }
}

function hasClosestWithClass(element, classNames) {
  try {
    for (var i = 0; i < classNames.length; i++) {
      if (element.closest("." + classNames[i])) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error in hasClosestWithClass: " + error.message);
  }
  return false;
}

function hasClosestWithId(element, id) {
  try {
    return element.closest("#" + id) !== null;
  } catch (error) {
    console.error("Error in hasClosestWithId: " + error.message);
    return false;
  }
}

function applyTransformations(text, patterns) {
  if (!text) return "";
  var transformedText = text;
  patterns.forEach(function (pattern) {
    transformedText = transformedText.replace(new RegExp(pattern, 'g'), '|');
  });
  return transformedText;
}

function getLabelValue(element) {
  var value = "";
  try {
    var svgCloseCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M21 3 3 21M3 3l18 18"]');
    var svgMoveCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m9 18 6-6-6-6"]');
    var svgQuestionCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"][fill="none"][viewBox="0 0 20 20"][class="w-6 h-6"]');
    var svgBackCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="m10 20-9-8 9-8"]');
    var svgShareCheck = element.querySelector('svg[xmlns="http://www.w3.org/2000/svg"] path[d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"]');

    var patterns = ['\\n', '<br\\s*\\/?>', '\\t', '\\n\\n', '\\n\\n\\n'];

    var conditions = [
      function () {
        var altElement = element.querySelector("[alt]");
        return altElement ? applyTransformations(altElement.getAttribute("alt"), patterns) : "";
      },
      function () { return applyTransformations(element.innerText, patterns); },
      function () { return applyTransformations(element.textContent, patterns); },
      function () { return applyTransformations(element.outerText, patterns); },
      function () {
        var parent = element.parentElement;
        var level = 0;
        while (parent && !parent.innerText && level < 5) {
          parent = parent.parentElement;
          level++;
        }
        return parent && parent.innerText ? applyTransformations(parent.innerText, patterns) : "";
      },
      function () { return element.getAttribute("text") ? applyTransformations(element.getAttribute("text"), patterns) : ""; },
      function () { return element.src; },
      function () {
        var img = element.querySelector("img[src]");
        return img ? img.src : "";
      },
      function () { return element.className; },
    ];

    for (var i = 0; i < conditions.length; i++) {
      value = conditions[i]();
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
    console.error("Error in getLabelValue: " + error.message);
    return "";
  }
}

var clickSelectors = [
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

function processClickSelectors(element) {
  try {
    if (!hasClosestWithPrefix(element, "data-gtm-click")) {
      var excludeClasses = ['popup-layer', 'bottomsheet', 'bottom-modal', 'default-modal', 'menu'];
      if (!hasClosestWithClass(element, excludeClasses) && 
          !hasClosestWithId(element, "locaHeader")) {
        var parentElement = element.closest("button, a");
        if (parentElement) {
          parentElement.setAttribute("data-gtm-auto-click", "");
          var labelValue = getLabelValue(parentElement);
          if (labelValue) {
            parentElement.setAttribute(
              "data-gtm-auto-body",
              JSON.stringify({ label: labelValue, auto_tag_yn: "Y" })
            );
          }
        } else if (element.tagName.toLowerCase() === 'li' || element.tagName.toLowerCase() === 'input' || element.classList.contains('swiper-slide')) {
          element.setAttribute("data-gtm-auto-click", "");
          var labelValue = getLabelValue(element);
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
    console.error("Error processing clickSelectors: " + error.message);
  }
}

function processSwiperSlides(element) {
  try {
    if (!hasClosestWithPrefix(element, "data-gtm-click")) {
      var excludeClasses = ['popup-layer', 'bottomsheet', 'bottom-modal', 'default-modal', 'menu'];
      if (!hasClosestWithClass(element, excludeClasses) && 
          !hasClosestWithId(element, "locaHeader")) {
        element.setAttribute("data-gtm-auto-click", "");
        var labelValue = getLabelValue(element);
        if (labelValue) {
          element.setAttribute(
            "data-gtm-auto-body",
            JSON.stringify({ label: labelValue })
          );
        }
      }
    }
  } catch (error) {
    console.error("Error processing swiper-slide elements: " + error.message);
  }
}

setTimeout(function() {
  document.querySelectorAll(clickSelectors.join(",")).forEach(function(element) {
    processClickSelectors(element);
  });

  document.querySelectorAll(".swiper-slide:not([data-gtm-visibility]):not([data-gtm-auto-view])"+
  ":not(.popup-layer):not(.bottomsheet):not(.bottom-modal):not(.default-modal):not(.menu)"+
  ":not(#locaHeader)").forEach(function(element) {
    processSwiperSlides(element);
  });
}, 300); // Adjust the timeout duration as needed
