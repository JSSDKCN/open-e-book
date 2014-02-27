define(
    ['util', 'skyex'],
    function(util, skyex) {
      var local = {};
      
      var cache = {
          book: {},
          page: {},
          content: {},
          chapter: {}
      };
      
      var page = 1, q = '';
      var resolves = {
          chapter: {
            resolve: function($http, $route) {
              if (!parseInt($route.current.params.cid)) {
                return null;
              }
              var params = {
                  type: 'book',
                  act: 'chapter',
                  id: $route.current.params.cid
              };
              return skyex.post($http, params, function(response) {
                for (var i = 0; i < response.data.length; i++) {
                  var chapter = response.data[i];
                  cache.chapter[chapter.id] = chapter;
                }
                return response;
              });
            }
          },
          books: {
            resolve: function($http, $route) {
              p = page;
              var params = {
                  type: 'book',
                  act: 'search',
                  page: page,
                  q: q
              };
              if (cache.page[p]) {
                return cache.page[p];
              }
              return skyex.post($http, params, function(response) {
                cache.page[p] = response;
                for (var i = 0; i < response.data.length; i++) {
                  var book = response.data[i];
                  cache.book[book.id] = book;
                }
                console.log(cache.book);
                return response;
              });
            },
          },
          contents: {
            resolve: function($http, $route) {
              if (!parseInt($route.current.params.id)) {
                return null;
              }
              if (cache.content[$route.current.params.id]) {
                return cache.content[$route.current.params.id];
              }
              var params = {
                  type: 'book',
                  act: 'info',
                  id: $route.current.params.id
              };
              return skyex.post($http, params, function(response) {
                if (response.data && response.data.length) {
                  cache.content[$route.current.params.id] = response;
                }
                return response;
              });
            }
          },
          none: {
            resolve: function() {
              return null;
            }
          }
      };
      
      local.resolves = resolves;
      
      local.controller = [
          '$scope',
          '$route',
          '$location',
          '$rootScope',
          'resolve',
          function($scope, $route, $location, $rootScope, resolve) {
            var url = $route.current.templateUrl.substring(templateBase.length);
            var tempInfo = local.templates[url];
            if (!tempInfo)
              return;
            page = 1;
            var header = {};
            $rootScope.parseImage = util.parseUrl;
            $rootScope.back = function() {
              $location.path('/local/book');
            };
            switch (tempInfo.id) {
            case 1:
              header = {
                  title: '所有书籍',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $scope.books = resolve.data;
              break;
            case 2:
              header = {
                  title: '书籍详情',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $scope.book = cache.book[$route.current.params.id];
              $scope.chapters = resolve.data;
              $rootScope.back = function() {
                $location.path('/local/book/all');
              };
              $scope.download = function() {
                console.log("inside download");
              };
              $scope.change = function() {
                console.log("inside subscribe");
                console.log($scope.selectedItem);
              };
              break;
            case 3:
              header = {
                  title: cache.book[$route.current.params.id].name,
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $rootScope.back = function() {
                $location.path('/local/book/content/' + $route.current.params.id);
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
                      .path('/local/book/'
                          + $route.current.params.id
                          + '/chapter/'
                          + cache.content[$route.current.params.id].data[resolve.data[0].order].id);
                }
              };
              break;
            }
            util.swap(0);
            
            $rootScope.header = header;
            
            // $scope.books = $injector.get('locals');
            
            //
            $scope.$on('$routeChangeSuccess', util.contentLoad);
          }];
      local.templates = {
          'local/book/list.html': {
              id: 1,
              url: '/local/book',
              resolve: resolves.books
          
          },
          'local/book/content.html': {
              id: 2,
              url: '/local/book/content/:id',
              resolve: resolves.contents
          },
          'local/book/chapter.html': {
              id: 3,
              url: '/local/book/:id/chapter/:cid',
              resolve: resolves.chapter
          }
      };
      return local;
    });