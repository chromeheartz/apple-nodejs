const express = require('express');
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
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
  database.collection('post').insertOne({ date : req.body.date, title : req.body.title}, function(error, result) {
    console.log('save complete');
  })
})

app.get('/list', (req, res) => {
  // database의 데이터를 꺼냄. post라는 collection의 어떤것을 빼달라.
  // find().toArray()를쓰면 모든것들을 가져올수있지만 메타데이터도 들어옴
  database.collection('post').find().toArray(function(error, result){
    console.log(result);
    /*
      db에서 찾은자료를 ejs파일에 넣기

      .render()라는 함수에 둘째 파라미터를 써주면
      list.ejs 파일을 렌더링함과 동시에 {posts : result}라는 데이터를 함께 보내줄수있다.
      * 정확히말하면 result 라는 데이터를 posts라는 이름으로 ejs 파일에 보내달라고한것
    */
    res.render('list.ejs', {posts : result});
  });
  
})