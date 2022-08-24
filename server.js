const express = require('express');
const app = express();

app.listen(7777, function(){
  console.log('listening on 7777')
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
});

app.get('/write.html', function(req,res){
  res.sendFile(__dirname + '/write.html')
})