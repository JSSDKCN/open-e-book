define(
    ['util', 'skyex'],
    function(util, skyex) {
      var user = {};
      
      var resolves = {
        none: {
          resolve: function() {
            return null;
          }
        }
      };
      user.methods = {
          update: function(userFactory) {
            var username = $('input[name=username]').val();
            var mobile = $('#mobile').val();
            var email = $('input[name=email]').val();
            var gender = $('input[name=gender]:checked').val();
            console.log($('input[name=gender]:checked'));
            if (!username) {
              alert("请输入用户名!");
              return false;
            }
            
            if (!/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(mobile)) {
              alert("手机号输入不正确!");
              return false;
            }
            
            if (!/^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i
                .test(email)) {
              alert("输入电子邮箱格式不正确!");
              return false;
            }
            userFactory.update(username, mobile, email, gender);
          },
          password: {
              retrieve: function(userFactory) {
                var email = $('input[name=email]').val();
                if (!email) {
                  alert("请输入邮箱!");
                  return false;
                }
                userFactory.password.retrieve(email);
              },
              update: function(userFactory) {
                var old_pass = $('input[name=old_pass]').val();
                var new_pass = $('input[name=new_pass]').val();
                var new_pass2 = $('input[name=new_pass2]').val();
                if (!old_pass) {
                  alert("请输入旧密码!");
                  return false;
                }
                if (!new_pass) {
                  alert("请输入新密码!");
                  return false;
                }
                
                if (!new_pass2) {
                  alert("请输入确认密码!");
                  return false;
                }
                
                if (new_pass != new_pass2) {
                  alert("二次输入密码不一致!");
                  return false;
                }
                
                if (new_pass == old_pass) {
                  alert("尼玛，二次输入密码一致的，想玩我啊！!");
                  return false;
                }
                userFactory.password.update(old_pass, new_pass);
                return false;
              }
          },
          register: function(userFactory) {
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
            
            
            userFactory.register(username, password, email, captcha);
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
          'userFactory',
          function($scope, $route, $http, $location, $rootScope, resolve, userFactory) {
            var url = $route.current.templateUrl.substring(templateBase.length);
            var tempInfo = user.templates[url];
            if (!tempInfo)
              return;
            page = 1;
            var header = {};
            user.profile = userFactory.curProfile();
            $scope.user = user.profile;
            $rootScope.back = function() {
              console.log("inside more click");
              $location.path('/user');
            };
            switch (tempInfo.id) {
            case 1:
              header = {
                title: '用户登录'
              };
              
              if (!user.logout) {
                userFactory.getProfile();
              }
              
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
                
                userFactory.login(username, password);
              };
              break;
            case 2:
              $scope.captcha = skyex.captchaUrl();
              header = {
                  title: '用户注册',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              
              };
              
              $scope.register = function() {
                user.methods.register(userFactory);
              };
              $scope.refresh = function() {
                $('img').attr('src', skyex.captchaUrl());
              };
              break;
            case 3:
              header = {
                  title: '忘记密码',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
              };
              
              $scope.retrieve = function() {
                user.methods.password.retrieve(userFactory);
              };
              break;
            case 4:
              header = {
                  title: '用户信息',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
              };
              $scope.updateProfile = function() {
                user.methods.update(userFactory);
              };
              $scope.verification = function() {
                if (user.profile.is_email_validated == 1) {
                  return;
                }
                if (confirm('确定要发送验证信息吗？你的原邮箱验证信息将会失效！')) {
                  userFactory.mail.verify();
                }
                
              };
              var idx = (user.profile && user.profile.is_email_validated) ? user.profile.is_email_validated
                  : '0';
              switch (idx) {
              case '0':
              case 0:
                $('.verification').html('验证');
                break;
              case '1':
              case 1:
                $('.verification').html('重新验证');
                break;
              case '2':
              case 2:
                $('.verification').html('验证中...');
                break;
              }
              
              break;
            case 5:
              header = {
                title: '我的天易'
              };
              $scope.logout = function() {
                userFactory.logout();
              };
              break;
            case 6:
              header = {
                  title: '修改密码',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
              };
              $rootScope.back = function() {
                console.log("inside modify password");
                $location.path('/user/home');
              };
              $scope.passwordUpdate = function() {
                user.methods.password.update(userFactory);
              };
              break;
            }
            console.log('inside user ctrl');
            util.swap(2);
            
            $rootScope.header = header;
            $rootScope.parseImage = util.parseUrl;
            $scope.$on('$routeChangeSuccess', util.contentLoad);
          }];
      user.templates = {
          'user/login.html': {
              id: 1,
              url: '/user',
              resolve: resolves.none
          },
          'user/register.html': {
              id: 2,
              url: '/user/register',
              resolve: resolves.none
          },
          'user/password/retrieve.html': {
              id: 3,
              url: '/user/password/retrieve',
              resolve: resolves.none
          },
          'user/profile.html': {
              id: 4,
              url: '/user/profile',
              resolve: resolves.none
          },
          'user/home.html': {
              id: 5,
              url: '/user/home',
              resolve: resolves.none
          },
          'user/password/update.html': {
              id: 6,
              url: '/user/password/update',
              resolve: resolves.none
          },
      };
      return user;
    });