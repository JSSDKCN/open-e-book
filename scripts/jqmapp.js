define(['jquery', 'skyex', 'req', 'dom', 'user', 'book', 'category', 'more'], function($, skyex, req, xdom, user, book,
    category, more) {
  
  skyex.app.tab = {
      cur : null,
      swap : function(node) {
        if (skyex.app.tab.cur) {
          skyex.app.tab.cur.removeClass('ui-btn-active');
        }
        $(node).addClass('ui-btn-active');
        skyex.app.tab.cur = $(node);
      },
      
      init : function() {
        var tabs = [{
            'name' : '我的天易',
            'icon' : 'home',
            'action' : function() {
              // skyex.app.user.idx = 0;
              // skyex.app.user.init();
              user.init();
            }
        }, {
            'name' : '书籍',
            'icon' : 'search',
            'action' : function() {
              category.pid = [];
              book.init();
            }
        }, {
            'name' : '分类',
            'icon' : 'grid',
            'action' : function() {
              
              category.get();
            }
        }, {
            'name' : '更多',
            'icon' : 'gear',
            'action' : function() {
              more.init();
            }
        }];
        
        // var cur = null;
        var ul = $('<ul>');
        for (var i = 0; i < tabs.length; i++) {
          var a = $('<a>');
          var li = $('<li>');
          a.html(tabs[i].name);
          a.attr('data-id', i);
          console.log('icon' + tabs[i].icon);
          a.attr('data-icon', tabs[i].icon);
          
          a.click(function() {
            skyex.app.book.page = 1;
            skyex.app.tab.swap(this);
            tabs[$(this).attr('data-id')].action();
          });
          a.attr('id', 'nav-bar-' + i);
          
          li.append(a);
          ul.append(li);
          
          if (i == 0) {
            console.log('inside trigger');
            setTimeout((function(a) {
              return function() {
                a.trigger('click');
              };
            })(a), 100);
          }
        }
        var navbar = $('<div>').attr('data-role', 'navbar').append(ul);
        $('#footer').append(navbar);
        navbar.navbar();
      }
  };
  
  $(document).bind("mobileinit", function() {
    console.log($.mobile);
    $.support.cros = true;
    $.mobile.allowCrossDomainPages = true;
    // skyex.app.box.init();
    skyex.app.tab.init();
  });
  
  var bm = BookManager;
  
  document.addEventListener("deviceready", function() {
    
    bm.init('books', function() {
      console.log('inside init');
      bm.list(function(files) {
        for (var i = 0; i < files.length; i++) {
          console.log(files[i].name);
        }
      });
      /*
       * bm.save('3.txt', "new file\n", function() { console.log('created new
       * file 3.txt'); bm.remove('2.txt'); });
       */

    });
    /*
     * createDirectory('books', function() { createFile('books/2.txt', 'this is
     * a novel\n', function() { listFile('books'); }); });
     */
  }, false);
  
});
