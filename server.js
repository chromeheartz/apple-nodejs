const express = require('express');
// 첨부한 라이브러리를이용해서 객체를만듬
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
// ejs관련코드
app.set('view engine', 'ejs');

var database
MongoClient.connect('mongodb+srv://bibi:1q2w3e4r@cluster0.8gtuh5t.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true },function(error, client){
  if(error) return console.log(error);

  database = client.db('todoapp')

  app.listen(7777, function(){
    console.log('listening on 7777')
  });
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/write', function(req, res){
  res.sendFile(__dirname + '/write.html');
})

app.post('/add', (req, res) => {
  res.send('add complete')
  database.collection('post').insertOne({ data : req.body.date, title : req.body.title}, function(error, result) {
    console.log('save complete');
  })
})

// list로 접속(get)요청하면 실제 DB에 저장된 데이터들로 데이터들을 보여줄것.

app.get('/list', (req, res) => {
  
  /*
    Failed to lookup view "list.ejs
    이런에러가 뜬다.
    서버에서 ejs파일같은것을 보내줄떄 위치가 중요하다.
    ejs파일들 위치는 views폴더 내에 넣기
  */
 // list.ejs 파일을 렌더링해준다
  res.render('list.ejs')
})