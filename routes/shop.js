// express가 시키는대로 route 옮기기
// npm으로 설치했던 express라이브러리의 Router()라는 함수를 쓰겠다.
var router = require('express').Router();

router.get('/shirts', (req, res) => {
  res.send('셔츠 파는 페이지')
})

router.get('/pants', (req, res) => {
  res.send('바지 파는 페이지')
})

/*
  shop/ 이라는 부분이 중복이 되는데 그부분을 미들웨어에 넣는것
  /shop으로 접속하면 shop.js 라우터를 이용하겠다는 뜻


  javascript파일을 다른대서 가져다 쓰고싶을때 
  이 파일에서 router라는 변수를 배출하겠다는 뜻 
  require은 다른 파일이나 라이브러리를 첨부하겠다는 뜻

  require('shop.js') shop.js에서 배출한것이 이 자리에 남는것임

  만들고 첨부를 해야한다
*/
module.exports = router;