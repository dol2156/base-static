const express = require('express');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000; // 변경 가능한 포트 번호
const viewsPath = 'views';

// Handlebars.js 설정
app.engine(
  'hbs',
  exphbs.create({
    extname: 'hbs',
    helpers: {
      //전역 헬퍼등록
      timeago: function () {
        return 'timeago';
      },
    },
  }).engine,
);
app.set('view engine', 'hbs');

// 정적 파일 제공을 위한 미들웨어 설정
app.use('/assets', express.static('assets'));

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
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    //console.log(`fileContent == `, fileContent);

    // Handlebars.js 템플릿 렌더링
    res.render('test');
  } else {
    res.send('요청하신 페이지를 찾을 수 없습니다.');
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
