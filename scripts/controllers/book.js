define(
    ['util', 'skyex'],
    function(util, skyex) {
      var book = {};
      var page = 1, q = '';
      var resolves = {
          chapter: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.chapter($route.current.params.cid);
            }
          },
          books: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.search(q, page);
            },
          },
          contents: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.content($route.current.params.id);
            }
          },
          none: {
            resolve: function() {
              return null;
            }
          }
      };
      
      book.resolves = resolves;
      
      book.controller = [
          '$scope',
          '$route',
          '$location',
          '$rootScope',
          'bookFactory',
          'resolve',
          function($scope, $route, $location, $rootScope, bookFactory, resolve) {
            console.log(bookFactory);
            var cache = bookFactory.cache;
            var url = $route.current.templateUrl.substring(templateBase.length);
            var tempInfo = book.templates[url];
            if (!tempInfo)
              return;
            var header = {};
            page = 1;
            $rootScope.parseImage = util.parseUrl;
            $rootScope.back = function() {
              $location.path('/book');
            };
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
                  backButtonText: '返回'
              };
              $scope.books = resolve.data;
              $scope.more = function() {
                console.log('more ... ');
                console.log(page);
                page = page + 1;
                bookFactory.search(q, page, function(response) {
                  console.log('more end ..');
                  console.log(response);
                  if (response.data.length) {
                    $('#more').remove();
                  } else {
                    $scope.$apply();
                  }
                });
              };
              break;
            case 3:
              header = {
                  title: '书籍详情',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $scope.book = cache.book[$route.current.params.id];
              $scope.chapters = resolve.data;
              $rootScope.back = function() {
                $location.path('/book/all');
              };
              $scope.download = function() {
                console.log("inside download");
              };
              $scope.change = function() {
                console.log("inside subscribe");
                console.log($scope.selectedItem);
              };
              break;
            case 4:
              header = {
                  title: cache.book[$route.current.params.id].name,
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $rootScope.back = function() {
                $location.path('/book/content/' + $route.current.params.id);
              };
              $scope.chapter = resolve.data[0];
              if (cache.content[$route.current.params.id].length > resolve.data[0].order) {
                $scope.next = true;
              } else {
                $scope.next = false;
              }
              $scope.nextChapter = function() {
                if (cache.content[$route.current.params.id].data.length > resolve.data[0].order) {
                  $location
                      .path('/book/'
                          + $route.current.params.id
                          + '/chapter/'
                          + cache.content[$route.current.params.id].data[resolve.data[0].order].id);
                }
              };
              break;
            }
            util.swap(0);
            
            $rootScope.header = header;
            $scope.$on('$routeChangeSuccess', util.contentLoad);
          }];
      book.templates = {
          'book/main.html': {
              id: 1,
              url: '/book',
              resolve: resolves.none
          },
          'book/all.html': {
              id: 2,
              url: '/book/all',
              resolve: resolves.books
          },
          'book/content.html': {
              id: 3,
              url: '/book/content/:id',
              resolve: resolves.contents
          },
          'book/chapter.html': {
              id: 4,
              url: '/book/:id/chapter/:cid',
              resolve: resolves.chapter
          }
      };
      return book;
    });