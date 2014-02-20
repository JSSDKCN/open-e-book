define(["angular", "angular-resource", 'angular-route', '../scripts/angular/factory/skyex'], function(angular,
    ngResource, ngRoute, skyex) {
  var app = angular.module("app", ["ngResource", 'ngRoute']);
  // you can do some more stuff here like calling app.factory()...
  'use strict';
  
  app.factory('skyex', ['$http', skyex]);
  
  /*
   * jQuery('div[data-role=header] a').click(function() {
   * $(this).removeClass('ui-btn-active'); } );
   */

  /*
   * app.run(function($routeScope) { console.log('router changed global');
   * $routeScope.$on('$routeChangeSuccess', contentLoad); });
   */
  function swap(id) {
    $('div[data-role=navbar] ul li a').each(function() {
      $(this).removeClass('ui-btn-active');
    });
    $('#nav-bar-' + id).addClass('ui-btn-active');
  }
  
  function contentLoad() {
    // var button = jQuery('a[data-role=button]');
    // if (button) button.button();
    setTimeout(function() {
      var listview = jQuery('ul[data-role=listview]');
      if (listview)
        listview.listview('refresh');
    }, 10);
    
    jQuery('div[data-role=header]').trigger('refresh');
    jQuery('div[data-role=content]').trigger('create');
  }
  
  app
  // Config $httpProvider
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])

  // Config $routeProvider
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
    // Book
    .when('/', {
        templateUrl: 'templates/book/main.html',
        controller: function($scope, $rootScope) {
          swap(0);
          var header = {
            title: '我的书籍'
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    }).when('/book/all', {
        templateUrl: 'templates/book/all.html',
        controller: function($scope, $rootScope) {
          swap(0);
          var header = {
              title: '所有书籍',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/book'
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    }).when('/book', {
        templateUrl: 'templates/book/main.html',
        controller: function($scope, $rootScope) {
          swap(0);
          var header = {
            title: '我的书籍'
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    }).when('/book/:bid', {
        templateUrl: 'templates/book/content.html',
        controller: function($scope, $rootScope) {
          swap(0);
          var header = {
              title: '所有书籍',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/book'
          
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    }).when('/book/:bid/chapter/:cid', {
        templateUrl: 'templates/book/chapter.html',
        controller: function($scope, $rootScope) {
          swap(0);
          var header = {
              title: '所有书籍',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/book'
          
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    })

    // Category
    .when('/category', {
        templateUrl: 'templates/category/main.html',
        controller: 'CategoryCtrl',
        resolve: {
          categories: function($http) {
            return skyex.post($http, 'type=category&id=' + 0, function(data) {
              console.log('inside category sucess');
              console.log(data);
              return data;
            });
          }
        }
    
    })
    .when('/category/:id', {
        templateUrl: 'templates/category/main.html',
        controller: 'CategoryCtrl',
        resolve: {
          categories: function($http, $route) {
            return skyex.post($http, 'type=category&id=' + $route.current.params.id, function(data) {
              console.log('inside category sucess');
              console.log(data);
              return data;
            });
          }
        }
    
    })
    // User part
    .when('/user', {
        templateUrl: 'templates/user/login.html',
        controller: 'UserCtrl'
    }).when('/user/login', {
        templateUrl: 'templates/user/login.html',
        controller: 'UserCtrl'
    }).when('/user/register', {
        templateUrl: 'templates/user/register.html',
        controller: 'UserCtrl'
    }).when('/user/password/retrieve', {
        templateUrl: 'templates/user/password/retrieve.html',
        controller: 'UserCtrl'
    })

    // More
    .when('/more', {
        templateUrl: 'templates/other/main.html',
        controller: 'MoreCtrl'
    }).when('/about', {
        templateUrl: 'templates/other/about.html',
        controller: function($scope, $rootScope) {
          swap(3);
          var header = {
              title: '关于天易',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    }).when('/feedback', {
        templateUrl: 'templates/other/feedback.html',
        controller: function($scope, $rootScope) {
          swap(3);
          var header = {
              title: '用户反馈',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', contentLoad);
        }
    });
  }]);
  
  app.controller('CategoryCtrl', ['$scope', '$rootScope', 'categories', function($scope, $rootScope, categories) {
    console.log('inside category ctrl');
    console.log(categories.data);
    swap(1);
    var header = {
      title: '书籍分类'
    };
    $rootScope.header = header;
    
    $scope.categories = categories.data;
    $scope.$on('$routeChangeSuccess', contentLoad);
  }]);
  
  app.controller('UserCtrl', function($scope) {
    // $('#nav-bar-2').addClass('ui-btn-active');
    swap(2);
    $scope.$on('$routeChangeSuccess', contentLoad);
  });
  
  app.controller('MoreCtrl', function($scope, $rootScope) {
    // $('#nav-bar-3').addClass('ui-btn-active');
    swap(3);
    var header = {
      title: '更多信息'
    
    };
    $rootScope.header = header;
    $scope.$on('$routeChangeSuccess', contentLoad);
  });
  app.controller('HeaderCtrl', function($scope) {
    
  });
  app.controller('NavBarCtrl', function($scope) {
    $scope.navbars = [{
        'name': '书籍',
        'id': 0,
        'icon': 'search',
        'href': 'book'
    }, {
        'name': '分类',
        'id': 1,
        'href': 'category',
        'icon': 'grid'
    }, {
        'name': '我的天易',
        'id': 2,
        'href': 'user',
        'icon': 'home'
    }, {
        'name': '更多',
        'id': 3,
        'href': 'more',
        'icon': 'gear'
    }];
  });
  return app;
});
