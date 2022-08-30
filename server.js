const express = require('express');
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
const { countReset } = require('console');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

// 미들웨어 요청과 응답사이에 동작하는 자바스크립트 코드
app.use('/public', express.static('public'));

var database
MongoClient.connect('mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true },function(error, client){
  if(error) return console.log(error);
 
  database = client.db('todoapp')

  app.listen(7777, function(){
    console.log('listening on 7777')
  });
})

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.post('/add', (req, res) => {
  res.send('add complete')

  database.collection('counter').findOne({name : "게시물갯수"}, function(error, result){
    // console.log(result.totalPost);
    let totalPost = result.totalPost;
    database.collection('post').insertOne({ _id : totalPost + 1, date : req.body.date, title : req.body.title}, function(error, result) {
      console.log('save complete');
      database.collection('counter').updateOne({name : "게시물갯수"}, { $inc : {totalPost : 1}}, function(error, result){
        if(error) return console.log(error)
      })
    })
  });
})

app.get('/list', (req, res) => {
  database.collection('post').find().toArray(function(error, result){
    // console.log(result);
    res.render('list.ejs', {posts : result});
  });
  
})

app.get('/write', (req, res) => {
  database.collection('post').find().toArray(function(error, result){
    // console.log(result);
    res.render('write.ejs', {posts : result});
  });
  
})

// delete 경로로 DELETE요청을 처리하는 코드
app.delete('/delete', (req, res) => {
  req.body._id = parseInt(req.body._id)
  database.collection('post').deleteOne(req.body, function(error,result){
    console.log('delete complete')
    res.status(200).send({ message : 'complete' });
  })
})

// **** 이부분 이해하는것 중요.
app.get('/detail/:id', (req, res) => {
  database.collection('post').findOne({_id : parseInt(req.params.id)}, function (error, result){
    console.log(result);
    res.render('detail.ejs', { data : result})
  })
})

app.get('/edit/:id', (req,res) => {
  // id로 들어오는 게시물의 제목과 날짜를 edit.ejs로 보냄.
  // findeOne안에 어떤 데이터를 찾고싶은지 query문을 넣음
  database.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
    console.log(result);
    if(result) {
      res.render('edit.ejs', { post : result })
    } else {
      res.render('error.ejs')
    }
  })
})


app.put('/edit', (req,res) => {
  database.collection('post').updateOne({ _id : parseInt(req.body.id) }, { $set : {title : req.body.title, date : req.body.date}}, (error, result) => {
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
app.use(session({secret: '비밀코드', resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  failureRedirect : '/fail'
}), (req, res) => {
  res.redirect('/')
})

// 아이디 비번 인증하는 세부코드
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (id, password, done) {
  console.log(id, password);
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

passport.deserializeUser((user, done) => {
  done(null, {})
});

