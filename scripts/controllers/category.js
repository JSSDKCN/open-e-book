define(['jquery', 'skyex', 'req', 'dom'], function($, skyex, req, xdom) {
  skyex.app.category = {
      idx: 2,
      pid : [],
      get : function(id, next) {
        skyex.app.tab.swap($('#nav-bar-' + skyex.app.category.idx));
        id = id || 0;
        console.log("id = " + id);
        skyex.app.book.backBtn('书籍分类', {
          click : function() {
            var pid = skyex.app.category.pid.pop();
            skyex.app.category.get(pid);
            return false;
          }
        });
        if (parseInt(id)) {
          $('#backBtn').show();
        } else {
          $('#backBtn').hide();
        }

        $('.wrapper').html('');

        skyex.lib.req(skyex.requestUrl, 'type=category&id=' + id, function(data) {
          switch (data.status) {
          case 1:
            var cats = data.data;
            if (!cats.length) {
              skyex.app.book.list(id);
              return;
            }
            var ul = $('<ul>').attr('data-role', 'listview').attr('data-role', 'insert');
            var li = $('<li>');
            var a, all = $('<a>').html('所有书籍').hide();
            all.click(function() {
              console.log('inside');
              skyex.app.book.initMainSearch();
            });

            li.append(all);
            ul.append(li);
            $('.wrapper').append(ul);

            for (var i = 0; i < cats.length; i++) {
              li = $('<li>');
              a = $('<a>').html(cats[i].name);
              for ( var k in cats[i]) {
                a.attr('data-' + k, cats[i][k]);
              }
              a.click((function(cat) {
                return function() {
                  skyex.app.category.get(cat.id);
                  console.log('inside push ');
                  skyex.app.category.pid.push(cat.pid);
                };
              })(cats[i]));
              li.append(a);
              ul.append(li);
            }
            ul.listview();
            ul.listview('refresh');
            if (next) {
              next();
            }
            break;
          }
        });
      }
    };
  return skyex.app.category;
});