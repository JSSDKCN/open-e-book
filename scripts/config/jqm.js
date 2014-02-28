require.config({
    baseUrl: 'scripts',
    paths: {
      
        //Angular Libraries
        angular: '../Library/angular-1.2.13/angular',
        'angular-resource': '../Library/angular-1.2.13/angular-resource',
        'angular-route': '../Library/angular-1.2.13/angular-route',
        'angular-animatee': '../Library/angular-1.2.13/angular-animate',
        'angular-sanitize': '../Library/angular-1.2.13/angular-sanitize',
        'angular-ui-router': '../Library/angular-1.2.13/angular-ui-router',
        
        
        //ionic Library
        ionic: '../Library/ionic/scripts/ionic',
        ionicBundle: '../Library/ionic/scripts/ionic.bundle',
        ionicAngular: '../Library/ionic/scripts/ionic-angular',
        
        
        jQuery: '../Library/jquery-2.0.3',
        //jQuery: '../Library/jquery-1.11.0',
        jQueryMobile: '../Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0',
        domReady: '../Library/requirejs/domReady',
        //End System Libraries
        
        
        //Boot or global objects
        bootstrap: 'bootstrap/jquerymobile',
        app: 'app',
        
        //Angular Modules
        skyex: 'factory/skyex',
        util: 'factory/util',
        category: 'controllers/category',
        navbar: 'controllers/navbar',
        book: 'controllers/book',
        more: 'controllers/more',
        user: 'controllers/user',
        local: 'controllers/local',
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
        ionicAngular: {
          deps: ['angular', 'ionic']
        },
        ionicBundle: {
          deps: ['ionic']
        }
    },
    deps: ['bootstrap']

});

window.templateBase = "templates/jquerymobile/";
window.angularModules = ['ngResource', 'ngRoute'];
