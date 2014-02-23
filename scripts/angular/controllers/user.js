define(
    ['util', 'skyex'],
    function(util, skyex) {
      var user = {};
      user.loginned = false;
      user.loginBeforeUrl = null;
      
      var resolves = {
        none: {
          resolve: function() {
            return null;
          }
        }
      };
      
      user.methods = {
          login: function() {
            
          },
          profile: function($http, $location, callback) {
            if (user.profile) {
              if (!callback) {
                $location.path('/user/home');
              } else {
                callback();
              }
              return;
            }
            var params = {
                type: 'user',
                act: 'profile'
            };
            skyex.post($http, params, function(response) {
              switch (response.status) {
              case 1:
                user.profile = response.data;
                if (!callback) {
                  $location.path('/user/home');
                } else {
                  callback();
                }
                break;
              }
            });
          },
          register: function($http, $location, callback) {
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();
            var password2 = $('input[name=password2]').val();
            var email = $('input[name=email]').val();
            var captcha = $('input[name=captcha]').val();
            if (!username) {
              alert("请输入用户名!");
              return false;
            }
            if (username.length < 2 || username.length > 20) {
              alert("用户名长度必须在2~20以内!");
              return false;
            }
            
            if (!password) {
              alert("请输入密码!");
              return false;
            }
            if (password.length < 6 || password.length > 20) {
              alert("密码长度必须在6~20以内!");
              return false;
            }
            
            if (!password2) {
              alert("请输入重复密码!");
              return false;
            }
            
            if (password != password2) {
              alert("两次输入的密码不一致!");
              return false;
            }
            if (!email) {
              alert("请输入电子邮箱!");
              return false;
            }
            
            if (!/^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i
                .test(email)) {
              alert("输入电子邮箱格式不正确!");
              return false;
            }
            
            if (!captcha) {
              alert("请输入验证码!");
              return false;
            }
            
            var form = new FormData($('form').get(0));
            form.append('type', 'user');
            form.append('act', 'register');
            
            skyex.post($http, form, function(data) {
              switch (data.status) {
              case 1:
                alert(data.message);
                // var user = require('user');
                // user.regi();
                break;
              }
            });
          }
      };
      
      user.resolves = resolves;
      
      user.controller = [
          '$scope',
          '$route',
          '$http',
          '$location',
          '$rootScope',
          'resolve',
          function($scope, $route, $http, $location, $rootScope, resolve) {
            var tempInfo = user.templates[$route.current.templateUrl];
            if (!tempInfo)
              return;
            page = 1;
            var header = {};
            
            switch (tempInfo.id) {
            case 1:
              header = {
                title: '用户登录'
              };
              
              user.methods.profile($http, $location);
              $scope.login = function() {
                var username = $('input[name=username]').val();
                var password = $('input[name=password]').val();
                if (!username) {
                  alert("请输入用户名!");
                  return;
                }
                if (!password) {
                  alert("请输入密码!");
                  return;
                }
                var form = new FormData($('form').get(0));
                form.append('type', 'user');
                form.append('act', 'login');
                
                var params = {
                    type: 'user',
                    act: 'login',
                    username: username,
                    password: password
                };
                
                skyex.post($http, params, function(response) {
                  switch (response.status) {
                  case 1:
                    user.loginned = true;
                    user.methods.profile($http, $location, function() {
                      $location.path('/user/home');
                    });
                    
                    break;
                  }
                });
              };
              break;
            case 2:
              header = {
                  title: '用户注册',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
                  url: '/user',
              
              };
              $rootScope.back = function() {
                console.log("inside more click");
                $location.path('/user');
              };
              
              $scope.captcha = skyex.captchaUrl();
              
              $scope.regiser = function() {
                user.methods.register($http, $location);
              };
              break;
            case 3:
              header = {
                  title: '忘记密码',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
                  url: '/user'
              };
              $rootScope.back = function() {
                console.log("inside more click");
                $location.path('/user');
              };
              break;
            case 4:
              header = {
                title: '用户信息',
                showBackButton: true,
                backButtonIcon: 'arrow-l',
                backButtonText: '返回',
                url: '/user/home'
              };
              $scope.user = user.profile;
              break;
            case 5:
              header = {
                title: '我的天易'
              };
              $scope.user = user.profile;
              break;
            }
            console.log('inside user ctrl');
            util.swap(2);
            
            $rootScope.header = header;
            $rootScope.parseImage = util.parseUrl;
            $scope.$on('$routeChangeSuccess', util.contentLoad);
          }];
      user.templates = {
          'templates/user/login.html': {
              id: 1,
              url: '/user',
              resolve: resolves.none
          },
          'templates/user/register.html': {
              id: 2,
              url: '/user/register',
              resolve: resolves.none
          },
          'templates/user/password/retrieve.html': {
              id: 3,
              url: '/user/password/retrieve',
              resolve: resolves.none
          },
          'templates/user/profile.html': {
              id: 4,
              url: '/user/profile',
              resolve: resolves.none
          },
          'templates/user/home.html': {
              id: 5,
              url: '/user/home',
              resolve: resolves.none
          },
      
      };
      return user;
    });