define(["angular", "angular-resource", 'angular-route'], function(angular) {
  var app = angular.module("app", ["ngResource", 'ngRoute']);
  // you can do some more stuff here like calling app.factory()...
  'use strict';
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/book/main.html',
        controller: function($scope) {
          
        }
    }).when('/book', {
        templateUrl: 'templates/book/main.html',
        controller: function($scope) {
          
        }
    }).when('/category', {
        templateUrl: 'templates/category/main.html',
        controller: 'CategoryCtrl'
    }).when('/user', {
        templateUrl: 'user',
        controller: 'UserCtrl'
    }).when('/more', {
        templateUrl: 'more',
        controller: 'MoreCtrl'
    }).otherwise('/book');
  }]);
  
  app.controller('NavBarCtrl', function($scope) {
    $scope.navbars = [{
        'name': '书籍',
        'id': 0,
        'icon': 'search',
        'href': 'book',
        'isActive': true,
    }, {
        'name': '分类',
        'id': 1,
        'href': 'category',
        'icon': 'grid',
        'isActive': false,
    }, {
        'name': '我的天易',
        'id': 2,
        'href': 'user',
        'icon': 'home',
        'isActive': false,
    }, {
        'name': '更多',
        'id': 3,
        'href': 'more',
        'icon': 'gear',
        'isActive': false,
    }];
  });
  console.log('app defined');
  return app;
});