const express = require('express');
const app = express();

app.listen(7777, function(){
  console.log('listening on 7777')
});

app.get('/beauty', function(req, res){
  res.send('뷰티페이지에욤')
});

// /하나만 남겨주면 홈임.
app.get('/', function(req, res){
  // sendFile(보낼파일경로)를 쓰면 파일을 브라우저에 보낼수있다
  res.sendFile(__dirname + '/index.html')
});