define(
    ['util', 'skyex'],
    function(util, skyex) {
      var category = {};
      
      var page = 1;
      
      var resolves = {
          none: {
            resolve: function() {
              return null;
            }
          },
          chapters: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.chapter($route.current.params.cid);
            }
          },
          contents: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.content($route.current.params.bid);
            }
          },
          books: {
            resolve: function($http, $route, bookFactory) {
              return bookFactory.category.book($route.current.params.id, page);
            }
          },
          categories: {
            resolve: function($http, $route, $location, bookFactory) {
              return bookFactory.category.list($route.current.params.id,
                  $location);
            }
          }
      };
      
      category.resolves = resolves;
      
      category.controller = [
          '$scope',
          '$route',
          '$rootScope',
          '$location',
          'resolve',
          'bookFactory',
          function($scope, $route, $rootScope, $location, resolve, bookFactory) {
            var bf = bookFactory;
            var cache = bookFactory.cache;
            page = 1;
            var url = $route.current.templateUrl.substring(templateBase.length);
            var tempInfo = category.templates[url];
            if (!tempInfo)
              return;
            var header = {};
            $rootScope.parseImage = util.parseUrl;
            switch (tempInfo.id) {
            case 1:
              header = {
                title: '书籍分类'
              };
              var pid = bf.category.getPid();
              console.log("pid = " + pid);
              if (pid != 0) {
                title = cache.category[pid].name;
                header = {
                    title: '书籍分类',
                    showBackButton: true,
                    backButtonIcon: 'arrow-l',
                    backButtonText: '返回',
                };
              }
              
              console.log('inside 1');
              $rootScope.back = function() {
                console.log('inside back');
                var ppid = bf.category.getBackId();
                /*
                 * if (pids.length > 1) { ppid = pids[pids.length - 2];
                 * console.log(pids); bookFactory.pids.pop(); if (pids.length >
                 * 1) { bookFactory.pids.pop(); } console.log(pids); }
                 * console.log(ppid);
                 */

                var path = '/category/' + ppid;
                $location.path(path);
              };
              if (resolve) {
                $scope.categories = resolve.data;
              }
              
              break;
            case 2:
              header = {
                title: '书籍分类'
              };
              //console.log(pids);
              
              var pid = bf.category.getBookPid();
              
              if (pid != 0) {
                title = cache.category[pid].name;
                header = {
                    title: title,
                    showBackButton: true,
                    backButtonIcon: 'arrow-l',
                    backButtonText: '返回',
                };
              }
              // conso
              
              $rootScope.back = function() {
                console.log('inside back');
                var ppid = bf.category.getBookBackPid();

                var path = '/category/' + ppid;
                $location.path(path);
              };
              
              $scope.category = cache.category[$route.current.params.id];
              $scope.books = resolve.data;
              
              $scope.more = function() {
                console.log('more ... ');
                console.log(page);
                page = page + 1;
                bookFactory.category.book($route.current.params.id, page,
                    function(response) {
                      console.log('more end ..');
                      console.log(response);
                      if (!response.data.length) {
                        $('#more').remove();
                      } else {
                        $scope.books.concat(response.data);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        // $scope.$apply();
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
              $scope.book = cache.book[$route.current.params.bid];
              
              $scope.category = cache.category[$route.current.params.id];
              $scope.chapters = resolve.data;
              
              $rootScope.back = function() {
                $location.path('/category/' + $route.current.params.id
                    + '/book');
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
              var book = cache.book[$route.current.params.bid];
              header = {
                  title: book.name,
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回'
              };
              $scope.book = book;
              
              $scope.category = cache.category[$route.current.params.id];
              console.log(resolve);
              $scope.chapter = resolve.data[0];
              
              $rootScope.back = function() {
                $location.path('/category/' + $route.current.params.id
                    + '/book/' + $route.current.params.bid + '/content');
              };
              $scope.download = function() {
                console.log("inside download");
              };
              $scope.nextChapter = function() {
                var book = cache.content[parseInt($route.current.params.bid)];
                
                if (book.data.length > resolve.data[0].order) {
                  $location.path('/category/' + $route.current.params.id
                      + '/book/' + $route.current.params.bid + '/chapter/'
                      + book.data[resolve.data[0].order].id);
                }
              };
              break;
            }
            util.swap(1);
            
            $rootScope.header = header;
            
            $scope.$on('$routeChangeSuccess', util.contentLoad);
          }];
      category.templates = {
          'category/main.html': {
              id: 1,
              url: '/category/:id',
              resolve: resolves.categories
          
          },
          'category/book/list.html': {
              id: 2,
              url: '/category/:id/book',
              resolve: resolves.books
          },
          'category/book/content.html': {
              id: 3,
              url: '/category/:id/book/:bid/content',
              resolve: resolves.contents
          },
          'category/book/chapter.html': {
              id: 4,
              url: '/category/:id/book/:bid/chapter/:cid',
              resolve: resolves.chapters
          },
      
      };
      return category;
    });