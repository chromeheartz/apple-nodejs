// 서버를 open하기위한 기본셋팅
// express를 첨부해주세요
const express = require('express');
// 첨부한 라이브러리를이용해서 객체를만듬
const app = express();

// listen이라는 함수를 쓰면 내 컴퓨터에 서버를 열 수 있다.
// listen(서버띄울포트번호, 띄운 후 실행할 코드)
app.listen(7777, function(){
  console.log('listening on 7777')
});

// 터미널에서 node server.js  (main으로걸어주었던것을 키면 listening on xxxx가 나옴)

// app.get()은 두개의 파라미터가 들어간다. 경로, 띄워줄함수  function에는 (요청 request,응답 response)
// 응답.send('.....')
app.get('/beauty', function(req, res){
  res.send('뷰티페이지에욤')
});

/*
  현재 수정하면 다시 저장하고 다시 서버를 재실행해야하는데 자동화시킬수있다.
  npm install -g nodemon
  nodemon이라는 라이브러리인데 저장이발생하면 자동으로 껐다가 켜줌
  -g는 컴퓨터 모든 폴더에서 이용가능하게해주세요 라는 뜻.

  nodemon server.js 로 킬 수 있음.
*/

// /하나만 남겨주면 홈임.
app.get('/', function(req, res){
  // sendFile(보낼파일경로)를 쓰면 파일을 브라우저에 보낼수있다
  // __dirname 은 현재 파일경로를 뜻한다.
  res.sendFile(__dirname + '/index.html')
});
