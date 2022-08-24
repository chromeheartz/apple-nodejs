// 서버를 open하기위한 기본셋팅
// express를 첨부해주세요
const express = require('express');
// 첨부한 라이브러리를이용해서 객체를만듬
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

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

  ** 콜백함수

  .get()에 들어가는 파라미터중 하나가 function(){}이다.
  함수안에 함수를 콜백함수라고한다.
  순차적으로 실행하고싶을때 쓴다. 

  현재 콜백함수에는 요청과 응답이 들어가는데
  .get('경로', function(요청내용,응답할방법){})
  req를 콘솔로 찍어보면 어떤 정보를 가지고 요청하는지 담겨있다.
  res는 어떤식으로 응답할지를 정해주는것.

  es6 문법도 이용가능
  

*/

// /하나만 남겨주면 홈임.
app.get('/', (req, res) => {
  // sendFile(보낼파일경로)를 쓰면 파일을 브라우저에 보낼수있다
  // __dirname 은 현재 파일경로를 뜻한다.
  res.sendFile(__dirname + '/index.html')
});

/*

  <form action="/add" method="post">

  method는 정보를 어떤형태로 전달할것이냐 라는 뜻.
  action은 요청을 할 경로.
  * /add 경로로 post요청을한다.

  post요청 처리기계를 만들려면 app.post()
  post로 경로 요청,응답을 적어준 후에
  send를 해서 띄워보면 잘 출력이되는데 그럼
  우리가 Input에 적은 정보는 어디있을까 
  요청이라는 파라미터에 들어가있다. 쉽게 꺼내서 쓰려면 라이브러리가 필요하다

  ** body-parser

  이 라이브러리는 Html안에 적힌 요청데이터(body)해석을 도와준다.
  form데이터의 경우 input들에 name을 써준다
  서버에서 input을 구분하기 위해 name을 쓰는것
  콘솔로찍어보면 서버 터미널에 정보가 들어오게된다.

  * 보낸 정보를 해석하려면 요청.body만 쓰면 데이터 수신가능
  req.body만 하면 객체형으로 들어온다

  여기까지가 서버에 정보를 보내는법.

*/

app.post('/add', (req, res) => {
  res.send('전송완료')
  // 서버창에 데이터가 전달이된다.
  console.log(req.body.title)
})