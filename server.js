const express = require('express');
const livereload = require('connect-livereload');
const livereloadServer = require('livereload');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');
const hbsHelpers = require('./handlebars.helper.js');
const app = express();
const port = 3000; // 변경 가능한 포트 번호
const viewsPath = 'views';

// 정적 파일 제공을 위한 미들웨어 설정
app.use('/assets', express.static('assets'));

// Handlebars.js 설정
app.set('views', path.join(__dirname, viewsPath));
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
  exts: ['json', 'html', 'css', 'js'], // 감지할 파일 확장자 지정
});
liveReloadServer.watch(__dirname); // 모든 폴더 감지

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// 루트 경로에 대한 요청 처리
app.get('/', (req, res) => {
  res.send('안녕하세요! 이것은 테스트용 웹 서버입니다.');
});

app.get('*', (req, res) => {
  const requestedPath = req.path;
  //console.log(`requestedPath == `, requestedPath);

  const filePath = path.join(__dirname, viewsPath, requestedPath + '.hbs');
  //console.log(`filePath == `, filePath);

  if (fs.existsSync(filePath)) {
    // Handlebars.js 템플릿 렌더링
    const viewName = requestedPath.replace(/\//gi, '');

    // 외부 JSON 파일 읽기
    const jsonPath = path.join(__dirname, 'assets/json/RenderData.json');
    const renderData = JSON.parse(fs.readFileSync(jsonPath));

    res.render(viewName, renderData);
  } else {
    res.send(`${filePath} : 요청하신 페이지를 찾을 수 없습니다.`);
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
