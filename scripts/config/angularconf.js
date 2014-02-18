require.config({
    baseUrl: 'scripts',
    paths: {
        angular: '../Library/angular/angular',
        'angular-resource': '../Library/angular/angular-resource',
        'angular-route': '../Library/angular/angular-route',
        jQuery: '../Library/jquery-2.0.3',
        jQueryMobile: '../Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0',
        bootstrap: 'bootstrap',
        domReady: '../Library/requirejs/domReady',
        skyex: 'config/skyex',
        req: 'library/request',
        file: 'library/file',
        j2html: '../Library/json2html',
        dom: 'dom',
        user: 'controllers/user',
        book: 'controllers/book',
        category: 'controllers/category',
        more: 'controllers/more',
        app: 'app',
        start: 'start',
        main: 'main',
    
    },
    shim: {
        'jQuery': {
          exports: 'jQuery'
        },
        'jQueryMobile': {
          deps: ['jQuery']
        },
        'angular': {
          'exports': 'angular'
        },
        'angular-resource': {
          deps: ['angular']
        },
        'angular-route': {
          deps: ['angular']
        },
    },
    deps: ['bootstrap']

});
