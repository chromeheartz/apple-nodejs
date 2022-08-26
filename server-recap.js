/*

*/
// 서버를 open하기위한 기본셋팅
// express를 첨부해주세요
const express = require('express');
// 첨부한 라이브러리를이용해서 객체를만듬
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://barnesquiat:<1q2w3e4r!@>@cluster0.uv1jq9q.mongodb.net/?retryWrites=true&w=majority', function(err, client){
  // 실제로 접속을 확인해볼것임 접속이완료가되면 nodejs 서버띄우는 코드를 실행


  // listen이라는 함수를 쓰면 내 컴퓨터에 서버를 열 수 있다.
  // listen(서버띄울포트번호, 띄운 후 실행할 코드)
  app.listen(7777, function(){
    console.log('listening on 7777')
  });
})


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

/*

  * API

  API는 무엇인가 
  Application Programming Interface
  프로그램간에 어떤식으로 통신할 수 있는지 통신규약을 뜻함. 요즘 쓰는 용어의 뜻은
  웹개발시 - 서버랑 고객간의 소통방법(요청방식) 내가 어떤식으로 서버랑 통신해야하는지 정리해놓은 문서 혹은 규약
  우리를 예로들면 .get('/write') 이 부분이 될것이다

  이런 API들을 어떤식으로 만들면 좋을지에 대한 답이 REST API 이다.

  *** REST API

  이전에는 API에 일관성도 없고 막짰기 때문에 URL이 어렵고 한 많은 어려움을 겪었다.
  HTTP 요청 시스템(GET,POST,PUT,DELETE)를 REST 원칙에 의해서 쓰면 좋을것같다 라고 개발한 개발자가있음.

  REST원칙 6개

  1. Uniform interface
  하나의 자료는 하나의 URL로. URL하나를 알면 둘을 알 수 있어야함.
  요청과 응답은 정보가 충분히 들어있어야한다. 

  2. Client-Server 역할구분
  브라우저는 요청만 할뿐, 서버는 응답만 할뿐. 
  각자의 역할을 잘 구분해야한다

  3. Stateless
  요청1과 요청2는 의존성이 없어야한다. 독립적인 존재로 다루어야한다.
  요청1이 성공했다고해서 그 결과로 요청2를 해야하고 이런것이 안된다.

  4. Cacheable
  서버에서 보내주는 정보들은 캐싱이 가능해야함
  캐싱을 위한 버전같은 것도 관리 잘해야함.

  5. Layerd System
  요청처리하는곳, DB에 저장하는곳 이런 여러가지 단계를 거쳐서 요청을 처리해도 된다.
  여러개의 레이어를 거쳐서 요청을 처리하게 만들어도 오케이라는뜻

  6. Code on Demand
  서버는 고객에게 실제 실행가능한 코드를 전송해줄 수도 있습니다. 

  가장 중요한것이 1번이다. 
  좋은 REST API 예시 

  nstagram.com/explore/tags/kpop
  instagram.com/explore/tags/food
  facebook.com/natgeo/photos
  facebook.com/bbc/photos

  - 단어들을 동사보다는 명사 위주로 구성함
  - 응용해서 다른 정보들을 쉽게 가져올 수 있을 정도로 일관성 있음 
  - 대충 봐도 어떤 정보가 들어올지 예측이 가능함 

  이외에도 이름을 잘 지을수있는 방법은 
  - 띄어쓰기는 언더바_대신 대시-기호-사용
  - 파일 확장자 쓰지 말기 (.html 이런거)
  - 하위 문서들을 뜻할 땐 / 기호를 사용함 (하위폴더같은 느낌)

  * 예를들어 우리는 현재
  app.post('/add', ... 이런식으로 /add로 POST요청을하면 ~ 해주세요 했는데
  조금더 REST한 관점으로 만들어보자면
  app.post('/newpost', ...) 이렇게 바꿀수있을것이다.


*/

/*
  웹사이트 기능만들기 기본

  1. 서버로 데이터 전송할 수 있는 UI 만들고
  2. 서버에서 원하는대로 정보를 처리해주면 된다.

  중요정보니까 어딘가 저장하는게 좋은데 엑셀파일만들어서 거기다가 저장해도가능하고,
  근데 엑셀은 십만단위가 넘어가도 버벅어긴다 그래서 Database에 저장한다

  * DB 종류 

  1. 관계형 
  엑셀처럼 가로세로 칸이 나뉘어져있는것
  데이터이름달고 실제데이터를 기입함. 이런데이터는 3차원을 다루지못한다.
  대부분 SQL 이라는 언어를 써야한다. 대량의데이터를 입력하고 쿼리를줄때(내가 원하는것만뽑을때)
  유용하다.

  - MySQL, MariaDB, Oracle, MS SQL Server 등

  2. NoSQL

  그냥 파일을 하나 생성해서 거기다가 자료를 집어넣는데, Object 자료형으로 입출력가능
  아주쉽고 자유롭게 데이터를 저장할수있는것이 장점이다.

  - Dynamo, Oracle NoSQL, MongoDB, Redis, Cassandra 등


  MongoDb 계정 세팅하고 라이브러리 설치 후
  MongoClient를  쓴다고 설정을하고 콜백함수를 넣어줌
  MongoClient.connect('URL', function(error, client){
    콜백함수안에 nodeJs서버띄우는 코드를 실행해보면 listening on port 
    이런식으로 잘 나온다
  }

*/

