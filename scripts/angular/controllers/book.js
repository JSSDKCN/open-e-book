define(['util', 'skyex'], function(util, skyex) {
  var book = {};
  book.templates = {
      'templates/book/main.html': {
          id: 1,
          url: '/book'
      },
      'templates/book/all.html': {
          id: 2,
          url: '/book/all'
      },
      'templates/book/content.html': {
          id: 3,
          url: '/book/:bid'
      },
      'templates/book/chapter.html': {
          id: 4,
          url: '/book/:bid/chapter/:cid'
      }
  };
  book.resolve = {
    books: function($http, $route) {
      return skyex.post($http, 'type=category&id=' + $route.current.params.id, function(data) {
        console.log('inside category sucess');
        console.log(data);
        return data;
      });
    }
  };
  
  book.controller = ['$scope', '$route', '$rootScope',
      function($scope, $route, $rootScope) {
        var tempInfo = book.templates[$route.current.templateUrl];
        if (!tempInfo)
          return;
        
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
              url: '/book'
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
        $scope.$on('$routeChangeSuccess', util.contentLoad);
      }];
  return book;
});