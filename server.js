const express = require('express');
const app = express();

// socekt.io
const http = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(http);

// bodyparser 선언
const bodyParser = require('body-parser');
const { countReset } = require('console');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');

const { ObjectId } = require('mongodb');

// 환경변수
require('dotenv').config()
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

// 미들웨어 요청과 응답사이에 동작하는 자바스크립트 코드
app.use('/public', express.static('public'));

var database
MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function (error, client) {
  if (error) return console.log(error);

  database = client.db('todoapp')

  http.listen(process.env.PORT, function () {
    console.log('listening on 7777')
  });
})

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.get('/list', (req, res) => {
  database.collection('post').find().toArray(function (error, result) {
    // console.log(result);
    res.render('list.ejs', { posts: result });
  });

})

app.get('/write', (req, res) => {
  database.collection('post').find().toArray(function (error, result) {
    // console.log(result);
    res.render('write.ejs', { posts: result });
  });

})

// **** 이부분 이해하는것 중요.
app.get('/detail/:id', (req, res) => {
  database.collection('post').findOne({ _id: parseInt(req.params.id) }, function (error, result) {
    console.log(result);
    res.render('detail.ejs', { data: result })
  })
})

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


app.put('/edit', (req, res) => {
  database.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, (error, result) => {
    console.log('edit complete')
    // 변경후에 list페이지로 이동시킴
    res.redirect('/list')
  })
})

// 라이브러리들 첨부
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// 미들웨어 설정
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect: '/fail'
}), (req, res) => {
  res.redirect('/')
})

// 마이페이지 만들기
// mypage에 접속했을때만 실행될 미들웨어 isLogined
app.get('/mypage', isLogined, (req, res) => {
  // console.log(req.user)
  res.render('mypage.ejs', { user: req.user })
});
function isLogined(req, res, next) {
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
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (id, password, done) {
  // console.log(id, password);
  // DB에 입력한 아이디가 맞는지 확인
  database.collection('login').findOne({ id: id }, function (error, result) {
    if (error) return done(error)
    if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
    if (password == result.pw) {
      // 모든게 다 맞아서 사용자DB데이터를 담는것
      return done(null, result)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));

// 세션 만들기
passport.serializeUser((user, done) => {
  done(null, user.id)
});

// 세션을 찾을때
passport.deserializeUser((id, done) => {
  database.collection('login').findOne({ id: id }, function (error, result) {
    done(null, result)
  })
});

/*
  가입폼, 유저 로그인했을떄에 대한 개발을 할것인데 회원기능이 필요하면
  passport세팅하는부분이 위에있어야함

  현재는 요청하는 대로 바로 저장을 하는데 아이디중복검사는 해야한다
  저장전에 id가 있는지 먼저 찾아볼것이다. 알파벳 숫자만 잘들어있는지 정규식으로
  비밀번호 저장 전에 암호화했는지

  * 현재 해야할것은 아이디가 중복인지 먼저 확인하는 코드를 만들어볼것
*/
app.post('/register', (req, res) => {
  database.collection('login').insertOne({ id: req.body.id, pw: req.body.pw }, (error, result) => {
    res.redirect('/')
  })
})


// 글 등록하는기능
app.post('/add', (req, res) => {
  res.send('add complete')

  database.collection('counter').findOne({ name: "게시물갯수" }, function (error, result) {
    // console.log(result.totalPost);
    let totalPost = result.totalPost;
    let saveItem = { _id: totalPost + 1, name: req.user._id, date: req.body.date, title: req.body.title };

    database.collection('post').insertOne(saveItem, function (error, result) {
      console.log('save complete');
      database.collection('counter').updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } }, function (error, result) {
        if (error) return console.log(error)
      })
    })
  });
})

// delete 경로로 DELETE요청을 처리하는 코드
app.delete('/delete', (req, res) => {
  req.body._id = parseInt(req.body._id)
  // 삭제할 데이터
  var deleteData = { _id: req.body._id, name: req.user._id }
  database.collection('post').deleteOne(deleteData, function (error, result) {
    console.log('delete complete')
    if (result) { console.log(result) };
    res.status(200).send({ message: 'complete' });
  })
})


// 서버에서 query string 꺼내는법
app.get('/search', (req, res) => {
  // new Date() 날짜별로 쿼리줄때 사용
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
    { $project: { title: 1, _id: 0, score: { $meta: "searchScore" } } }
  ]
  database.collection('post').aggregate(searchInfo).toArray((error, result) => {
    // 찾은결과를 잘 가져오고있음
    console.log(result)
    res.render('search.ejs', { posts: result })
  })
})

// 라우터 첨부
// app.use(미들웨어)
app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));

// multer
let multer = require('multer');
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

app.get('/upload', (req, res) => {
  res.render('upload.ejs')
})

app.post('/upload', upload.single('picture'), (req, res) => {
  res.send('완료')
})

// 업로드한 이미지 보여주기
app.get('/image/:imageName', (req, res) => {
  res.sendFile(__dirname + '/public/image' + req.params.imageName)
})

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
    { $match: {} }
  ];
  const collection = database.collection('message');
  const changeStream = collection.watch(pipeline);
  changeStream.on('change', (result) => {
    console.log(result.fullDocument)
    res.write('event: test\n');
    res.write(`data: ${JSON.stringify([result.fullDocument])}\n\n`); // 보낼데이터
  })

});


// socket.io
app.get('/socket', (req, res) => {
  res.render('socket.ejs')
})

// 이벤트리스너의 일종. 누군가 웹소켓 접속하면 내부코드 실행하도록
io.on('connection', (socket) => {
  // console.log(socket.id)

  // 채팅방생성, 입장시키기
  socket.on('room1-send', (data) => {
    // to에 room1이라고 쓰면 room1 들어간 유저에게 전송됨
    io.to('room1').emit('broadcast', data)
  })

  // 채팅방생성, 입장시키기
  socket.on('joinroom', (data) => {
    socket.join('room1');
  })

  // 서버에서 유저가 보낸 데이터 수신하기. parameter로 .on
  socket.on('user-send', (data) => {
    // 누가 'user-send'이름으로 메세지 보내면 내부코드 실행
    console.log(data)

    // 서버 -> 유저 메세지 전송
    io.emit('broadcast', data)

  })

})