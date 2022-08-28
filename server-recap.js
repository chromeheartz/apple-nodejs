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
// ejs관련코드
app.set('view engine', 'ejs');

// 어떤 데이터베이스에 넣을지
var database
MongoClient.connect('mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true },function(error, client){
  // 실제로 접속을 확인해볼것임 접속이완료가되면 nodejs 서버띄우는 코드를 실행
  if(error) return console.log(error);

  // todoapp이라는 database(폴더)에 연결해달라는뜻.
  database = client.db('todoapp')

  /*
    database는 폴더라고 생각하고 collection이라는것은 파일들이라고 보면된다.
    post라는 collection(파일)에 insetOne을 하겠다.
    database.collection('post').insertOne('저장할데이터', function(에러, 결과){
      console.log('저장완료');
    });

    저장할데이터에 들어갈것은 모두 OBject자료형으로 들어가야한다.
    원래는 스키마라고해서 데이터베이스를 만들때 이 데이터는 어떤 타입을 지정해야하는데
    여기서는 알아서 넣어준다.

    저장을하게되면 _id가 들어가는데 유니크한 키 이다. 자료저장시 _id 꼭 적어야함.
    안적으면 강제로 부여가됨
  */

  database.collection('post').insertOne({name : "bibi", age : 30}, function(error, result){
    console.log('save complete');
  });

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

// /하나만 남겨주면 홈임.
app.get('/', (req, res) => {
  // sendFile(보낼파일경로)를 쓰면 파일을 브라우저에 보낼수있다
  // __dirname 은 현재 파일경로를 뜻한다.
  res.sendFile(__dirname + '/index.html')
});


app.post('/add', (req, res) => {
  // 서버창에 데이터가 전달이된다.
  // console.log(req.body.title)

  // 이부분은 항상 존재해야한다. 전송이 실패하든 성공하든 뭔가 서버에서 보내주어야함.
  // 메세지 보내주기 싫다면 간단한 응답코드나 리다이렉트(페이지강제이동)를 해주는 코드도있다
  res.send('add complete')
  /*
    autto increment db에 뭔가 추가될때마다 자동으로 증가시켜서 저장하는 그런것들 
    하지만 총 개시물 갯수 +1 은 좋은것은 아니다. _id가 영구적으로 남아있게 유니크하게 지정하는것이좋다

    다른 collection을 만들어 파일을 관리한다. 발행된 총 게시물 갯수를 기록하는 저장공간
    insert document로 데이터의 이름, 값을 채워넣으면 된다.

    totalPost는 지금까지 발행된 총 게시물 갯수를 기록
    counter라는 collection에서 name이 게시물갯수인것을 찾아주세요 라는 뜻.
  */
  database.collection('counter').findOne({name : "게시물갯수"}, function(error, result){
    // console.log(result.totalPost);
    let totalPost = result.totalPost;
    database.collection('post').insertOne({ _id : totalPost + 1, date : req.body.date, title : req.body.title}, function(error, result) {
      console.log('save complete');
      /*
        id 발행 후 총개시물갯수 증가 mongoDb에서 어떤값을 수정할때 쓰는것 updateOne
        많이 수정할때는 updateMany 3번째 함수는 안써도됨
        (어떤데이터를수정할지, 수정값을입력,)
        업데이트류의 함수를 쓸떄는 operator를 써야한다.
        중괄호를 하나 더열어서 담아주고 
        $set 이 update operator이다.
        $set(변경), $inc(증가), $min(기존값보다 적을때만 변경), $rename (key값 이름변경) 등이있음.

        콜백함수에서 쓸때는 업데이트를 시켜주고, 완료가되면 안에있는 코드를 실행해주세요.맥락으로쓸것.
        에러체킹 혹은 결과값 반환받기 등등.
      */
      database.collection('counter').updateOne({name : "게시물갯수"}, { $inc : {totalPost : 1}}, function(error, result){
        if(error) return console.log(error)
      })
    })
  });
})

// 리액트로 데이터바인딩 해보는법을 찾아보는것도 좋다.

// list로 접속(get)요청하면 실제 DB에 저장된 데이터들로 데이터들을 보여줄것.


app.get('/list', (req, res) => {
  // database의 데이터를 꺼냄. post라는 collection의 어떤것을 빼달라.
  // find().toArray()를쓰면 모든것들을 가져올수있지만 메타데이터도 들어옴
  database.collection('post').find().toArray(function(error, result){
    console.log(result);
    /*
      Failed to lookup view "list.ejs
      이런에러가 뜬다.
      서버에서 ejs파일같은것을 보내줄떄 위치가 중요하다.
      ejs파일들 위치는 views폴더 내에 넣기
      
      db에서 찾은자료를 ejs파일에 넣기

      .render()라는 함수에 둘째 파라미터를 써주면
      list.ejs 파일을 렌더링함과 동시에 {posts : result}라는 데이터를 함께 보내줄수있다.
      * 정확히말하면 result 라는 데이터를 posts라는 이름으로 ejs 파일에 보내달라고한것
    */
    res.render('list.ejs', {posts : result});
  });
  
})

// delete 경로로 DELETE요청을 처리하는 코드
app.delete('/delete', (req, res) => {
  // 요청시 함꼐 보낸데이터를 찾는법.
  console.log(req.body)
  /*
    deleteOne 은 삭제해주는 함수
    첫번째 인자로는 query문을쓴다. 어떤항목을 삭제할지.
    두번째 인자로는 요청이 끝난후에 실행할 콜백함수
    database.collection('post').deleteOne(req.body, function(error,result){
      console.log('delete complete')
    })
    ajax에서 요청한 데이트가 data : {_id : 1} 이면 {_id : 1}이
    req.body에 들어가게되니 실제로는 {_id : 1}인것을 찾아서 지워달라는 말이되는것이다.
    현재상태에서는 삭제가 안되지만 자료형이 조금달라서 삭제가안되는것이다.
    실제 데이터베이스에서는 1이고 우리가 보낼것은 '1'이라서 number, string이 달라서그렇다

    우리가 number를 보냈는데 왜 문자로 보내지는것일까. 간혹 치환이되는경우가있어서
    값을 숫자로 변환시켜주어야한다.
  */
  // 숫자로변환한것을 다시 넣어줌
  req.body._id = parseInt(req.body._id)
  database.collection('post').deleteOne(req.body, function(error,result){
    console.log('delete complete')
    // 응답코드 200을 보내주세요 요청성공. 400은 고객잘못으로 요청실패라는뜻, 500은 서버문제요청실패
    // .send는 서버에서 메시지를 보낼때 쓰는 함수. 글자만써도되고 object로 넣어도됨
    res.status(200).send({ message : 'complete' });
  })
})


/*
  /detail/ 이후에 들어가는 게시물 번호에 따라 맞는 상세페이지 보내주기
  Parameter로 요청 가능한 URL을 만들기

  :를 붙이게 되면 사용자가 이 뒤에 아무문자열이나 입력을 하면 이것을해주세요라는뜻
  URL의 parameter라는 것임
*/
// **** 이부분 이해하는것 중요.
app.get('/detail/:id', (req, res) => {
  // db에서 원하는데이터찾기
  // req.params.id URL의 parameter중에 id를 넣어주세요 라는뜻
  database.collection('post').findOne({_id : parseInt(req.params.id)}, function (error, result){
    // 서버에 null이 뜰때 query문 날린것을 잘 확인해보아야함. 지금 database에 있는데 null이 나온다는것은
    // 자료형이 달라서그렇다. Number()로 넣어주어도 되고 parseInt해줘도됨
    console.log(result);
    // 두번째인자 중요. result라는 데이터를 data라는 이름으로 보내주세요 (ejs파일로 데이터 보내는법)
    res.render('detail.ejs', { data : result})
  })
})