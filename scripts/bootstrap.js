require(['jQuery', 'app', 'angular', 'angular-resource', 'domReady'], function(
    $, ng, ngResource, app, domReady) {
  domReady(function() {
    angular.bootstrap(document, ['app']);
    console.log('app bootstrap');
  });
  if (!location.host) {
    $('div[data-role=page]').show();
  } else {
    require(['jQueryMobile'], function() {
      $('div[data-role=page]').show();
    });
  }
  
});