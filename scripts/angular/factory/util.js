define(function() {
  return {
      swap: function(id) {
        $('div[data-role=navbar] ul li a').each(function() {
          $(this).removeClass('ui-btn-active');
        });
        $('#nav-bar-' + id).addClass('ui-btn-active');
      },
      
      contentLoad: function() {
        // var button = jQuery('a[data-role=button]');
        // if (button) button.button();
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