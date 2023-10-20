/**
 * FullPageSwiper
 * @param swiper_id
 */
const initFullPageSwiper = (swiper_id) => {
  const pagination_progress = {
    el: `${swiper_id}-PagenationProgressbar`,
    type: 'progressbar',
    modifierClass: 'Pagenation-',
    progressbarFillClass: 'FillBar',
    renderProgressbar: function (className) {
      return `<div class="${className}"></div>`;
    },
  };

  const swiper_option = {
    // initialSlide : 3,
    direction: 'vertical',
    mousewheel: true,
    releaseOnEdges: true,
    slidesPerView: 1, // 슬라이드의 수가 slidesPerView의 값 2배 이상이어야함. slidesPerView, slidesPerGroup 함께 설정 필요.
    slidesPerGroup: 1,
    loop: false,
    pagination: pagination_progress,
    // autoplay: {
    //   delay: 1000,
    //   disableOnInteraction: false,
    // },
    init: false,
    // grabCursor: true,
  };

  let swiper = new Swiper(swiper_id, swiper_option);

  swiper.on('init', function (swiper) {
    setCurrentSectionIdx();
    setAnimateDealy();

    // 첫화면 진입때만 애니메이션 작동 안하게
    const el_first_active_slide = swiper.slides[0];
    if (el_first_active_slide.hasClass('swiper-slide-active')) {
      el_first_active_slide.addClass('FirstPlay');
      setTimeout(() => {
        el_first_active_slide.removeClass('FirstPlay');
      }, 1000);
    }
  });

  swiper.on('slideChange', function (swiper) {
    setCurrentSectionIdx();
    setAnimateDealy();
  });

  swiper.on('resize', function (swiper) {
    setFooterSnap(swiper);
  });

  swiper.on('beforeTransitionStart', function (swiper) {
    setFooterSnap(swiper);
  });

  function setFooterSnap(swiper) {
    // 슬라이드가 2개도 안되면 풀페이지 스크롤을 할 이유가 없지 리턴 시켜
    if (swiper.slides.length < 2) return;

    const last_idx = swiper.slides.length - 1;
    const el_last_slide = swiper.slides[last_idx];
    const ls_hei = el_last_slide.outerHeight();
    const second_last_snap = swiper.snapGrid[last_idx - 1];
    const cal_last_snap = second_last_snap + ls_hei;
    swiper.snapGrid[last_idx] = cal_last_snap;
  }

  swiper.init();

  function setAnimateDealy() {
    const el_swiper = swiper.el;

    // 슬라이드 방향 체크해서
    // 트렌지션 객체들 딜레이 각각 설정해주기
    if (swiper.previousIndex - swiper.activeIndex > 0) {
      el_swiper.css('--ori-top', `-50px`);
    } else {
      el_swiper.css('--ori-top', `50px`);
    }

    const el_slide = swiper.slides[swiper.activeIndex];
    const el_dov_list = el_slide.querySelectorAll(`[data-only-view]`);
    el_dov_list.forEach((el_dov, idx) => {
      const el_at_list = el_dov.querySelectorAll(`.AnimateTarget`);
      el_at_list.forEach((el_at, jdx) => {
        const k = 2;
        el_at.css('animation-delay', `${(jdx + 1) * k}00ms`);
      });
    });
  }

  function setCurrentSectionIdx() {
    const { realIndex } = swiper;
    const html = document.documentElement;
    html.attr(`data-current-section-idx`, realIndex);
  }
};