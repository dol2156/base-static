/**
 * InputUi 초기 셋팅
 * @param trigger
 */
const initInputUi = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;

  // HasValue Control
  const el_inp = el_target.querySelector(`:scope > input`);

  el_inp.addEventListener('keyup', (evt) => {
    updateDisplay();
  });

  el_inp.addEventListener('focus', (evt) => {
    el_target.addClass('Focus');
    el_target.focus();
  });

  el_inp.addEventListener('blur', (evt) => {
    el_target.removeClass('Focus');
    el_target.blur();
  });

  updateDisplay();

  // ResetBtn Control
  const el_reset_btn = el_target.querySelector(`.ResetBtn`);
  if (el_reset_btn) {
    el_reset_btn.addEventListener('click', (evt) => {
      el_inp.value = '';
      updateDisplay();
    });
  }

  /**
   *
   */
  function updateDisplay() {
    const value = el_inp.value;

    if (!value) {
      el_target.removeClass('HasValue');
    } else {
      el_target.addClass('HasValue');
    }
  }
};

/**
 * HScrollGradientBox 가로 스크롤 그라디언트 박스 초기 셋팅
 * @param trigger
 */
const initHScrollGradientBox = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;

  const el_track = el_target.querySelector(`.Track`);
  el_track.addEventListener('scroll', (evt) => {
    updateDisplay();
  });
  updateDisplay();

  function updateDisplay() {
    const sw = el_track.scrollWidth;
    const sl = Math.ceil(el_track.scrollLeft);
    const k = sw - sl;

    if (k == sw) {
      el_target.classList.add('Start');
    } else {
      el_target.classList.remove('Start');
    }

    if (k <= el_track.clientWidth) {
      el_target.classList.add('End');
    } else {
      el_target.classList.remove('End');
    }
  }
};

/**
 * <img onerror='initAutoCompleteBox(`#autoComplete`)' src=''/>
 * @param id
 */
const initAutoCompleteBox = (id) => {
  // https://tarekraafat.github.io/autoComplete.js/#/
  // https://codepen.io/tarekraafat/pen/rQopdW

  const config = {
    selector: id,
    placeHolder: `검색어를 입력하세요.`,
    data: {
      src: async () => {
        try {
          const json_url = `https://tarekraafat.github.io/autoComplete.js/demo/db/generic.json`;
          const source = await fetch(json_url);
          const data = await source.json();
          return data;
        } catch (error) {
          return error;
        }
      },
      keys: ['food', 'cities', 'animals'],
    },
    resultsList: {
      element: (list, data) => {
        if (!data.results.length) {
          // Create "No Results" message element
          const message = document.createElement('div');
          // Add class to the created element
          message.setAttribute('class', 'no_result');
          // Add message text content
          message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
          // Append message element to the results list
          list.prepend(message);
        } else {
          const info = document.createElement('div');
          info.classList.add('ResultCountInfo');
          if (data.results.length > 0) {
            info.innerHTML = `Displaying <strong>${data.results.length}</strong> out of <strong>${data.matches.length}</strong> results`;
          }
          list.prepend(info);
        }
      },
      noResults: true,
      maxResults: 9999,
      tabSelect: true,
    },
    submit: true,
    resultItem: {
      element: (item, data) => {
        // Modify Results Item Style
        item.style = 'display: flex; justify-content: space-between;';
        // Modify Results Item Content
        item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        ${data.match}
      </span>
      <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
        ${data.key}
      </span>`;
      },
      highlight: true,
    },
    events: {
      input: {
        focus: () => {
          if (autoCompleteJS.input.value.length) autoCompleteJS.start();
        },
      },
    },
  };

  const autoCompleteJS = new autoComplete(config);

  const el_ac = document.querySelector(id);
  const el_acb = el_ac.closest('.AutoCompleteBox');
  const el_btn_remove_value = el_acb.querySelector(`.BtnRemoveInputValue`);
  const el_btn_search = el_acb.querySelector(`.BtnGoSearch`);

  // 검색 결과 리스트 아이템 선택
  el_ac.addEventListener('selection', function (event) {
    // console.log(event.detail);
    const value = event.detail.selection.value;
    el_ac.value = value;
  });

  el_ac.addEventListener('keyup', (evt) => {
    updateDisplay();
  });

  // 검색어 삭제 버튼 클릭
  el_btn_remove_value.addEventListener('click', (evt) => {
    // 검색 인풋 값 삭제
    el_ac.value = '';
    updateDisplay();
  });

  // 검색 돋보기 버튼 클릭
  el_btn_search.addEventListener('click', (evt) => {
    console.log(`el_ac.value == `, el_ac.value);
  });

  updateDisplay();
  function updateDisplay() {
    if (el_ac.value.length > 0) {
      el_acb.classList.add('HasValue');
    } else {
      el_acb.classList.remove('HasValue');
    }
  }
};

/**
 *
 * @param trigger
 */
const initWheelDownHScrollWrap = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const el_inner = el_target.querySelector(`:scope > .Inner`);
  const el_inner_child = el_inner.querySelectorAll(`:scope > div`);

  window.addEventListener('resize', (evt) => {
    updateDisplay();
  });

  window.addEventListener('scroll', (evt) => {
    updateDisplay();
  });

  el_inner.addEventListener('scroll', (evt) => {
    checkHScrollActive();
  });

  updateDisplay();
  function updateDisplay() {
    const { scrollWidth, clientWidth, clientHeight } = el_inner;
    const wrapHeight = scrollWidth + clientHeight - clientWidth;
    const scrollRange = scrollWidth - clientWidth;

    el_target.height(wrapHeight);

    const top = el_target.getBoundingClientRect().top;
    const k = -1 * top;
    el_inner.scrollLeft = k;
  }

  function checkHScrollActive() {
    el_inner_child.forEach((el_child, idx) => {
      const left = el_child.getBoundingClientRect().left;
      const k = left;

      if (k <= 0) {
        el_child.addClass('On');
      } else {
        el_child.removeClass('On');
      }
    });
  }
};

/**
 * CollapseAbleBox 클래스를 가진 박스를 세로로 접었다 펼쳤다 되도록 셋팅
 * On 클래스로 컨트롤
 * <div class="ChildList CollapseAbleBox On">
 *   <img onerror="initCollapseAbleBox(this);" src=""/>
 * </div>
 */
const initCollapseAbleBox = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;

  // target 크기 변경 감지
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      // console.log('크기가 변경되었습니다:', width, height);
      updateDisplay();
    }
  });
  resizeObserver.observe(el_target);

  function updateDisplay() {
    const hei = el_target.scrollHeight;
    el_target.style.maxHeight = `${hei}px`;
  }
};

/**
 *
 * @param trigger
 */
const initTreeMenu = (trigger, close_other=false) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const el_list_label = el_target.querySelectorAll(`.Label`);
  el_list_label.forEach((el_label, idx) => {
    el_label.addEventListener('click', (evt) => {
      const ct = evt.currentTarget;
      const el_li = ct.closest('li');
      
      // Other Deactive
      const el_list_othger_li = el_li.siblings();
      el_list_othger_li.forEach((el_other_li, idx) => {
        if(close_other){
          el_other_li.removeClass('On');
          const el_child_list = el_other_li.querySelectorAll(`:scope > .ChildList`);
          if(el_child_list){
            el_child_list.forEach((el_child, idx) => {
              el_child.removeClass('On');
            });
          }
        }
      });

      // target Active
      el_li.toggleClass('On');
      const el_child_list = el_li.querySelector(`.ChildList`);
      if (el_child_list) el_child_list.toggleClass('On');
      
    });
  });
};
