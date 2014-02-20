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
          if (listview)
            listview.listview().listview('refresh');
        }, 10);
        
        jQuery('div[data-role=header]').trigger('refresh');
        jQuery('div[data-role=content]').trigger('create');
      }
  };
});