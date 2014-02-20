define(["angular", "angular-resource", 'angular-route'], function(angular) {
  var app = angular.module("app", ["ngResource", 'ngRoute']);
  // you can do some more stuff here like calling app.factory()...
  'use strict';

/*
  jQuery('div[data-role=header] a').click(function() {
    $(this).removeClass('ui-btn-active');
  }
    );
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
    console.log('router changed');
    // run some code to do your animations

    jQuery('div[data-role=header]').trigger('create');

    jQuery('div[data-role=content]').trigger('create');
  }

  var bookCtrl = ['$scope', '$rootScope', function($scope, $rootScope) {
    console.log('inside bookCtrl');
    $scope.$on('$routeChangeSuccess', contentLoad);
    swap(0);

  }];
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    // Book
    .when('/', {
      templateUrl: 'templates/book/main.html',
      controller: bookCtrl
    }).when('/book/all', {
      templateUrl: 'templates/book/all.html',
    controller: function($scope, $rootScope) {
      swap(0);
      $rootScope.title = "所有书籍";

      $rootScope.showBackButton = true;
      $rootScope.backButtonIcon = 'arrow-l';
      $rootScope.backButtonText = 'back';
      $rootScope.url = "/book";
      $scope.$on('$routeChangeSuccess', contentLoad);
    }
    }).when('/book', {
      templateUrl: 'templates/book/main.html',
    controller: bookCtrl
    }).when('/book/:bid', {
      templateUrl: 'templates/book/content.html',
    controller: bookCtrl
    }).when('/book/:bid/chapter/:cid', {
      templateUrl: 'templates/book/chapter.html',
    controller: bookCtrl
    })

  // Category
  .when('/category', {
    templateUrl: 'templates/category/main.html',
  controller: 'CategoryCtrl'
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
  controller: 'MoreCtrl'
  }).when('/feedback', {
    templateUrl: 'templates/other/feedback.html',
  controller: 'MoreCtrl'
  });
  }]);

  app.controller('CategoryCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    console.log('inside category ctrl');
    $rootScope.title = "书籍分类";
    //$('#nav-bar-1').addClass('ui-btn-active');
    swap(1);
    $scope.$on('$routeChangeSuccess', contentLoad);
  }]);

  app.controller('UserCtrl', function($scope) {
    //$('#nav-bar-2').addClass('ui-btn-active');
    swap(2);
    $scope.$on('$routeChangeSuccess', contentLoad);
  });

  app.controller('MoreCtrl', function($scope) {
    //$('#nav-bar-3').addClass('ui-btn-active');
    swap(3);
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
