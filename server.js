const ip = require('ip');
const express = require('express');
const livereload = require('connect-livereload');
const livereloadServer = require('livereload');
const fs = require('fs');
const FileUtil = require('./file_util.js');
const path = require('path');
const exphbs = require('express-handlebars');
const hbsHelpers = require('./handlebars.helper.js');
const app = express();
const port = 3000; // 변경 가능한 포트 번호
const 뷰파일폴더이름 = 'views';
const 변경감지할_확장자 = ['hbs', 'css', 'js', 'svg', 'png', 'jpg', 'json'];

// 정적 파일 제공을 위한 미들웨어 설정
app.use('/assets', express.static('assets'));

// Handlebars.js 설정
app.set('views', path.join(__dirname, 뷰파일폴더이름));
app.engine(
  'hbs',
  exphbs.create({
    extname: 'hbs',
    helpers: hbsHelpers,
  }).engine,
);
app.set('view engine', 'hbs');

// Live Reload 미들웨어 추가
app.use(livereload());

// Live Reload 서버 실행
const liveReloadServer = livereloadServer.createServer({
  exts: 변경감지할_확장자, // 감지할 파일 확장자 지정
  exclusions: ['./dist/**'],
});
liveReloadServer.watch(__dirname); // 모든 폴더 감지

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

app.get('*', (req, res) => {
  let requestedPath = req.path;

  // 루트 경로에 대한 요청 처리
  if (requestedPath == '/') requestedPath = '/index';

  const filePath = path.join(__dirname, 뷰파일폴더이름, requestedPath + '.hbs');

  if (fs.existsSync(filePath)) {
    const viewName = requestedPath.replace(/\//gi, '');

    const hbsData = require(path.join(__dirname, 'assets/data/HBS_DATA.js'));

    const jsonPath = path.join(__dirname, 'assets/json/RenderData.json');
    const renderData = JSON.parse(fs.readFileSync(jsonPath));
    renderData.HBS_DATA = hbsData;

    res.render(viewName, renderData, (err, renderedHTML) => {
      if (err) {
        console.error(err);
        return;
      }
      const savePath = path.join(__dirname, 'dist', viewName + '.html');
      fs.writeFile(savePath, renderedHTML, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        //console.log(`HTML 파일이 ${savePath}에 저장되었습니다.`);
      });
      res.send(renderedHTML);
    });
  } else {
    res.send(`${filePath} : 요청하신 페이지를 찾을 수 없습니다.`);
  }
});

// 서버 시작
app.listen(port, () => {
  setTimeout(() => {
    console.log(`http://localhost:${port}`);
    console.log(`http://${ip.address()}:${port}`);
  }, 2000);
});
