require(['jQuery', 'app', 'angular', 'angular-resource', 'domReady', 'ionic',
    'ionicAngular', 'ionicBundle'], function($, ng, ngResource, app, domReady) {
  domReady(function() {
    angular.bootstrap(document, ['app']);
    console.log('app bootstrap');
  });
});