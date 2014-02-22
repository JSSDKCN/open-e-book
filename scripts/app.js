define(["angular", "angular-resource", 'angular-route', 'skyex', 'category', 'util', 'navbar', 'book'], function(angular,
    ngResource, ngRoute, skyex, category, util, navbar, book) {
  var app = angular.module("app", ["ngResource", 'ngRoute']);
  // you can do some more stuff here like calling app.factory()...
  'use strict';
  //Factories
  app.factory('skyex', ['$http', skyex]);
  // Config $routeProvider
  app.config(['$routeProvider', function($routeProvider) {
    
    for(templateUrl in book.templates) {
      var info = book.templates[templateUrl];
      var when = {
          templateUrl: templateUrl,
          controller: book.controller
      };
      console.log(info);
      if (info.resolve) {
        console.log('inside resolve');
        console.log(info.resolve);
        when.resolve = info.resolve;
      }
      $routeProvider.when(info.url, when);
    }
    $routeProvider
    // Book
    .when('/', {
        templateUrl: 'templates/book/main.html',
        controller: book.controller,
        resolve: book.resolves.none
    })

    // Category
    .when('/category', {
        templateUrl: 'templates/category/main.html',
        controller: 'CategoryCtrl',
        resolve: category.resolve
    
    }).when('/category/:id', {
        templateUrl: 'templates/category/main.html',
        controller: 'CategoryCtrl',
        resolve: category.resolve
    
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
          util.swap(3);
          var header = {
              title: '关于天易',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', util.contentLoad);
        }
    }).when('/feedback', {
        templateUrl: 'templates/other/feedback.html',
        controller: function($scope, $rootScope) {
          util.swap(3);
          var header = {
              title: '用户反馈',
              showBackButton: true,
              backButtonIcon: 'arrow-l',
              backButtonText: '返回',
              url: '/more'
          };
          $rootScope.header = header;
          $scope.$on('$routeChangeSuccess', util.contentLoad);
        }
    });
  }]);
  
  app.controller('CategoryCtrl', category.controller);
  
  app.controller('UserCtrl', function($scope) {
    // $('#nav-bar-2').addClass('ui-btn-active');
    util.swap(2);
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  });
  
  app.controller('MoreCtrl', function($scope, $rootScope) {
    // $('#nav-bar-3').addClass('ui-btn-active');
    util.swap(3);
    var header = {
      title: '更多信息'
    
    };
    $rootScope.header = header;
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  });
  app.controller('HeaderCtrl', function($scope) {
    
  });
  app.controller('NavBarCtrl', navbar);
  return app;
});
