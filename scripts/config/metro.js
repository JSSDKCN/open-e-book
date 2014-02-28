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
        metroCore: '../Library/metro/scripts/metro-core',
        metroButtonSet: '../Library/metro/scripts/metro-button-set',
        
        
        
        jQuery: '../Library/jquery-2.0.3',
        jQueryWidget: '../Library/jquery-ui-1.10.4/ui/jquery.ui.widget',
        domReady: '../Library/requirejs/domReady',
        //End System Libraries
        
        
        //Boot or global objects
        bootstrap: 'bootstrap/metro',
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
        'jQueryWidget': {
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
        }
    },
    deps: ['bootstrap']

});

window.templateBase = "templates/jquerymobile/";
window.angularModules = ['ngResource', 'ngRoute'];