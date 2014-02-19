require(['jQuery', 'app', 'angular', 'angular-resource', 'domReady'], function($, ng, ngResource, app, domReady) {
  domReady(function() {
    angular.bootstrap(document, ['app']);
    console.log('app bootstrap');
  });
  require(['jQueryMobile'], function() {
    $('div[data-role=page]').show();
  });
});