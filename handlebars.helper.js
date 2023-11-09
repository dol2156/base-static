const path = require('path');
const fs = require('fs');
module.exports = {
  BAR: function () {
    return 'BAR!';
  },

  /**
   * json 파일 읽어서 @root 의 node_name 에 담아준다.
   * {{JSON 'SampleData' '/assets/json/SampleData.json'}}
   * @param node_name
   * @param json_path
   * @constructor
   */
  JSON: function (node_name, json_path) {
    const jsonPath = path.join(__dirname, json_path);
    const renderData = JSON.parse(fs.readFileSync(jsonPath));
    this[node_name] = renderData;
  },

  /**
   * n 회 반복
   * ex)
   * {{#LOOP 10}}
   *   {{index}} {{number}} {{digit}}
   * {{/LOOP}}
   */
  LOOP: function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) accum += block.fn({ index: i, number: i + 1, digit: (i + 1).toString().padStart(2, '0') });
    return accum;
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

  /**
   * active_index 에 해당되면 문자열 반환
   * {{ON 0}}
   * 또는
   * {{ON 0 '_on'}}
   */
  ON: function (active_index, custom_str, options) {
    const { index } = this;
    if (typeof custom_str != 'string') custom_str = 'On';
    const result = active_index === index ? custom_str : '';
    return result;
  },
};
