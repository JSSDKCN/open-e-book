define(function() {
  return {
      swap: function(id) {
        var activeClass = 'active';
        $('.' + activeClass).each(function() {
          $(this).removeClass(activeClass);
        });
        $('#nav-bar-' + id).addClass(activeClass);
      },
      
      contentLoad: function() {

      },
      parseUrl: function(imageIds) {
        var url = '';
        try {
          imageIds = eval("(" + imageIds + ")");
        } catch (e) {
          imageIds = null;
        }
        
        if (imageIds && imageIds.length) {
          imageIds = imageIds[0];
          
          for ( var k in imageIds) {
            url = imageIds[k];
            break;
          }
        }
        return url;
      }
  };
});