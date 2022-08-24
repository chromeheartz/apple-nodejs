const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.listen(7777, function(){
  console.log('listening on 7777')
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/write.html', function(req,res){
  res.sendFile(__dirname + '/write.html')
})

app.post('/add', (req, res) => {
  res.send('전송완료')
  console.log(req.body.date);
  console.log(req.body.title);
})