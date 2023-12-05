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
    el_target.classList.add('Focus');
    el_target.focus();
  });

  el_inp.addEventListener('blur', (evt) => {
    el_target.classList.remove('Focus');
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

  // EyeBtn Control
  const el_eye_btn = el_target.querySelector(`.EyeBtn`);
  if (el_eye_btn) {
    el_eye_btn.addEventListener('click', (evt) => {
      if (el_inp.type == 'password') el_inp.type = 'text';
      else el_inp.type = 'password';
    });
  }

  /**
   *
   */
  function updateDisplay() {
    const value = el_inp.value;

    if (!value) {
      el_target.classList.remove('HasValue');
    } else {
      el_target.classList.add('HasValue');
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

    $(el_target).height(wrapHeight);
    $(el_inner).height(window.innerHeight);

    const top = el_target.getBoundingClientRect().top;
    const k = -1 * top;
    el_inner.scrollLeft = k;
  }

  function checkHScrollActive() {
    el_inner_child.forEach((el_child, idx) => {
      const left = el_child.getBoundingClientRect().left;
      const k = left - window.innerWidth / 2;

      if (k <= 0) {
        el_child.classList.add('On');
      } else {
        el_child.classList.remove('On');
      }
    });
  }
};

/**
 * CollapseAbleBox 클래스를 가진 박스를 세로로 접었다 펼쳤다 되도록 셋팅
 * On 클래스로 컨트롤
 * <img onerror="initCollapseAbleBox(this);" src=""/>
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
 * 트리메뉴 작동
 * <img onerror="initTreeMenu(this);" src=""/>
 * <img onerror="initTreeMenu(this, true);" src=""/>
 * @param trigger
 */
const initTreeMenu = (trigger, close_other = false) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;

  const $list_label = $(el_target).find('> ul > li > .Label');
  $list_label.on(`click`, (evt) => {
    const ct = evt.currentTarget;
    const $li = $(ct).closest('li');

    // Other Deactive
    if (close_other) {
      const $othger_li = $li.siblings();
      $othger_li.removeClass('On');
      $othger_li.find(`.ChildList`).removeClass('On');
    }

    // target Active
    $li.toggleClass('On');
    $li.find(`> .ChildList`).toggleClass('On');
  });
};

/**
 *
 * @param trigger
 */
const initSelectBox = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $target = $(el_target);
  const $select_box = $target.find('> select');

  $target.on(`change`, (evt) => {
    updateDisplay();
  });

  updateDisplay();

  function updateDisplay() {
    const selected_value = $select_box.val();

    if (selected_value) {
      $select_box.addClass('HasValue');
    } else {
      $select_box.removeClass('HasValue');
    }

    $select_box.attr('data-value', selected_value);
  }
};

/**
 *
 * @param trigger
 */
const initDropdown = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $target = $(el_target);
  const $input = $target.find('input[type="hidden"]');
  const $head = $target.find('.Head');
  const $body = $target.find('.Body');
  const $opt_btn_list = $body.find('.OptionBtn');

  // Outside Click
  const outsideClick = new useOutsideClick(el_target, () => {
    $target.removeClass('On');
  });

  // Head Click
  $head.on(`click`, (evt) => {
    $target.toggleClass('On');
  });

  // Option Select
  $opt_btn_list.on(`click`, (evt) => {
    const $opt_btn = $(evt.currentTarget);
    $opt_btn.addClass('Selected');
    $opt_btn.siblings().removeClass('Selected');

    updateDisplay();
  });

  updateDisplay();

  function updateDisplay() {
    const $opt_btn = $body.find('.OptionBtn.Selected');
    if ($opt_btn.length < 1) return;

    const text = $opt_btn.text();
    const value = $opt_btn.data('value');
    $head.text(text);
    $input.val(value);

    $target.removeClass('On');
  }
};

/**
 * 특정 영역 밖을 클릭 했을 때 감지하기
 * https://gurtn.tistory.com/203
 */
class useOutsideClick {
  ref = null;
  onClickOutside = null;

  constructor(ref, onClickOutside) {
    this.ref = ref;
    this.onClickOutside = onClickOutside;

    document.addEventListener('mouseup', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.ref && !this.ref?.contains?.(event.target)) {
      this.onClickOutside(this);
    }
  };

  removeClickListener = () => {
    document.removeEventListener('mouseup', this.handleClickOutside);
  };
}

/**
 * 탭버튼 컨트롤
 * @param trigger
 * @param tab_child_list_id
 */
const initTabChildControl = (trigger, tab_child_list_id) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $target = $(el_target);
  const $tab_btn = $target.find('.TabButton');
  $tab_btn.on(`click`, (evt) => {
    const $ct = $(evt.currentTarget);
    const $tab_btns = $ct.closest('.TabButtonList').find('.TabButton');
    const idx = $tab_btns.index($ct);
    $tab_btns.removeClass('On');
    $tab_btns.eq(idx).addClass('On');

    const $tab_child_list = $(`.TabChildList[data-id='${tab_child_list_id}']`);
    const $tab_childs = $tab_child_list.find('> .TabChild');
    $tab_childs.removeClass('On');
    $tab_childs.eq(idx).addClass('On');
  });
};

/**
 * 더보기 리스트 컨트롤
 * @param trigger
 */
const initMoreViewList = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $target = $(el_target);
  let current_cnt;
  const more_step = parseInt($target.attr('data-current'));
  updateDisplay();

  const $more_btn = $target.find('.MoreViewBtn');
  $more_btn.on(`click`, (evt) => {
    current_cnt = current_cnt + more_step;
    $target.attr('data-current', current_cnt);
    updateDisplay();
  });

  function updateDisplay() {
    current_cnt = parseInt($target.attr('data-current'));
    const $li = $target.find('> ul > li');
    let $prev_li;
    if ($li.length - 1 >= current_cnt) {
      const $target_li = $li.eq(current_cnt);
      $prev_li = $target_li.prevAll();
      $prev_li.addClass('On');
    } else {
      $li.addClass('On');
      $more_btn.hide();
    }
  }
};

/**
 *
 * @param trigger
 */
const initNumberAniBox = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $target = $(el_target);

  const startNumber = 0;
  const endNumber = parseInt($target.text());
  const duration = 1 * 1000;

  // https://api.jquery.com/animate/
  $target.animate(
    {
      count: endNumber,
    },
    {
      easing: 'linear',
      duration: duration,
      step: (now) => {
        now = Math.floor(now);
        $target.text(now);
      },
      complete: () => {
        //console.log('complete');
      },
    },
  );
};

const toggleDashboardMenu = () => {
  $(`#Page`).toggleClass('LeftSideMenuClose');
  window.localStorage.setItem('LeftSideMenuClose', $(`#Page`).hasClass('LeftSideMenuClose'));
};

/**
 *
 */
const initLeftSideMenuVisible = () => {
  const is_close = window.localStorage.getItem('LeftSideMenuClose');
  if (is_close == 'true') $(`#Page`).addClass('LeftSideMenuClose');
};

/**
 *
 * @param trigger
 */
const initLeftSideMenu = (trigger) => {
  if (typeof trigger === 'undefined') return;
  const el_target = trigger.parentElement;
  const $menu_list = $(el_target);
  const $has_child_li = $menu_list.find('> li.HasChild');
  const $a_arr = $has_child_li.find(`> a`);

  $a_arr.on(`click`, (evt) => {
    evt.preventDefault();
    const $ct = $(evt.currentTarget);
    const href = $ct.attr('href');
    const $li = $ct.closest('li');
    $li.toggleClass('On');
  });
};
