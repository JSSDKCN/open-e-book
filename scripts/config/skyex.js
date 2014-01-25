define(function() {
  var skyex = {};
  skyex.lib = {};
  skyex.app = {};
  
  skyex.LIMIT = 100;
  skyex.PAGE = 1;
  
  // skyex.domain = 't1book.com';
  // skyex.domain = location.hostname;
  skyex.domain = 'book.t1bao.com';
  if (location.hostname) {
    skyex.domain = location.hostname;
  }
  skyex.assetsUrl = '/assets';
  skyex.requestUrl = 'http://' + skyex.domain + '/web/app';
  skyex.requestUrl = '';
  skyex.requestUrl = 'http://' + skyex.domain + '/jqmapp';
  skyex.captchaUrl = skyex.requestUrl + '/captcha';
  skyex.downloadUrl = skyex.requestUrl + '/download';
  skyex.logoUrl = '/assets/img/logo.jpg';
  
  // prepared for session handling
  skyex.postSession = true;
  skyex.sessionName = 'ci_session_name';
  
  return skyex;
});