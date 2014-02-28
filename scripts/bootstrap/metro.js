require(['jQuery', 'app', 'angular', 'angular-resource', 'domReady', 'jQueryWidget', 'ionic'], function(
    $, ng, ngResource, app, domReady) {
  domReady(function() {
    angular.bootstrap(document, ['app']);
    angular.module("app", ['ionic']);
    console.log('app bootstrap');

  });
  require(['metroCore', 'metroButtonSet'], function() {
  });
});