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
        setTimeout(function() {
          var listview = jQuery('ul[data-role=listview]');
          if (listview && listview.listview)
            listview.listview().listview('refresh');
          var checkboxradio = jQuery("input[type='radio']");
          if (checkboxradio && checkboxradio.checkboxradio) {
            checkboxradio.checkboxradio("refresh");
          }
          window.scrollTo(0, 0);
        }, 10);
        
        jQuery('div[data-role=header]').trigger('refresh');
        jQuery('div[data-role=content]').trigger('create');
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