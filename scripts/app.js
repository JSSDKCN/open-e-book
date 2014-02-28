define(["angular", "angular-resource", 'angular-route', 'skyex', 'category', 'util', 'navbar',
        'book', 'more', 'user', 'local'], function(angular,
    ngResource, ngRoute, skyex, category, util, navbar, book, more, user, local) {

  var app = angular.module("app", angularModules);
  // you can do some more stuff here like calling app.factory()...
  'use strict';
  //Factories
  app.factory('skyex', ['$http', skyex]);
  // Config $routeProvider
  templateBase = templateBase || "templates/";
  console.log(templateBase);
  
  
  app.config(['$routeProvider', function($routeProvider) {
    
    function moduleToRoutes(module, route) {
      for(templateUrl in module.templates) {
        var info = module.templates[templateUrl];
        var when = {
            templateUrl: templateBase + templateUrl,
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
    moduleToRoutes(category, $routeProvider);
    moduleToRoutes(local, $routeProvider);
    
    
    
    $routeProvider
    // Book
    .when('/', {
        templateUrl: templateBase + 'book/main.html',
        controller: book.controller,
        resolve: book.resolves.none
    })

    ;
  }]);

  app.controller('HeaderCtrl', function($scope) {
    
  });
  app.controller('NavBarCtrl', navbar);
  return app;
});
