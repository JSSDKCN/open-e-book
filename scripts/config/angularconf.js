require.config({
    baseUrl: 'scripts',
    paths: {
      
        //System Libraries
        angular: '../Library/angular-1.2.13/angular',
        'angular-resource': '../Library/angular-1.2.13/angular-resource',
        'angular-route': '../Library/angular-1.2.13/angular-route',
        jQuery: '../Library/jquery-2.0.3',
        //jQuery: '../Library/jquery-1.11.0',
        jQueryMobile: '../Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0',
        domReady: '../Library/requirejs/domReady',
        //End System Libraries
        
        
        //Boot or global objects
        bootstrap: 'bootstrap',
        app: 'app',
        
        //Angular Modules
        skyex: 'angular/factory/skyex',
        util: 'angular/factory/util',
        category: 'angular/controllers/category',
        navbar: 'angular/controllers/navbar',
        book: 'angular/controllers/book',
        more: 'angular/controllers/more',
        user: 'angular/controllers/user',
        
        
        //Angular templates
        templates: 'angular/templates',
        
    
    },
    shim: {
        'jQuery': {
          exports: 'jQuery'
        },
        'jQueryMobile': {
          deps: ['jQuery']
        },
        'angular': {
          exports: 'angular'
        },
        'angular-resource': {
          deps: ['angular']
        },
        'angular-route': {
          deps: ['angular']
        },
        'templates': {
          deps: ['angular']
        }
    },
    deps: ['bootstrap']

});
