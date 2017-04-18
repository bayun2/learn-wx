var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var client = new OAuth('wxfcd813854f6de23e', '834177ce77f63959c559c0cfeeceaaf7');

router.get('/', function(req, res, next) {
  var domain = 'http://123.206.133.45';
  var auth_callback_url = domain + '/oauth/callback';
  var url = client.getAuthorizeURL(auth_callback_url, '', 'snsapi_userinfo');
  console.log(url);
  res.redirect(url);
});

router.get('/callback', function(req, res, next) {
  var code = req.query.code;
  console.log(code);
  client.getAccessToken(code, function(err, result) {
    console.log(err);
    console.log(result);
    var accessToken = result.data.access_token;
    var openid = result.data.openid;
    client.getUser(openid, function(err, result) {
      var userInfo = result;
      res.json(userInfo);
    })
  })
});

module.exports = router;
