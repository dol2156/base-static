const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

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

  /**
   * node_에 값이 있나 체크 후 경고
   * {{NULL_CHECK 'id'}}
   */
  NULL_CHECK: function (node_name, location_info, options) {
    const data = this[node_name];
    if (typeof data === 'undefined') {
      console.error(`${location_info} : ${node_name} 의 값이 지정되어 있지 않습니다.`);
    }
  },

  /**
   * Object 에 노드 추가
   * {{VAR this 'NAME' 'ksm'}}
   */
  VAR: function (object, node_name, value, options) {
    object[node_name] = value;
  },

  /**
   * xlsx 파일 json 루프
   */
  EACH_XLSX: function (xlsx_file_name, options) {
    const workbook = XLSX.readFile(`./assets/xlsx/${xlsx_file_name}.xlsx`);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data_list = XLSX.utils.sheet_to_json(worksheet);

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
   * 조건문 받아서 Boolean 반환
   * {{#if (IF this '==' true)}}
   *   <div>TRUE</div>
   * {{else}}
   *   <div>FALSE</div>
   * {{/if}}
   */
  IF: function (v1, condition, v2, options) {
    if (
      eval(`v1
      ${condition}
      v2`)
    ) {
      // return options.fn(this);
      return true;
    } else {
      // return options.inverse(this);
      return false;
    }
  },
};
