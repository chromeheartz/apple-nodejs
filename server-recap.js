/*

*/
// 서버를 open하기위한 기본셋팅
// express를 첨부해주세요
const express = require('express');
// 첨부한 라이브러리를이용해서 객체를만듬
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
// form태그에서 put, delete를 하기위한 라이브러리
const methodOverride = require('method-override');
const { ObjectId } = require('mongodb');

app.use(methodOverride('_method'))
// ejs관련코드
app.set('view engine', 'ejs');

// 어떤 데이터베이스에 넣을지
var database
MongoClient.connect('mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (error, client) {
  // 실제로 접속을 확인해볼것임 접속이완료가되면 nodejs 서버띄우는 코드를 실행
  if (error) return console.log(error);

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

  database.collection('post').insertOne({ name: "bibi", age: 30 }, function (error, result) {
    console.log('save complete');
  });

  app.listen(7777, function () {
    console.log('listening on 7777')
  });
})

// 터미널에서 node server.js  (main으로걸어주었던것을 키면 listening on xxxx가 나옴)

// app.get()은 두개의 파라미터가 들어간다. 경로, 띄워줄함수  function에는 (요청 request,응답 response)
// 응답.send('.....')
app.get('/beauty', function (req, res) {
  res.send('뷰티페이지에욤')
});

// /하나만 남겨주면 홈임.
app.get('/', (req, res) => {
  // sendFile(보낼파일경로)를 쓰면 파일을 브라우저에 보낼수있다
  // __dirname 은 현재 파일경로를 뜻한다.
  res.sendFile(__dirname + '/index.html')
});


// 리액트로 데이터바인딩 해보는법을 찾아보는것도 좋다.

// list로 접속(get)요청하면 실제 DB에 저장된 데이터들로 데이터들을 보여줄것.


app.get('/list', (req, res) => {
  // database의 데이터를 꺼냄. post라는 collection의 어떤것을 빼달라.
  // find().toArray()를쓰면 모든것들을 가져올수있지만 메타데이터도 들어옴
  database.collection('post').find().toArray(function (error, result) {
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
    res.render('list.ejs', { posts: result });
  });

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
  database.collection('post').findOne({ _id: parseInt(req.params.id) }, function (error, result) {
    // 서버에 null이 뜰때 query문 날린것을 잘 확인해보아야함. 지금 database에 있는데 null이 나온다는것은
    // 자료형이 달라서그렇다. Number()로 넣어주어도 되고 parseInt해줘도됨
    console.log(result);
    // 두번째인자 중요. result라는 데이터를 data라는 이름으로 보내주세요 (ejs파일로 데이터 보내는법)
    res.render('detail.ejs', { data: result })
  })
})

// edit페이지를 만들고 실제게시물이 없는 파라미터일경우에 404페이지 출력.
app.get('/edit/:id', (req, res) => {
  // id로 들어오는 게시물의 제목과 날짜를 edit.ejs로 보냄.
  // findeOne안에 어떤 데이터를 찾고싶은지 query문을 넣음
  database.collection('post').findOne({ _id: parseInt(req.params.id) }, function (error, result) {
    console.log(result);
    if (result) {
      res.render('edit.ejs', { post: result })
    } else {
      res.render('error.ejs')
    }
  })
})

/*
  PUT 요청을 하기위해 method-override 라이브러리 설치
  설치후 선언하고 이런식으로 form을 쓰면

  <form action="/edit?_method=PUT" method="post">
  edit경로로 put요청을 할수있게된다.
  
*/

app.put('/edit', (req, res) => {
  /*
    updateOne은 어떤 게시물을 찾아서 하나만 업데이트시켜준다,
    (어떤게시물수정할건지, 수정값, 콜백함수)
    operator set은 업데이트해달라는뜻이다 없으면 추가해달라고 말하는것.

    현재 수정할 날짜와 제목은 보내고있는데 무슨 id의 게시물을 바꿀지는 안보내고있다.
    서버한테 함께 id를 보내주어야하는데 크게 두가지가 있을수있다.

    - /edit?_... 부분에 url의 parameter를 넣어줄수도있을것이고
    - 안보이는 input태그를 만들어서 
    <input type="text" value="<%= post._id %>" name="id" style="display:none;">
    이런식으로

    몰래보낸 post._id 데이터를 서버에서 꺼내는법.
    req.body.id input중에 name이 id인것을 보내주세요. 하는것.
  */
  database.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, (error, result) => {
    console.log('edit complete')
    // 변경후에 다른페이지로 이동을 한다던지 해야함.
    res.redirect('/list')
  })
})


// session 방식 로그인 기능 구현을 위한 라이브러리 3개
// passport passport-local express-session

// 라이브러리들 첨부
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// 미들웨어 설정
// 미들웨어 : 요청 - 응답 중간에 뭔가 실행되는 코드
// secret 의 value는 세션을 만들떄의 비밀번호가됨.
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

// passport 로그인기능 쉽게 구현가능해지는 라이브러리
// authenticate는 인증해달라는것. local이라는 방식으로 회원인지 인증해달라는뜻
// 성공을하고 중괄호를 넣어놓으면 세팅을 할 수 있음. failureRedirect 실패했을시에 이 경로로 이동시켜주라는뜻
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/fail'
}), (req, res) => {
  // 로그인 요청시 실행될코드들
  // 회원인증 성공하면 redirect /여기로 보내달라는뜻
  res.redirect('/')
})

// 마이페이지 만들기
/*
  로그인을 한 사람만 보여줄수있도록한다. 미들웨어를 사용함
  mypage로 누가 요청을하면 미들웨어에 있는 코드를 실행한 다음에 응답을 해준다
*/
app.get('/mypage', isLogined, (req, res) => {
  console.log(req.user)
  // 찾은 유저정보를 mypage.ejs에 보냄
  res.render('mypage.ejs', { user: req.user })
});

// 이 사람이 로그인한 데이터가 있어야 마이페이지로 보내져야하니 미들웨어같은 함수를 하나만든다.
function isLogined(req, res, next) {
  // 마이페이지 접속 전 실행할 미들웨어
  // 로그인 후 세션이 있으면 요청.user가 항상있음. 출력해서 확인해보기
  if (req.user) {
    // 다음으로 통과
    next()
  } else {
    // 경고메세지 응답
    res.send("i can't find user");
  }

}


// post 요청시 채팅방 게시물 발행
app.post('/chatroom', isLogined, (req, res) => {

  var saveMon = {
    title: 'chatTitle',
    member: [ObjectId(req.body.resUserId), req.user._id],
    date: new Date()
  }

  // 콜백함수 대신 then으로 사용가능
  database.collection('chatroom').insertOne(saveMon).then((result) => {
    res.send('save complete')
  });
});

// 아이디 비번 인증하는 세부코드
// 인증하는 방법은 Strategy라고 함
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  // 로그인 후 세션을 저장할것인지
  session: true,
  // 사용자의 다른정보 검증시 true로 바꾸면 매개변수를 하나 더 넣을수있다. req로 넣어서 req.body하면 볼수있음
  passReqToCallback: false,
  // 이부분이 사용자의 아이디랑 비번을 DB와 비교해서 검증하는 부분이다
}, function (id, password, done) {
  console.log(id, password);
  // DB에 입력한 아이디가 맞는지 확인
  database.collection('login').findOne({ id: id }, function (error, result) {
    if (error) return done(error)
    /*
      만약 결과(일치하는것이없다)가 없으면 !result부분을 실행하고
      DB에 아이디가 있으면 입력한비번과 결과.pw를 비교

      return done()여기서 done()이 무엇이냐면
      라이브러리 문법이다. 3개의 파라미터를 가질수있다.
      (서버에러, 성공시사용자DB데이터, 에러메세지 넣는곳)
    */
    if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
    // pw가 암호화되지않아서 보안이 좋지않다.
    if (password == result.pw) {
      // 모든게 다 맞아서 사용자DB데이터를 담는것
      return done(null, result)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));

/*
  검사가 끝났을때 이사람이 로그인했다는 정보를 세션을 하나 만들어서 저장을해주어야한다.
  세션방식이 로그인성공 -> 세션정보를 만듬(로그인했었는지)
  세션이 있어야 마이페이지 방문시 세션검사가가능

  세션에 등록하는법 (로그인을 유지하는것)
*/
// 세션 만들기

/*
  세션을 저장시키는 코드(로그인 성공시 발동) user.id라는 정보로 세션을 만듬
  아이디 비번이 맞을시에 들어가는 result가 user로 들어오게되는것
  세션 데이터를 만들고 세션의 id정보를 쿠키로보냄
*/
passport.serializeUser((user, done) => {
  done(null, user.id)
});

/*
  나중에 호출되는것. (마이페이지 접속시 발동)
  세션을 찾을때
  user.id가 매개변수의 첫번째 자리로 들어오니 그것을 기반으로 findOne을 할 수있다
*/
passport.deserializeUser((id, done) => {
  /*
    user.id로 유저를 찾은뒤에 유저 정보를
    done(null, {})의 {}에 넣음

    * 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는역할
    리턴해주는것이 중괄호안에 들어가는것이다.
    유저의 DB이름같은것을 마이페이지에서 출력해준다.

    마이페이지 접속시 DB에서 {id : 어쩌구, ...}인걸 찾아서 그 결과를 보내줌 
    그 결과는 마이페이지 접속할때 요청.user 로 들어오게 된다
  */
  database.collection('login').findOne({ id: id }, function (error, result) {
    done(null, result) // result 는 id: bibiboy, pw : test 이렇게 들어오는것
  })
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
  database.collection('counter').findOne({ name: "게시물갯수" }, function (error, result) {
    // console.log(result.totalPost);
    let totalPost = result.totalPost;
    /*
      요청.user : 현재 로그인한 사람의 정보 들어있음
      name 작성자, 이름, 아이디 등 모든 기록을 보내주면 좋을듯
      현재 실제 유저의 유니크한 _id를 가지고있음. 그것을
      login 컬렉션에 조회해보면 이름이 금방 나올것이다.

      dennormalizing 찾아보기.
    */
    let saveItem = { _id: totalPost + 1, name: req.user._id, date: req.body.date, title: req.body.title };

    database.collection('post').insertOne(saveItem, function (error, result) {
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
      database.collection('counter').updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } }, function (error, result) {
        if (error) return console.log(error)
      })
    })
  });
})


// delete 경로로 DELETE요청을 처리하는 코드
/*
  실제 로그인중인 유저의 _id와
  글에 저장된 유저의 _id가 일치하면 삭제해주도록

  let deleteData = { _id : req.body._id, name : req.user._id} 
  이런식으로 서놓으면 첫번째와 두번쨰가 일치하는 사람을 찾아서 삭제를 해준다. 타겟팅이가능.
*/
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
  // 삭제할 데이터
  var deleteData = { _id: req.body._id, name: req.user._id }
  database.collection('post').deleteOne(deleteData, function (error, result) {
    console.log('delete complete')
    // 응답코드 200을 보내주세요 요청성공. 400은 고객잘못으로 요청실패라는뜻, 500은 서버문제요청실패
    // .send는 서버에서 메시지를 보낼때 쓰는 함수. 글자만써도되고 object로 넣어도됨
    res.status(200).send({ message: 'complete' });
  })
})


// 서버에서 query string 꺼내는법
app.get('/search', (req, res) => {
  // new Date() 날짜별로 쿼리줄때 사용
  /*
    req.body 는 form태그로 post요청할떄의 정보들이 들어있는데
    query string은 req.query를 쳐서보면된다

    find({title : req.query.value}로 하면 정확히 맞는것만 찾아줌
  */
  console.log(req.query.value)
  // binary search를 사용하기위한 indexing작업 필수
  var searchInfo = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: req.query.value,
          path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
        }
      }
    },
    // 검색조건 추가
    {
      // 어떤순서로정리할지, 1또는 -1로 오름 내림이 됨
      $sort: { _id: 1 }
    },
    // {$limit : 10} 상위 10개만 가져와주세요
    // 검색결과에서 필터주기 0은 안가져오고 1은 가져오기
    // { $project : { title : 1, _id : 0, score : { $meta : "searchScore"}}}

  ]
  database.collection('post').aggregate(searchInfo).toArray((error, result) => {
    // 찾은결과를 잘 가져오고있음
    console.log(result)
    res.render('search.ejs', { posts: result })
  })
})





// multer
let multer = require('multer');
/*
  diskStorage는 일반 하드 같은 폴더안에 저장해달라는뜻
  memoryStorage는 RAM에 저장해달라는뜻
*/
var storage = multer.diskStorage({
  // 업로드한 이미지의 경로를 설정
  destination: function (req, file, cb) {
    cb(null, './public/image')
  },
  // 저장한 이미지의 파일이름을 설정하는부분
  filename: function (req, file, cb) {
    cb(null, file.originalname) // + new Date() +로 문자를 담던 파일명을 다이나믹하게바꿀수있음
  }
})

var upload = multer({ storage: storage });
/*
  var path = require('path');

  var upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname);
          if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
              return callback(new Error('PNG, JPG만 업로드하세요'))
          }
          callback(null, true)
      },
      limits:{
          fileSize: 1024 * 1024
      }
  });

  셋팅하는 부분안에 fileFilter라는 항목을 추가해주면 파일 형식 자르기도 가능.
  path라는 변수는 nodejs 기본 내장 라이브러리 path 라는것을 활용해 파일의 경로, 이름, 확장자 등을 알아낼 때 사용
  위의 예제에서는 업로드한 파일의 확장자를 알아내서 png랑 맞는지 확인, 비교하는 과정
*/

app.get('/upload', (req, res) => {
  res.render('upload.ejs')
})

/*
  업로드한 이미지 폴더안에 저장. 편하게 사용위해 라이브러리 설치
  multer를 미들웨어로 동작시키기
  single 이라고 쓰고 Input의 name속성으로 어떤것의 파일을 받아올것인지 쓴다
  single이라고 한것을 array라고 쓰고 (input의 name속성, 한번에받을최대갯수)라고 써주면된다
  
  그럴려면 인풋을 여러개 파일을 선택할 수 있는 인풋으로 바꾸면된다.
*/
app.post('/upload', upload.single('picture'), (req, res) => {
  res.send('완료')
})

// 업로드한 이미지 보여주기, 이걸로 프로필 사진 만들어보기
{/* <img src="/image/yosigo.jpg"> 추후에 이런식으로 기능개발해도됨 */ }


// 업로드한 이미지 보여주기
app.get('/image/:imageName', (req, res) => {
  res.sendFile(__dirname + '/public/image' + req.params.imageName)
})

/*

  새로운 개념
  - 게시물간 관계맺기
  - DB 실시간 업데이트

  채팅기능 == 댓글기능(+실시간)

  댓글게시물은 무조건 부모게시물이 존재한다. 종속되어야한다는것.
  Collection1 - 할일게시물 A, 할일게시물 B
  Collection2 - 댓글게시물1 (부모 : 게시물 A ), 댓글게시물2 (부모 : 게시물A),
                댓글게시물3 (부모 : 게시물 B)
  이런 형태의 구조가 필요하다

  이런것을 document끼리 관계를 맺는다고 한다.
  글 & 댓글 == 채팅방 & 메세지

*/


app.get('/chat', isLogined, (req, res) => {
  // db에서 데이터받아오기, array안에 하나를 찾는것이면 그냥 find로도 가능
  database.collection('chatroom').find({ member: req.user._id }).toArray().then((result) => {
    // 성공시에 렌더
    res.render('chat.ejs', { data: result })
  })
})

// 메세지보내기
app.post('/message', isLogined, (req, res) => {
  let saveData = {
    parent: req.body.parent,
    content: req.body.content,
    userid: req.user._id,
    date: new Date(),
  }
  database.collection('message').insertOne(saveData).then(() => {
    console.log('DB저장 성공')
    res.send('DB저장 성공')
  }).catch(() => {
    console.log('DB저장 실패')
  })
})


/*
  실시간으로 DB 데이터 계속 가져오는법

  1. get 요청 계속 날리기(서버는 요청 많으면 힘들어함)
  짧은시간에 get 요청을 몇십만번하고 이런것을 Ddos 공격이라고함

  2. 서버와 유저간 실시간 소통채널 열기(Server Sent Events)
  서버가 일방적으로 데이터 실시간 전송가능

  * get 요청시 서버로 데이터전송하려면
  1. URL 파라미터
  2. query string
  
*/

app.get('/message/:parentid', isLogined, (req, res) => {

  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // result에서는 array안에 obejct가 있는데 서버에서 실시간 전송시 문자자료만 전송가능해서 stringify를 쓴다
  database.collection('message').find({ parent: req.params.parentid }).toArray().then((result) => {
    console.log(result)
    // 유저에게 데이터 전송. 어떤이름으로 데이터를 보낼것인지
    res.write('event: test\n'); // 보낼데이터이름 \n 엔터키와같다고생각.
    // 지금 누른 채팅방의 채팅메세지들
    res.write(`data: ${JSON.stringify(result)}\n\n`); // 보낼데이터
  })

  // db가 업데이트되면 유저에게 쏴주는것 change stream
  const pipeline = [
    // 컬렉션안의 원하는 document만 감시하고싶으면. fullDocument 문자열로붙여줘야함
    // { $match : { 'fullDocument.parent' : req.params.id } } //유저가 요청한 채팅방만 감시하고싶다면
    { $match: {} }
  ];
  const collection = database.collection('message');
  const changeStream = collection.watch(pipeline);
  changeStream.on('change', (result) => {
    /*
      해당 컬렉션에 변동이 생기면 코드 실행. 파라미터를 만들어넣으면 변경된 결과들이나옴
      fullDocument를 붙이는것은 result만 하면 너무많은 정보들이 나오는데 추가된 document만 알고싶어서 
      축약해서 보여주게하는것. 
    */
    console.log(result.fullDocument)
    // []로 감싸주는것은 서버에서 document찾을때 다 [{},{},{}...]이런 모양이여서 규격통일을위해
    res.write('event: test\n');
    res.write(`data: ${JSON.stringify([result.fullDocument])}\n\n`); // 보낼데이터
  })

});