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

/*
  var, let, const 변수만드는 문법 정리

  var = 재선언 O, 재할당 O, 스코프(생존범위)는 function
  let = 재선언 X, 재할당 O, 스코프(생존범위)는 {}
  const = 재선언 X, 재할당 X, 스코프(생존범위)는 {}
*/

/*
  생짜 HTML에서는 GET,POST만 가능하고 PUT,DELETE는불가능하다.
  DELETE요청하는법
  1. method-override 라이브러리 이용 (form에서 delete요청 보내기가능)
  2. Javascript AJAX를 이용
*/

/*
  AJAX는 무엇일까

  서버랑 통신할 수 있게 도와주는 JS 문법 
  서버에 요청하는걸 도와주는 문법 이라고 생각하면된다.

  장점은 새로고침없이 한다. 비동기로.

*/

/*
      고객요청에 응답하는 여러가지 방법

      app.get('/어쩌구', function(요청, 응답){
        응답.send('<p>some html</p>')
        응답.status(404).send('Sorry, we cannot find that!')
        응답.sendFile('/uploads/logo.png')
        응답.render('list.ejs', { ejs에 보낼 데이터 })
        응답.json(제이슨데이터)
      });

      send는 간단한 문자나 HTML을 보낼 수 있습니다. 
      status는 응답코드를 보낼 수 있습니다. 
      sendFile은 static 파일들을 보낼 수 있습니다. 
      render는 ejs등의 템플릿이 적용된 페이지들을 렌더링해줄 수 있습니다. 
      json은 제이슨 데이터를 담아보낼 수 있습니다. 

      status(400)으로 실패가 되었을때
      ajax fail쪽 함수의 세개의인자로 원인을알아볼수있음
      fail(function(xhr, textStatus, errorThrown){...}

      textStatus = 응답코드
      errorThrown = 에러메세지
    */

/*
  css파일은 static file이라고한다. 데이터에의해 변하지않는파일
  보통 이런파일들은 public폴더안에 넣어놓는것이 관습이다.

  한가지 과정이 더 필요한데, 
  app.use('/public', express.static('public'));
  미들웨어라고 요청과 응답사이에 동작하는 코드인데
  static파일을 보관하기 위해 public폴더를 쓸것이다라고 얘기.
*/

/*
  
  var database
  MongoClient.connect('mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true },function(error, client){
    if(error) return console.log(error);
  
    database = client.db('todoapp')

    app.listen(7777, function(){
      console.log('listening on 7777')
    });
  })  

  서버 띄울때 처음 작성했던 코드인데 여기보면 7777 이라는 포트번호, mongodb+srv라는 DB접속 문자열이 존재한다.
  이런값들은 다른 개발환경이나 다른 컴퓨터로 코드를 옮긴다면 수정이 필요해질수도있다

  - 다른컴퓨터에서 7777 포트를 연다던지
  - 나중에 DB 이사를 가서 DB접속 문자열이 바뀐다든지 
  - 아니면 다른 팀원들과 share해야하는데 내 아이디 비번이 적혀있던지

  이런 환경에 따라 가변적인 변수데이터들을 보통 * 환경변수 * 라고 한다.
  environment variable

  그래서 미래를 생각하는 코딩을 하기위해 환경변수를 한곳에 모아서 관리한다
  .env파일이라는 곳에 모든 중요한 환경변수를 넣은뒤에
  server.js에 가서  ".env파일에 있는 포트숫자를 여기에 넣어주세요 " 이런식으로 코딩한다
  이 경우 server.js 파일이 털릴 경우에도 중요한 정보들은 env에 있기때문에
  보안상 이점이 있을 수 있다.

  사용방법

  1. npm install dotenv 라이브러리 설치

  2. 환경변수가 있는 server.js에 방금 설치한 라이브러리를 등록
  require('dotenv').config()

  3. server.js와 같은 경로에 .env파일을 만듬
  PORT=7777
  DB_URL="mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority"

  변수들이름은 보통 대문자로 표기
  여기에 모아놓으면 나중에 이 파일만 수정하면 되니 관리도 편해지고 나중에 작업환경이 바뀌거나 클라우드에
  올릴 때에도 이것만 변경해주면 환경셋팅 가능

  4. 환경변수들을 server.js에 불러오기
  server.js에서 env파일의 변수들을 불러올때에는 process.env.변수이름 으로사용가능

  var database
  MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true },function(error, client){
    if(error) return console.log(error);
  
    database = client.db('todoapp')

    app.listen(process.env.PORT, function(){
      console.log('listening on 7777')
    });
  })


  * https://cloud.google.com/appengine/docs/standard/nodejs/config/appref#environment_variables
  이런곳을 참고해서 환경변수를 제작하면 된다
  다만 변수 만드는 문법에 등호대신 콜론을 쓴다.


*/

/*
  Search

  POST로 하게되면 
  - 검색버튼 누르면 서버에게 요청
  - 서버는 DB에서 데이터 꺼내주고 그걸로 ejs보내고 뿌려주면 끝
 
  하나찾을때 collection().findOne()
  많이찾을때 collection().find().toArray()

  GET
 
  GET요청으로도 서버에 데이터 전달 가능
  GET할때는 URL만 잘 작성하면 끝. 
  URL안에 정보를 포함시켜서 보내줄수있음
 
  ?where=nextalsdk&sm=top=토마토 예를들어 이렇게 뒤에붙는것을
  query string, query parameter이라고한다

  query string 작성방법

  ?데이터이름=데이터값 같은식으로 작성하면
  데이터이름으로 데이터값이 서버로 전송된다

*/

/*
  정규식으로 xxx라는 문자가 포함된것들을 다 찾게 만든다 
  예를들어 /abc/ 이렇게 적으면 문자에 abc가 들어있냐 라는뜻임
  하지만 데이터베이스가많으면 find로 다찾는건 오래걸림
  
  이것을 해결할 수 있는것은 indexing 해두면 게시물이 1억개라도 찾기가 빨라짐
  게시물이 예를들어 id가 1부터 100까지 있는데 70번을 찾으라고하면 1부터 하나하나 다찾는다
  그 방법을 효율적으로 바꾸게하기위해서 반씩 잘라서 50이상이냐 예 가 나오면 75이상이냐 이런식으로
  업다운게임같은 느낌으로하는 방법으로할것이다.
  이런알고리즘은 Binary Search 라고 한다
  하지만 이것을 적용하려면 미리 숫자순으로 정렬이되어있어야한다.

  MongoDB는 _id순으로 정렬이 미리되어있어서 _id로 찾을때 Binary Search를 쓴다
  하지만 제목은 제목순으로는 되어있지않다
  그래서 제목을 빨리 찾고싶다면 미리 정렬해두어야한다(indexing 해둔다)
  index : 기존 collection을 정렬해놓은 사본

  인덱싱이라는 용어가 어려워보이지만 그냥 collection사본을 하나 더 만들어주는 작업일뿐이다.
  근데 정렬된사본이다.

  mongodb에서는 indexes로 만들수있다
  문자자료는 type을 'text'로 쓰면 된다.
  문자자료는 index만들때 한꺼번에 하는것이 좋다. 

  원래 db조작은 터미널로한다

  참고로 정규식을 사용하면 항상 index를 사용하는것이아니다
  정규식을쓸때 '이닦기'인것을 찾아달라고 명령을 주면 index를 사용하고
  '이닦기'가 포함된것을 다 찾아달라고하면 index를 사용하지않는다.
*/

/*
  find({title : req.query.value}) 에서 index만들어둔것으로 확인하기위해 바꿈
  $text : { $search : req.query.value } text와 search 연산자로 

  text index 만들어두면
  1. 빠른검색
  2. or 검색가능
  3. - 제외가능
  4. "정확히 일치하는것만"

  text index 문제점은 한글친화적이지않음
  띄어쓰기를 기준으로 단어를 저장하기때문에 해결책이 3가지정도있다

  1. text index를 쓰지않고 검색할 문서의 양에 제한을두는것
  맨앞 1000개중에서만 찾아봐라 , 오늘부터 일주일간 발행된게시물에서찾아봐라

  2. text index 만들때 다르게 만들기 
  알고리즘을 띄어쓰기 단위로 indexing 금지하고 글자 두개단위로 indexing해봐라(nGram)

  3. search index 만들기
  lucene.korean 으로 해석기를 한국어기준으로바꾸기

  find({ $text : { $search : req.query.value } }) 기존의 find를 빼고 수정
  aggregate([{},{},{}]) 검색조건을 달 수있다 data pipe line 이라고부름
*/

/*
 
    게시판기능 업데이트해야할것

    응용1. 삭제말고 글 수정기능은요? 그것도 여러분이 한번 해보십시오. 
    응용2. 삭제버튼이 안보이게 하려면? 그건 프론트엔드에서 처리해야겠는데얌
    원하는 게시물은 <button>을 안보이게 처리하면 되는데 그건 자바스크립트 잘하면 될 것 같기도 합니다. 
    응용3. 이외에도 직접 악성유저가 되어서 여러가지 조작을 해봅시다.
    삭제 버튼을 2번 빠르게 누르면?
    글쓸 때 제대로 제목과 내용을 안넣으면?
    로그인 안하고 조작하려하면?
    그럼 앞으로 어떤 코드를 더 짜야할지 자연스럽게 알게 됩니다.
    이런게 보안잡는거지 보안은 어렵고 그런거 아닙니다.

*/

/*
    쇼핑몰 등 실제 서비스 만들때의 질문들

    1. MongoDb에 데이터 넣고 뺄 때 라이브러리 2개 중 택 1가능
    - MongoDB Native Driver (지금까지 쓴거)
    - Mongoose 

    javascript 랑 jQuery 같은 관계
    MongoDB Native써도 다 할 수 있는데 Mongoose쓰면 약간 편해지고
    validation쉬워짐

    - Data Validation이 뭐냐면 회원 id 입력란을 만들었는데
    누가 한글 같은것을 입력하면 저장을 막아버리는 것
    * DB에 저장하기 전에 데이터 검증하는 작업

    var blog = new Schema({
        title : String,
        content : String,
        Age : Number
    })

    var Blog = mongoose.model('Blog', blog) 

    이런식으로 스키마를 만들어서 title에는 String만 넣어주세요 ~ 등등을 정의하는것

    var article = new Blog({
        title:'강남 우동 맛집',
        content: '돈받고 작성한 블로그 글입니다',
        age : 30
    })

    article.save(); 
    그럼 이제 이런식으로 미리 정의한 Schema와 맞는지 검사가 가능
     
    MongoDB Compass를 다운받으면 DB조회/조작을 로컬 pc에서 할 수있다
    또한 validation에서도 할수있다 아니면
    MongoDB shell (Compass와 동일한데 터미널에서 사용가능)
    사용해도되지만 DB 입출력 문법이 다 달라진다


    2. 보안

    Validation 엄격히 하는것도 DB 보안
    - 회원가입시 너무 긴 아이디
    - 영어넣어야할곳에 한글
    - 빈칸 보내면?
    - 로그인 안한상태에서 이것저것 조작?

    서버에서 DB저장전에 if문으로 검사하면 끝임

    * 많이 알려진 서버에 대한 공격들
    - <script>를 서버로 보내는 XSS 공격
     ㄴ <> 이걸 &lt; &gt; 이런걸로 바꾸거나 아예 못보내게하던가하는 방법들이있다
    - brute force attack
     ㄴ 1분동안 1억번 로그인 요청하는것. 요청횟수를 제한할수있다 Captach 도입하거나
        express-rate-limit 라이브러리 설치 후 사용

    3. 관리자기능

    어떤 회원은 모든 글 삭제 가능해야함
    회원정보 document들 관리자 여부를
    관리자 : true 이것이나
    role : 관리자 이렇게 역할을 관리자로 만듬

    관리자만 들어갈 수 있는 페이지는
    if(요청.user.role == '관리자') 이렇게 체크하고 보내주면 될것이다.

*/