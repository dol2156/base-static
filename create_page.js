
const fs = require('fs');
const beautify = require('js-beautify').js;
const FileUtil = require('./file_util.js');
const API_URL = require('./API_URL.js');

let file_text = '';

(async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    file_text += `var MENU_DATA_ORI = ${JSON.stringify(json)};\n`;

    createHbsFile(json);
  } catch (error) {
    console.log(error);
  }
})();

/**
 * 특수문자 및 공백 제거
 * @param string
 * @returns {string}
 */
function reaplceStr(string) {
  if (typeof string == 'number') string = string.toString();
  // eslint-disable-next-line
  const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
  return string.replace(regExp, '');
}

function createHbsFile(menu_data) {
  const arr = [];
  // 진행 단계가 완료가 아닌것 필터
  menu_data.forEach((obj, idx) => {
    if (obj.진행단계 != '완료') {
      arr.push(obj);
    }
  });

  const arr2 = [];
  // PAGE 가 있는것 필터
  arr.forEach((obj, idx) => {
    if (obj.PAGE.trim()) {
      arr2.push(obj);
    }
  });
  
  arr2.forEach((obj, idx) => {
    createFile(obj.PAGE, obj?.뎁스1 || obj?.뎁스2 || obj?.뎁스3);
  });

  function createFile(page_name, page_title) {
    const file_path = `./hbs/page/${page_name}.hbs`;

    // 파일이 없는지 검사한 후
    const is_exist = FileUtil.isExist(file_path);
    if (is_exist) return;

    // hbs/page/_Base.hbs 읽어와서
    let file_text = FileUtil.readFile(`./hbs/page/_Base.hbs`);
    let regExp = new RegExp('문서제목', 'gi');
    file_text = file_text.replace(regExp, page_title);

    // ./hbs/page/${page_name}.hbs 파일 쓰기
    FileUtil.writeFile(file_path, file_text);
  }
}
