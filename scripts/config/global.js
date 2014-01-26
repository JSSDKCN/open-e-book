require.config({
  baseUrl: 'scripts',
  paths: {
      // the left side is the module ID,
      // the right side is the path to
      // the jQuery file, relative to baseUrl.
      // Also, the path should NOT include
      // the '.js' file extension. This example
      // is using jQuery 1.9.0 located at
      // js/lib/jquery-1.9.0.js, relative to
      // the HTML page.
      jquery: '../Library/jquery-2.0.3.min',
      underscore: '../Library/underscore-1.5.2.min',
      backbone: '../Library/backbone-1.1.0.min',
      jquerymobile: '../Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0',
      skyex: 'config/skyex',
      req: 'library/request',
      file: 'library/file',
      j2html: '../Library/json2html',
      dom: 'dom',
      user: 'controllers/user',
      book: 'controllers/book',
      category: 'controllers/category',
      more: 'controllers/more',
      app: 'jqmapp',
      start: 'start',
      main: 'main'
        
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
      }
    }
  });
require(['start'], function(start) {
  start();
});
