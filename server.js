const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://barnesquiat:<1q2w3e4r!@>@cluster0.uv1jq9q.mongodb.net/?retryWrites=true&w=majority', function(err, client){
  // 실제로 접속을 확인해볼것임 접속이완료가되면 nodejs 서버띄우는 코드를 실행
  app.listen(7777, function(){
    console.log('listening on 7777')
  });
})


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post('/add', (req, res) => {
  res.send('전송완료')
  console.log(req.body.date);
  console.log(req.body.title);
})