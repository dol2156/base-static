module.exports = {
  BAR: function () {
    return 'BAR!';
  },

  /**
   * String to Array
   * EACH 와 같이 쓰임
   * {{#EACH (ARR '🍎|🍍|🥝|🍇|🍈')}}
   */
  ARR: function (array_str, options) {
    let arr;
    if (array_str) {
      arr = array_str.split('|');
    } else {
      arr = false;
    }
    return arr;
  },

  /**
   * 루프
   * {{#EACH array}} OR {{#EACH (ARR '🍎|🍍|🥝|🍇|🍈')}}
   *   <div>
   *     {{obj}}
   *   </div>
   * {{/EACH}}
   */
  EACH: function (data_list, options) {
    let accum = '';
    if (arguments.length > 1 && data_list) {
      //console.log(data_list);
      data_list.forEach((obj, idx) => {
        const obj_result = { obj: obj, index: idx, number: idx + 1, digit: (idx + 1).toString().padStart(2, '0') };

        accum += options.fn(obj_result);
      });
    }
    return accum;
  },
};
