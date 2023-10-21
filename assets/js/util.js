const Util = {};

/**
 * 입력되는 컬러와 대비되어 잘 보이는 색상 반환
 * @param color_hex
 * @returns {string}
 * ex)
 * Util.getGoodColor('#ff0000');
 */
Util.getGoodColor = (color_hex) => {
  const c = color_hex.substring(1); // 색상 앞의 # 제거
  const rgb = parseInt(c, 16); // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff; // red 추출
  const g = (rgb >> 8) & 0xff; // green 추출
  const b = (rgb >> 0) & 0xff; // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // 색상 선택
  return luma < 127.5 ? 'white' : 'black';
};


