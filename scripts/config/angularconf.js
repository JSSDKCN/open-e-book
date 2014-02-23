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
        skyex: 'angular/factory/skyex',
        util: 'angular/factory/util',
        category: 'angular/controllers/category',
        navbar: 'angular/controllers/navbar',
        book: 'angular/controllers/book',
        more: 'angular/controllers/more',
        app: 'app',
    
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
