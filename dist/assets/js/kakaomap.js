// 카카오개발자센터 - https://developers.kakao.com/
// 카카오 지도 Web API - https://apis.map.kakao.com/web/guide/
let INIT_LAT = 37.3957122;
let INIT_LNG = 127.1105181;
let LOCATION_LIST, KakaoMap;
const KakaoMapUtil = {};
/**
 * 장소 데이터 수신
 * @returns {any}
 */
KakaoMapUtil.loadJson = (map_json_url) => {
  let json;
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
        json = this.responseText;
      } else {
        // error
        const msg = '404 Not Found';
        console.log(`%c${msg}%c${path}`, 'font-family:D2Coding; border:1px solid black; background:red; color:white; padding:5px; font-size:12px;', 'font-family:D2Coding; background-color:black; border:1px solid black; border-left:none; padding:5px; color:yellow; font-size:12px;');
        json = msg + '<br/>' + path;
      }
    }
  };
  xhttp.open('GET', map_json_url, false);
  xhttp.send();

  return JSON.parse(json);
};

/**
 *
 */
KakaoMapUtil.drawMap = () => {
  
  const first_location = LOCATION_LIST[0];
  if (first_location) {
    INIT_LAT = first_location.위도;
    INIT_LNG = first_location.경도;
  }

  // 맵 생성
  KakaoMap = creatMap();

  // 마커 생성
  LOCATION_LIST.forEach((geo, idx) => {
    const marker = createMarker(geo);
  });

  /* 2023-08-11 :: START :: 중심이동 */
  window.addEventListener('resize', (evt) => {
    const latlng = new kakao.maps.LatLng(INIT_LAT, INIT_LNG);
    KakaoMap.setCenter(latlng); // 곧장 이동
  });

  /* // 2023-08-11 :: END :: 중심이동 */

  /**
   * 지도 생성
   * https://apis.map.kakao.com/web/documentation/#Map
   */
  function creatMap() {
    var container = document.getElementById('KakaoMap'); //지도를 담을 영역의 DOM 레퍼런스

    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(INIT_LAT, INIT_LNG), //지도의 중심좌표.
      level: 4, //지도의 레벨(확대, 축소 정도)
    };

    return new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴;
  }

  /**
   * 마커 생성
   * https://apis.map.kakao.com/web/documentation/#Marker
   */
  function createMarker(geo) {
    if (typeof geo === 'undefined') {
      console.error('[kakaomap.js : createMarker] => geo is undefined');
      return;
    }

    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'; // 마커이미지의 주소입니다
    var imageSize = new kakao.maps.Size(64, 69); // 마커이미지의 크기입니다
    var imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 마커가 표시될 위치입니다
    var markerPosition = GetLatLng(geo);

    // 마커를 생성합니다
    var mk = new kakao.maps.Marker({
      position: markerPosition,
      //image: markerImage, // 마커이미지 설정
    });

    const co = createCustomOverlay(geo);

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(mk, 'click', function () {
      // 커스텀 오버레이 띄우기
      if(co){
        if(co.getVisible()){
          co.setVisible(false);
        }else{
          co.setVisible(true);
        }
      }
    });

    // 마커가 지도 위에 표시되도록 설정합니다.
    mk.setMap(KakaoMap);

    // 아래 코드는 지도 위의 마커 안보이게 설정합니다.
    // mk.setMap(null);

    return mk;
  }

  /**
   * 커스텀 오버레이 생성
   * https://apis.map.kakao.com/web/documentation/#CustomOverlay
   * https://apis.map.kakao.com/web/guide/#mapurl
   */
  function createCustomOverlay(geo) {
    const { PLACE_NAME, ADDRESS_NAME, OVERLAY_LINK, OVERLAY_IMG } = geo;
    
    // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    // const content = `
    //   <div class="customoverlay">
    //     <img src="https://newsimg.sedaily.com/2020/04/29/1Z1NWYX4JP_1.jpg" alt="" />
    //     <a href="https://map.kakao.com/link/search/${ADDRESS_NAME}" target="_blank">
    //       <span class="title">${PLACE_NAME}</span>
    //     </a>
    //   </div>
    //   `;
    if (OVERLAY_IMG) {
      const content = `
      <div class="customoverlay">
        <a href="${OVERLAY_LINK}" target="_blank">
          <img class="w-[200px] pc:w-[400px]" style="max-width:none;" src="${OVERLAY_IMG}" alt="" />
        </a>
      </div>
      `;
      // 커스텀 오버레이가 표시될 위치입니다
      var position = GetLatLng(geo);

      // 커스텀 오버레이를 생성합니다
      var customOverlay = new kakao.maps.CustomOverlay({
        map: KakaoMap,
        position: position,
        content: content,
        // yAnchor: 1,
        xAnchor: 0,
        yAnchor: 0,
        zIndex: 3,
      });

      // 가려두기
      customOverlay.setVisible(false);

      return customOverlay;
    } else {
      return false;
    }
  }
};

/**
 * 지도 이동
 */
KakaoMapUtil.moveToMap = (place_name) => {
  const geo = LOCATION_LIST.filter((obj) => {
    return place_name == obj.PLACE_NAME;
  })[0];
  const latlng = GetLatLng(geo);
  INIT_LAT = geo.위도;
  INIT_LNG = geo.경도;
  KakaoMap.panTo(latlng); // 부드럽게 이동
};

/**
 * 지도 초기화
 */
KakaoMapUtil.init = (map_json_url) => {
  const json = KakaoMapUtil.loadJson(map_json_url);
  let { JAVASCRIPT_API_KEY, GEO_DATA } = json;
  LOCATION_LIST = GEO_DATA;

  // 지도 셋팅 시작
  // KakaoMapUtil.loadGeoData();
  KakaoMapUtil.drawMap();
};

function GetLatLng(geo) {
  const lat = geo.위도;
  const lng = geo.경도;
  return new kakao.maps.LatLng(lat, lng);
}

