var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var client = new OAuth('wxfcd813854f6de23e', '834177ce77f63959c559c0cfeeceaaf7');

var getWxCode = function(res) {
  var domain = 'http://123.206.133.45';
  var auth_callback_url = domain + '/oauth/callback';
  var url = client.getAuthorizeURL(auth_callback_url, '', 'snsapi_userinfo');
  console.log(url);
  res.redirect(url);
}

router.get('/', function(req, res, next) {
  getWxCode(res);
});

router.get('/callback', function(req, res, next) {
  console.log(req.session)
  if (req.session.currentUser) {
    res.render('oauth', { userInfo: req.session.currentUser });
  } else {
    console.log('~~~~')
    var code = req.query.code;
    console.log(code);
    client.getAccessToken(code, function(err, result) {
      try {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        console.log('6')
        client.getUser(openid, function(err, result) {
          var userInfo = result;
          console.log('7')
          req.session.currentUser = userInfo;
          console.log(req.session)
          console.log('8')
          res.render('oauth', { userInfo: userInfo });
        })
      } catch(e) {
        getWxCode(res);
      }
    })
  }
});

module.exports = router;
