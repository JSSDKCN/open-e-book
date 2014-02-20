define(['util', 'skyex'], function(util, skyex) {
  var category = {};
  category.resolve = {
      categories: function($http, $route) {
        var params = {
            type: 'category',
            id: $route.current.params.id ? $route.current.params.id : 0
        };
        
        return skyex.post($http, params, function(data) {
          console.log('inside category sucess');
          console.log(data);
          return data;
        });
      }
    };
  
  category.controller = ['$scope', '$rootScope', 'categories', function($scope, $rootScope, categories) {
    console.log('inside category ctrl');
    console.log(categories.data);
    util.swap(1);
    var header = {
      title: '书籍分类'
    };
    $rootScope.header = header;
    
    $scope.categories = categories.data;
    $scope.$on('$routeChangeSuccess', util.contentLoad);
  }];
  return category;
});