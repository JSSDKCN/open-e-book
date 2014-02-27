define(['util', 'skyex'], function(util, skyex) {
  var category = {};
  var pids = new Array();
  
  var cache = {
      book: {},
      sub: {

      },
      category: {

      },
      content: {

      },
      chapter: {
        
      }
  };
  
  var page = 1;
  
  var resolves = {
      none: {
        resolve: function() {
          return null;
        }
      },
      chapters: {
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
      contents: {
        resolve: function($http, $route) {
          var id = $route.current.params.bid;
          console.log('id = ' + id);
          if (!parseInt(id)) {
            return null;
          }
          console.log(cache.content);
          if (cache.content[id]) {
            return cache.content[id];
          }
          var params = {
              type: 'book',
              act: 'info',
              id: id
          };
          return skyex.post($http, params, function(response) {
            if (response.data && response.data.length) {
              cache.content[id] = response;
            }
            return response;
          });
        }
      },
      books: {
        resolve: function($http, $route, $location) {
          if (!parseInt($route.current.params.id)) {
            return null;
          }
          var params = {
              type: 'book',
              act: 'list',
              id: $route.current.params.id,
              page: page
          };
          return skyex.post($http, params, function(response) {
            for (var i = 0; i < response.data.length; i++) {
              var book = response.data[i];
              cache.book[book.id] = book;
            }
            return response;
          });
        }
      },
      categories: {
        resolve: function($http, $route, $location) {
          var pid = $route.current.params.id ? $route.current.params.id : 0;
          var params = {
              type: 'category',
              id: pid
          };
          console.log(pid);
          
          console.log(pids);
          if (cache.sub[pid]) {
            
            if (pid == 0) {
              pids = ['0'];
            } else {
              pids.push(pid);
            }
            return cache.sub[pid];
          }
          
          return skyex.post($http, params, function(response) {
            console.log('inside resolve category');
            
            if (!response.data.length) {
              console.log('inside no sub category found');
              $location.path('/category/' + pid + '/book');
              return;
            }
            cache.sub[pid] = response;
            if (pid == 0) {
              pids = [0];
            } else {
              pids.push(pid);
            }
            for (var i = 0; i < response.data.length; i++) {
              var categroy = response.data[i];
              cache.category[categroy.id] = categroy;
            }
            
            console.log(response.data);
            
            return response;
          });
        }
      }
  };
  
  category.resolves = resolves;
  
  category.controller = ['$scope', '$route', '$rootScope', '$location',
      'resolve', function($scope, $route, $rootScope, $location, resolve) {
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
          if (pids.length > 1) {
            //
            var pid = pids[pids.length - 1];
            if (pid != 0) {
              title = cache.category[pid].name;
              header = {
                  title: '书籍分类',
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
              };
            }
          }
          
          $rootScope.back = function() {
            console.log('inside back');
            var ppid = 0;
            if (pids.length > 1) {
              ppid = pids[pids.length - 2];
              console.log(pids);
              pids.pop();
              if (pids.length > 1) {
                pids.pop();
              }
              console.log(pids);
            }
            console.log(ppid);
            
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
          if (pids.length > 1) {
            //
            var pid = pids[pids.length - 1];
            if (pid != 0) {
              title = cache.category[pid].name;
              header = {
                  title: title,
                  showBackButton: true,
                  backButtonIcon: 'arrow-l',
                  backButtonText: '返回',
              };
            }
          }
          
          $rootScope.back = function() {
            console.log('inside back');
            var ppid = 0;
            if (pids.length >= 1) {
              ppid = pids[pids.length - 1];
              pids.pop();
            }
            var path = '/category/' + ppid;
            $location.path(path);
          };
          
          $scope.category = cache.category[$route.current.params.id];
          $scope.books = resolve.data;
          
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
            $location.path('/category/' + $route.current.params.id + '/book');
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
            $location.path('/category/' + $route.current.params.id + '/book/' + $route.current.params.bid + '/content');
          };
          $scope.download = function() {
            console.log("inside download");
          };
          $scope.nextChapter = function() {
            var book = cache.content[parseInt($route.current.params.bid)];
            console.log('category next chapter');
            console.log(resolve.data);
            console.log(cache.content);
            console.log([$route.current.params.bid]);
            
            if (book.data.length > resolve.data[0].order) {
              $location
                  .path('/category/'
                      + $route.current.params.id
                      + '/book/'
                      + $route.current.params.bid
                      + '/chapter/'
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