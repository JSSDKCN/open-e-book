define(['util', 'skyex'], function(util, skyex) {
  var book = {};

  var page = 1, q = '';
  var resolves = {
      books: {
        resolve: function($http, $route) {
          var params = {
              type: 'book',
              act: 'search',
              page: page,
              q: q
          };
          return skyex.post($http, params, function(response) {
            console.log('inside book search sucess');
            console.log(response);
            page++;
            return response;
          });
        },
      },
      none: {
        resolve: function() {
          return null;
        }
      }
  };
 
 book.resolves = resolves;
  
  book.controller = ['$scope', '$route', '$rootScope', 'resolve', function($scope, $route, $rootScope, resolve) {
    var tempInfo = book.templates[$route.current.templateUrl];
    if (!tempInfo)
      return;
    page = 1;
    var header = {};
    
    switch (tempInfo.id) {
    case 1:
      header = {
        title: '我的书籍'
      };
      break;
    case 2:
      header = {
          title: '所有书籍',
          showBackButton: true,
          backButtonIcon: 'arrow-l',
          backButtonText: '返回',
          url: '/book',
      
      };
      $scope.books = resolve.data;
      $rootScope.click = function() {
        console.log("inside more click");
      };
      break;
    case 3:
      header = {
          title: '所有书籍',
          showBackButton: true,
          backButtonIcon: 'arrow-l',
          backButtonText: '返回',
          url: '/book'
      
      };
      break;
    case 4:
      header = {
          title: '所有书籍',
          showBackButton: true,
          backButtonIcon: 'arrow-l',
          backButtonText: '返回',
          url: '/book'
      
      };
      break;
    }
    console.log('inside book ctrl');
    util.swap(0);
    
    $rootScope.header = header;
    $rootScope.parseImage = util.parseUrl;
    //$scope.books = $injector.get('books');
    //
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  }];
  book.templates = {
      'templates/book/main.html': {
          id: 1,
          url: '/book',
          resolve: resolves.none
            
      },
      'templates/book/all.html': {
          id: 2,
          url: '/book/all',
          resolve: resolves.books
      },
      'templates/book/content.html': {
          id: 3,
          url: '/book/:bid',
          resolve: resolves.none
      },
      'templates/book/chapter.html': {
          id: 4,
          url: '/book/:bid/chapter/:cid',
          resolve: resolves.none
      }
  };
  return book;
});