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
      
      pids.push(pid);
      
      if (cacheCategory[pid]) {
        return cacheCategory[pid];
      }
      
      return skyex.post($http, params, function(response) {
        cacheCategory[pid] = response;
        return response;
      });
    }
  };
  
  category.controller = ['$scope', '$rootScope', 'categories', function($scope, $rootScope, categories) {
    console.log('inside category ctrl');
    console.log(categories.data);
    util.swap(1);
    var title = '书籍分类';
    var header = {
      title: title
    };
    if (pids.length > 1) {
      //var ppid = pids[pids.length - 2];
      var pid = pids[pids.length - 1];
      console.log(pid);
      console.log(cacheCategory);
      if (pid) {
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
    };
    
    $rootScope.header = header;
    
    $scope.categories = categories.data;
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  }];
  return category;
});