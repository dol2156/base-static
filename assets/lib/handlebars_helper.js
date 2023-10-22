Handlebars.logger.level = 'debug';


/**
 *
 * @param path
 * @param render_data
 */
Handlebars.write = (path, render_data) => {
  if (typeof render_data === 'undefined') render_data = {};
  render_data = Object.assign({ window }, render_data);
  const filename = path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');

  const el_script = document.currentScript;

  const html_str = Handlebars.loadHtml(path);

  //Compile the template
  const compiled_template = Handlebars.compile(html_str);

  //Render the data into the template
  let rendered = compiled_template(render_data);
  rendered = `<!-- ${filename} :: START ::  -->` + rendered + `<!-- // ${filename} :: END ::  -->`;

  document.write(rendered);

  el_script.remove();
};

/**
 * 동기 HTML 로드
 * @param path
 * @param convert
 * @returns {*}
 * @constructor
 */
Handlebars.loadHtml = (path, convert) => {
  let html_str;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    /*
    readyState
    0	UNSENT	Client has been created. open() not called yet.
    1	OPENED	open() has been called.
    2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
    3	LOADING	Downloading; responseText holds partial data.
    4	DONE	The operation is complete.
    */
    if (this.readyState == 4) {
      if (this.status == 200) {
        // success
        html_str = this.responseText;
      } else {
        // error
        const msg = '404 Not Found';
        console.log(`%c${msg}%c${path}`, 'font-family:D2Coding; border:1px solid black; background:red; color:white; padding:5px; font-size:12px;', 'font-family:D2Coding; background-color:black; border:1px solid black; border-left:none; padding:5px; color:yellow; font-size:12px;');
      }
    }
  };
  xhttp.open('GET', path, false);
  xhttp.send();

  if (convert) html_str = convert(html_str);

  return html_str;
};

/************************************************
 Helper Start
 *************************************************/

/**
 * n 회 반복
 * ex)
 * {{#LOOP 10}}
 *   {{index}} {{number}} {{digit}}
 * {{/LOOP}}
 */
Handlebars.registerHelper('LOOP', function (n, block) {
  var accum = '';
  for (var i = 0; i < n; ++i) accum += block.fn({ index: i, number: i + 1, digit: (i + 1).toString().padStart(2, '0') });
  return accum;
});

/**
 * 루프
 * {{#EACH array}} OR {{#EACH (ARR '🍎|🍍|🥝|🍇|🍈')}}
 *   <div>
 *     {{obj}}
 *   </div>
 * {{/EACH}}
 */
Handlebars.registerHelper('EACH', function (data_list, options) {
  let accum = '';
  if (arguments.length > 1 && data_list) {
    //console.log(data_list);
    data_list.forEach((obj, idx) => {
      const obj_result = { obj: obj, index: idx, number: idx + 1, digit: (idx + 1).toString().padStart(2, '0') };

      accum += options.fn(obj_result);
    });
  }
  return accum;
});

/**
 * String to Array
 * EACH 와 같이 쓰임
 * {{#EACH (ARR '🍎|🍍|🥝|🍇|🍈')}}
 */
Handlebars.registerHelper('ARR', function (array_str, options) {
  let arr;
  if (array_str) {
    arr = array_str.split('|');
  } else {
    arr = false;
  }
  return arr;
});

/**
 * active_index 에 해당되면 문자열 반환
 * {{ON 0}}
 * 또는
 * {{ON 0 '_on'}}
 */
Handlebars.registerHelper('ON', function (active_index, custom_str, options) {
  const { index } = this;
  if (typeof custom_str != 'string') custom_str = 'On';
  const result = active_index === index ? custom_str : '';
  return result;
});

/**
 * 데이터에 \n 이 들어있을때 <br/> 로 치환
 * ex) {{BR string}}
 */
Handlebars.registerHelper('BR', function (text, options) {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/(\r\n|\n|\r)/gm, '<br/>');
  text = text.replace(/\\n/g, '<br>');

  return new Handlebars.SafeString(text);
});

/**
 * 랜덤 난수
 * 1~10 중에서 랜덤 수
 * ex) {{RANDOM 1 10 }}
 */
Handlebars.registerHelper('RANDOM', function (MIN, MAX) {
  const k = Math.random() * (MAX - MIN) + MIN;
  return k;
});

/**
 * 랜덤 정수
 * 1~10 중에서 랜덤 뽑기
 * ex) {{INT 1 10 }}
 */
Handlebars.registerHelper('INT', function (MIN, MAX) {
  const k = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);

  return k;
});

/**
 * 수식과 숫자 x 를 받아서 반환
 * ex) {{MATH 'x+1' index}}
 * ex) {{MATH '(x%2===1)?1:(x%6===0)?1:2' number}}
 */
Handlebars.registerHelper('MATH', function (mathematics, x) {
  const result = eval(mathematics);
  return result;
});

/**
 * Object 에 노드 추가
 * {{VAR this 'NAME' 'ksm'}}
 */
Handlebars.registerHelper('VAR', function (object, node_name, value, options) {
  if (value.name !== 'VAR') {
    if (typeof object === 'object') {
      object[node_name] = value;
    }
  } else {
    // value 가 할당 되지 않았을 경우 노드명 할당
    object[node_name] = node_name;
  }
});

/**
 * 값 합치기
 * ex) {{ADD this 'NAME' (ADD 'ksm_' @key) }}
 */
Handlebars.registerHelper('ADD', function (v1, v2, options) {
  return v1 + v2;
});

/**
 * Partial 사용시에 경로를 동적으로 넣어야하는 경우가 있을때 사용
 * {{> (PATH obj.partial_path) }}
 */
Handlebars.registerHelper('PATH', function (path, options) {
  if (typeof path !== 'string') {
    return '';
  } else {
    return path;
  }
});

/**
 * 조건문 받아서 Boolean 반환
 * {{#if (IF this '==' true)}}
 *   <div>TRUE</div>
 * {{else}}
 *   <div>FALSE</div>
 * {{/if}}
 */
Handlebars.registerHelper('IF', function (v1, condition, v2, options) {
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
});

/**
 * if 문과 함께 사용하고 , condition에 배열 스트링 받아서 포함여부 Boolean 으로 반환
 * {{#if (CONATIN BTN1 '할인률순,인기순')}}
 */
Handlebars.registerHelper('CONATIN', function (p1, condition, options) {
  let is_contain = false;
  const arr = condition.split(',');

  let i = 0;
  let len_i = arr.length;
  while (i < len_i) {
    const obj = arr[i].trim();
    if (obj == p1) {
      is_contain = true;
      break;
    }
    ++i;
  }
  return is_contain;
});

/**
 * 기본값 할당
 * {{DF 'array' '1|2|3'}}
 */
Handlebars.registerHelper('DF', function (node_name, value, options) {
  const object = this;

  if (value.name !== 'DF') {
    if (typeof object === 'object') {
      if (typeof object[node_name] === 'undefined') {
        console.warn(`Handlebars : DF : ${node_name} : ${value}`);
        object[node_name] = value;
      } else {
        // console.warn(`Handlebars : DF : ${node_name}에 이미 값이 할당 되어 있습니다.`);
        // console.log(`${node_name} == `, object[node_name]);
      }
    }
  } else {
    // value 가 할당 되지 않았을 경우 경고
    console.error('Handlebars : DF : value 가 필요합니다.');
  }
});

/**
 * node_에 값이 있나 체크 후 경고
 * {{NULL_CHECK 'id'}}
 */
Handlebars.registerHelper('NULL_CHECK', function (node_name, location_info, options) {
  const data = this[node_name];
  if (typeof data === 'undefined') {
    console.error(`${location_info} : ${node_name} 의 값이 지정되어 있지 않습니다.`);
  }
});

/**
 * root 데이터 있나 없나 체크
 */
Handlebars.registerHelper('DV', function (options) {
  const root = this;

  const len = Object.keys(root).length;

  if (len == 1 && Object.keys(root)[0] == 'window') {
    return options.fn(this);
    // return true;
  } else {
    return options.inverse(this);
    // return false;
  }
});

/**
 * root 에 데이터 있나 확인 하고 없으면 node_name 할당
 * {{SAFE 'array' '1|2|3'}}
 */
Handlebars.registerHelper('SAFE', function (node_name, value, options) {
  if (typeof this[node_name] === 'undefined') {
    if (arguments.length == 2) {
      this[node_name] = node_name;
    }

    if (arguments.length == 3) {
      this[node_name] = value;
    }
  }
});

/**
 * var_list_str (변수 리스트) 받아서 하나라도 true 이면 true 반환
 * {{#OR 'price1|price2|price5'}}
 *   TRUE
 * {{else}}
 *   FALSE
 * {{/OR}}
 */
Handlebars.registerHelper('OR', function (var_list_str, options) {
  if (arguments.length != 2) return false;
  let reslut = false;
  const var_list = var_list_str.split('|');
  let i = 0;
  let len_i = var_list.length;
  while (i < len_i) {
    const node_name = var_list[i];
    const v = this[node_name];
    if (typeof v !== 'undefined') {
      reslut = true;
      break;
    }
    ++i;
  }
  if (reslut) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/**
 * var_list_str (변수 리스트) 받아서 모두 true 이면 true 반환
 * {{#AND 'txt1|txt2'}}
 *   TRUE
 * {{else}}
 *   FALSE
 * {{/AND}}
 */
Handlebars.registerHelper('AND', function (var_list_str, options) {
  if (arguments.length != 2) return false;

  let reslut = true;
  const var_list = var_list_str.split('|');

  let i = 0;
  let len_i = var_list.length;
  while (i < len_i) {
    const node_name = var_list[i];
    const v = this[node_name];
    if (typeof v === 'undefined') {
      reslut = false;
      break;
    }
    ++i;
  }
  console.log(`reslut == `, reslut);

  if (reslut) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/**
 * 동기식으로 JSON 받아와서 node_name 에 할당 해줌
 * {{JSON 'LOCATION_DATA' '/assets/json/kakaomap_location.json'}}
 */
Handlebars.registerHelper('JSON', function (node_name, json_url, options) {
  const json = JSON.parse(Handlebars.loadHtml(json_url));
  this[node_name] = json;
});

/**
 * sitemap 에서 사용되는 URL
 */
Handlebars.registerHelper('SITEMAP_URL', function (page_title, page_value, options) {
  if (page_value.indexOf(`http`) > -1) {
    return page_value;
  } else {
    return `/index.html?title=${page_title}&page=${page_value}`;
  }
});

/**
 */
Handlebars.registerHelper('JSONSTR', function (obj, options) {
  return new Handlebars.SafeString(JSON.stringify(obj));
});
