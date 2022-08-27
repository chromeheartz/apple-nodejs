const express = require('express');
const app = express();

// bodyparser 선언
const bodyParser = require('body-parser');
const { countReset } = require('console');
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
  })
})