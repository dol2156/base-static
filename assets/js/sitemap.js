(() => {
  const el_a_list = document.querySelectorAll(`#Sitemap > ul > li a[href]`);
  el_a_list.forEach((el_a, idx) => {
    el_a.addEventListener('click', (evt) => {
      const ct = evt.currentTarget;
      ct.classList.add('On');
    });
  });
})();

