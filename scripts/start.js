define(['jquery'], function(jquery) {
  return function() {
    console.log('inside start 1');
    require(['file'], function(book) {
      require(['j2html', 'dom', 'app'], function() {
    
      require(['jquerymobile'], function(jqm) {
        console.log("inside jquery mobile");
      });
    });
    });
  };
});