
var router = require('express').Router();

// 특정 라우터파일에 미들웨어를 적용하고싶으면 
// 로그인한 사람만 방문가능하게

function isLogined(req, res, next) {
  if (req.user) {
    // 다음으로 통과
    next()
  } else {
    // 경고메세지 응답
    res.send("i can't find user");
  }

}

// isLogined라는 미들웨어를 모든 라우트에 적용하고싶다면
// 여기있는 모든 URL에 적용할 미들웨어
router.use(isLogined);
// router.use('/shirts', isLogined) 특정 URL에만 적용하는 미들웨어


router.get('/sports', isLogined, (req, res) => {
  res.send('스포츠게시판')
})

router.get('/game', isLogined, (req, res) => {
  res.send('게임 게시판')
})

module.exports = router;