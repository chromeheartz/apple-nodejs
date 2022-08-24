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