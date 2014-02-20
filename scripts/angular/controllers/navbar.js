define(function() {
  return ['$scope', function($scope) {
    $scope.navbars = [{
        'name': '书籍',
        'id': 0,
        'icon': 'search',
        'href': 'book'
    }, {
        'name': '分类',
        'id': 1,
        'href': 'category',
        'icon': 'grid'
    }, {
        'name': '我的天易',
        'id': 2,
        'href': 'user',
        'icon': 'home'
    }, {
        'name': '更多',
        'id': 3,
        'href': 'more',
        'icon': 'gear'
    }];
  }];
});