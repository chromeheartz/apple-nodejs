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
  
  database.collection('counter').findOne({name : "게시물갯수"}, function(error, result){
    // console.log(result.totalPost);
    let totalPost = result.totalPost;
    database.collection('post').insertOne({ _id : totalPost + 1, date : req.body.date, title : req.body.title}, function(error, result) {
      console.log('save complete');
    })
  });
})

app.get('/list', (req, res) => {
  database.collection('post').find().toArray(function(error, result){
    // console.log(result);
    res.render('list.ejs', {posts : result});
  });
  
})