/**
 * 동기 HTML 로드
 * @param path
 * @param convert
 * @returns {*}
 * @constructor
 */
const Include = (path) => {
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

  document.write(html_str);
};
