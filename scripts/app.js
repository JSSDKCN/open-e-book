define(["angular", "angular-resource", 'angular-route', 'skyex', 'category', 'util', 'navbar',
        'book', 'more', 'user'], function(angular,
    ngResource, ngRoute, skyex, category, util, navbar, book, more, user) {
  var app = angular.module("app", ["ngResource", 'ngRoute']);
  // you can do some more stuff here like calling app.factory()...
  'use strict';
  //Factories
  app.factory('skyex', ['$http', skyex]);
  // Config $routeProvider
  app.config(['$routeProvider', function($routeProvider) {
    
    function moduleToRoutes(module, route) {
      for(templateUrl in module.templates) {
        var info = module.templates[templateUrl];
        var when = {
            templateUrl: templateUrl,
            controller: module.controller
        };
        if (info.resolve) {
          when.resolve = info.resolve;
        }
        route.when(info.url, when);
      }
    }
    
    moduleToRoutes(book, $routeProvider);
    moduleToRoutes(more, $routeProvider);
    moduleToRoutes(user, $routeProvider);
    
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
    
    });
  }]);
  
  app.controller('CategoryCtrl', category.controller);

  app.controller('HeaderCtrl', function($scope) {
    
  });
  app.controller('NavBarCtrl', navbar);
  return app;
});
