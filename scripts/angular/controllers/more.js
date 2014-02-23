define(['util', 'skyex'], function(util, skyex) {
  var more = {};
  var resolves = {
    none: {
      resolve: function() {
        return null;
      }
    }
  };
  
  more.resolves = resolves;
  
  more.controller = ['$scope', '$route', '$rootScope', '$location', '$http', 'resolve',
      function($scope, $route, $rootScope, $location, $http, resolve) {
        var tempInfo = more.templates[$route.current.templateUrl];
        if (!tempInfo)
          return;
        var header = {};
        
        switch (tempInfo.id) {
        case 1:
          header = {
            title: '更多信息'
          };
          break;
        case 2:
          header = {
              title: '关于天易',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          
          };
          $rootScope.back = function() {
            console.log("inside click more 1");
            $location.path('/more');
            return true;
          };
          break;
        case 3:
          header = {
              title: '用户反馈',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          };
          $rootScope.back = function() {
            console.log("inside click more 2");
            $location.path('/more');
            return true;
          };
          
          $scope.changed = function() {
            var maxLen = 140;
            if ($('textarea').val().length > maxLen) {
              $('textarea').val($('textarea').val().substring(0, maxLen));
            }
            $('b.num').html(maxLen - $('textarea').val().length);
          };
          $scope.feedback = function() {
            if (!$('textarea').val()) {
              alert('请输入反馈消息!');
              return false;
            }
            var params = {
                type: 'more',
                act: 'feedback',
                feedback: encodeURIComponent($('textarea').val())
            };
            return skyex.post($http, params, function(response) {
              switch (response.status) {
              case 2:
                alert(response.message, 2);
                $location.path('/user');
                break;
              case 1:
                alert(response.message, 5);
                // $location.path('/feedback/success');
                $location.path('/more');
                break;
              }
              return response;
            });
            return false;
          };
          break;
        }
        console.log('inside book ctrl');
        util.swap(3);
        
        $rootScope.header = header;
        $rootScope.parseImage = util.parseUrl;
        $scope.$on('$routeChangeSuccess', util.contentLoad);
      }];
  more.templates = {
      'templates/other/main.html': {
          id: 1,
          url: '/more',
          resolve: resolves.none
      
      },
      'templates/other/about.html': {
          id: 2,
          url: '/about',
          resolve: resolves.none
      },
      'templates/other/feedback.html': {
          id: 3,
          url: '/feedback',
          resolve: resolves.none
      }
  };
  return more;
});