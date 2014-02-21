define(['util', 'skyex'], function(util, skyex) {
  var category = {};
  var pids = [];
  var cacheCategory = {

  };
  category.resolve = {
    categories: function($http, $route) {
      var pid = $route.current.params.id ? $route.current.params.id : 0;
      var params = {
          type: 'category',
          id: pid
      };
      

      console.log(pids);
      if (cacheCategory[pid]) {
        if (((pid == 0) && (pids.length <= 0)) || pid != 0) {
          pids.push(pid);
        }
        return cacheCategory[pid];
      }
      
      return skyex.post($http, params, function(response) {
        cacheCategory[pid] = response;
        if (((pid == 0) && (pids.length <= 0)) || pid != 0) {
          pids.push(pid);
        }
        return response;
      });
    }
  };
  
  category.controller = ['$scope', '$rootScope', '$location', 'categories', function($scope, $rootScope, $location, categories) {
    console.log('inside category ctrl');
    console.log(categories.data);
    console.log(pids);
    util.swap(1);
    var title = '书籍分类';
    var header = {
      title: title
    };
    if (pids.length > 1) {
      //
      var pid = pids[pids.length - 1];
      console.log(pid);
      console.log(cacheCategory);
      if (pid != 0) {
        title = cacheCategory[pid].name;
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
      console.log(path);
      

      $location.path(path);
    };
    
    $rootScope.header = header;
    
    $scope.categories = categories.data;
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  }];
  return category;
});