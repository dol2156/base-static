/* 2023-09-13 :: START :: window */
(() => {
  // URL 객체 생성
  const urlObj = new URL(window.location.href);

  // URLSearchParams 객체 생성
  const params = new URLSearchParams(urlObj.search);

  // 파라메터 정보를 배열로 변환 후, Object.fromEntries를 이용해 객체로 변환
  const paramsObject = Object.fromEntries(params.entries());
  window.params = paramsObject;
  const c_label = 'window.params';
  const c_label_style = 'border:1px solid black; background:skyblue; color:#333; padding:0.25em 0.5em; font-size:12px; font-weight:bold;';
  const c_value = JSON.stringify(window.params);
  const c_value_style = 'border:1px solid black; background:#ffffd4; color:#333; padding:0.25em 0.5em; font-size:12px; border-left:none;';
  console.log(`%c${c_label}%c${c_value}`, c_label_style, c_value_style);

})();

/**
 * 짧은 uid 반환
 * @returns {string}
 */
window.UID = () => {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
};
/* // 2023-09-13 :: END :: window */

/* 2023-10-24 :: START :: setCssVh */
const setCssVar = () => {
  const el_html = document.documentElement;
  el_html.style.setProperty('--vh-100', `${window.innerHeight}px`);
  el_html.style.setProperty('--vh-50', `${window.innerHeight / 2}px`);

  const $ruler_inner = $(`#ContentsRuler > .Inner`);
  if ($ruler_inner.width()) {
    const real_side_padding = ($(window).width() - $ruler_inner.width()) / 2;
    el_html.style.setProperty('--real-side-padding', `${real_side_padding}px`);
  }
};
window.addEventListener('resize', setCssVar);
setCssVar();
window.addEventListener('DOMContentLoaded', (evt) => {
  setCssVar();
});
/* // 2023-10-24 :: END :: setCssVh */

/* 2023-10-21 :: START :: LayerControl */
const LayerControl = {};

/**
 *
 * @param layer_id
 * @constructor
 */
LayerControl.On = (layer_id, callback) => {
  const el_modal = document.querySelector(`#Modal`);
  el_modal.classList.add(`On`);

  const el_layer_id = document.querySelector(layer_id);
  el_layer_id.classList.add(`On`);
};

/**
 * @param layer_id
 * @constructor
 */
LayerControl.Off = () => {
  const el_modal = document.querySelector(`#Modal`);
  el_modal.classList.remove(`On`);

  const el_layer_list = document.querySelectorAll(`.LayerPopup`);
  el_layer_list.forEach((el_layer, idx) => {
    el_layer.classList.remove(`On`);
  });
};
/* // 2023-10-21 :: END :: LayerControl */

/* 2023-10-21 :: START :: ModalControl */
const ModalControl = {};
ModalControl.init = () => {
  const el_modal = document.querySelector(`#Modal`);
  el_modal.addEventListener('click', (evt) => {
    LayerControl.Off();
  });
};
/* // 2023-10-21 :: END :: ModalControl */

/* 2023-11-10 :: START :: AsideMenu Control */

function openAsideMenu() {
  $(`#Aside`).addClass('On');
}

function closeAsideMenu() {
  $(`#Aside`).removeClass('On');
}
/* // 2023-11-10 :: END :: AsideMenu Control */

/**
 * 스크롤 동작이 끝나면
 * scroll_end 커스텀 이벤트 발생
 */
(() => {
  let isScrolling;
  window.addEventListener(
    'scroll',
    (e) => {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(
        () => {
          const event = new Event('scroll_end');
          window.dispatchEvent(event);
        },
        150,
        false,
      );
    },
    false,
  );
})();

/**
 * DOM 의 class 가 변경되면,
 * change_class 커스텀 이벤트 발생
 */
(() => {
  // 감지 옵션 (감지할 변경)
  const config = { attributes: true, subtree: true };

  // 변경 감지 시 실행할 콜백 함수
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // class 변경 감지 후 target 으로 이벤트 발송
        const target = mutation.target;
        const event = new Event('change_class');
        target.dispatchEvent(event);
      }
    }
  };

  // 콜백 함수에 연결된 감지기 인스턴스 생성
  const observer = new MutationObserver(callback);

  // 설정한 변경의 감지 시작
  observer.observe(document.documentElement, config);

  // 이후 감지 중단 가능
  // observer.disconnect();
})();

/**
 * 자식이 1개일때 자식에게 FixedShell 클래스를 주면
 * 자식의 포지션이 공중에 뜨더라도 부모의 너비가 유지되도록 유지
 * <div class="RR relative">
 *   <div class="FixedShell absolute left-[0] top-[0] z-10">
 *     ...
 *   </div>
 * </div>
 */
function updateFixedShell() {
  const el_fs = [...document.querySelectorAll('.FixedShell')];
  el_fs.forEach((el, idx) => {
    const el_parent = el.parentElement;
    const fs_hei = el.offsetHeight;
    el_parent.style.setProperty('height', `${fs_hei}px`);
  });
}

/**
 * .StickyBox > .FixedShell 의 DOM 규칙을 갖고
 * .StickyBox 의 data-sticky-offset 의 값을 읽어와서 Sticky 처리함
 */
function updateStickyBox() {
  const el_list = [...document.querySelectorAll('.StickyBox')];

  el_list.forEach((el, idx) => {
    checkSticky(el);
  });

  function checkSticky(target) {
    const shell = target.querySelector(`:scope > .FixedShell`);
    if (!shell) return;
    const box_wid = target.offsetWidth;
    shell.style.setProperty('width', `${box_wid}px`);

    const y = target.getBoundingClientRect().y;
    let offset = parseInt(target.getAttribute(`data-sticky-offset`));
    if (isNaN(offset)) offset = 0;

    if (y >= offset) {
      target.classList.remove('Sticky');
      shell.style.removeProperty('position');
      shell.style.removeProperty('top');
    } else {
      target.classList.add('Sticky');
      shell.style.setProperty('position', 'fixed');
      shell.style.setProperty('top', `${offset}px`);
    }
  }
}

const UpdateDisplay = () => {
  updateFixedShell();
  updateStickyBox();
};

const initAos = () => {
  // https://michalsnik.github.io/aos/
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 400, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  });
};

window.addEventListener('DOMContentLoaded', (event) => {
  ModalControl.init();
  UpdateDisplay();

  initAos();
});

window.addEventListener('resize', (evt) => {
  UpdateDisplay();
});

window.addEventListener('scroll', (evt) => {
  UpdateDisplay();
});
