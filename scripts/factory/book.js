define(['skyex'], function(skyex) {
  var book = {};
  var cache = {
      book: {},
      content: {},
      chapter: {},
      search: {},
      sub: {},
      category: {},
  };
  
  var pids = new Array();
  
  book.init = function($http) {
    this.$http = $http;
  };
  
  
  
  book.cache = cache;
  book.pids = pids;
  
  book.category = {};
  
  book.post = function(params, callback) {
    return skyex.post(this.$http, params, function(response) {
      if (callback) {
        callback(response);
      }
      return response;
    });
  };
  
  book.category.book = function(id, page) {
    if (!parseInt(id)) {
      return null;
    }
    var params = {
        type: 'book',
        act: 'list',
        id: id,
        page: page
    };
    return book.post(params, function(response) {
      for (var i = 0; i < response.data.length; i++) {
        var book = response.data[i];
        cache.book[book.id] = book;
      }
      return response;
    });
  };
  
  book.category.list = function(id, $location) {
    var pid = id ? id : 0;
    var params = {
        type: 'category',
        id: pid
    };
    if (cache.sub[pid]) {
      if (pid == 0) {
        pids = ['0'];
      } else {
        pids.push(pid);
      }
      return cache.sub[pid];
    }
    
    return book.post(params, function(response) {
      console.log('inside resolve category');
      
      if (!response.data.length) {
        console.log('inside no sub category found');
        $location.path('/category/' + pid + '/book');
        return null;
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
  };
  
  book.search = function(q, page, callback) {
    p = page;
    var params = {
        type: 'book',
        act: 'search',
        page: page,
        q: q
    };
    return this.post(params, function(response) {
      for (var i = 0; i < response.data.length; i++) {
        var book = response.data[i];
        cache.book[book.id] = book;
      }
      if (callback) {
        callback(response);
      }
    });
  };
  
  book.content = function(id, callback) {
    if (!parseInt(id)) {
      return null;
    }
    var params = {
        type: 'book',
        act: 'info',
        id: id
    };
    return this.post(params, function(response) {
      if (response.data && response.data.length) {
        cache.content[id] = response;
      }
      if (callback) {
        callback(response);
      }
    });
  };
  
  book.chapter = function(id, callback) {
    if (!parseInt(id)) {
      return null;
    }
    var params = {
        type: 'book',
        act: 'chapter',
        id: id
    };
    return this.post(params, function(response) {
      for (var i = 0; i < response.data.length; i++) {
        var chapter = response.data[i];
        cache.chapter[chapter.id] = chapter;
      }
      if (callback) {
        callback(response);
      }
    });
  };
  
  return function($http) {
    console.log('inside book factory');
    book.init($http);
    // $scope.book = book;
    return book;
  };
});