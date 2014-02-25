define(['jquery', 'skyex', 'req', 'dom'], function($, skyex, req, xdom) {
  skyex.app.book = {
      idx: 0,
      bar : null,
      page : 1,
      more : null,
      books : {},
      chapters : null,
      localBook : function(book) {
        skyex.app.book.backBtn('书籍信息', {
            click : function() {
              
              skyex.app.book.local();
              return false;
            },
            show : true
        });
        
        $('.wrapper').html('');
        var list = $('<ul>').attr('data-role', 'listview');
        
        sections = $.array2html(xdom.htmlTemplate['booklocalHeader'], null, book);
        for (var i = 0; i < sections.length; i++) {
          list.append(sections[i]);
        }
        $('.wrapper').append(list);
        list.append('<li data-role="list-divider" style="text-align:center">目录</li>');
        
        bm.getChapterInfo(book.id, function(data) {
          
          var chapters = JSON.parse(data);
          // book.chapters = chapters;
          for (var i = 0; i < chapters.length; i++) {
            // console.log(chapters[i])
            skyex.app.book.addLocalChapter(book, chapters[i], list, i + 1, chapters);
          }
          
          list.listview();
          list.listview('refresh');
        });

        // $('.wrapper').trigger('create');
      },
      local : function() {
        bm.list(function(books) {
          $('.wrapper').html('');
          skyex.app.book.backBtn('下载图书列表', {
              click : function() {
                skyex.app.book.init();
                return false;
              },
              show : true
          });
          if (!books || books.length < 1) {
            var noData = $('<p class="notFound">').html('暂无书籍!');
            $('.wrapper').append(noData);
          } else {
            console.log("book length = " + books.length);
            var list = $('<ul>').attr('data-role', 'listview');
            for (var i = 0; i < books.length; i++) {
              
              if (!books[i].isDirectory) {
                continue;
              }
              var a = $('<a>');
              (function(node, book) {
                bm.getBookInfo(book.name, function(data) {
                  var lb = JSON.parse(data);
                  node.html(lb.name + '-' + lb.author);
                  node.click(function() {
                    skyex.app.book.localBook(lb);
                  });
                  
                });
              })(a, books[i]);
              var li = $('<li>').append(a);
              li.on('taphold', (function(name) {
                return function() {
                  var self = this;
                  
                  if (confirm('你确定要删除当前书籍吗?\n操作不可恢复')) {
                    bm.removeDir(name, function() {
                      console.log('remove file' + name)
                      $(self).remove();
                    });
                  }
                };
              })(books[i].name));
              
              list.append(li);
            }
            $('.wrapper').append(list);
            list.listview();
          }
        });
      },
      add : function() {
        skyex.app.book.backBtn('添加新书', {
          click : function() {
            skyex.app.book.init();
            return false;
          },
        });
        $.json2html(xdom.htmlTemplate['initAddBook'], $('.wrapper'));
      },
      byBook : function(book, list) {
        skyex.lib.req(skyex.requestUrl, 'type=book&act=info&id=' + book.id, function(data) {
          switch (data.status) {
          case 1:
            var chapters = data.data;
            skyex.app.book.chapters = chapters;
            if (!chapters.length) {
              var noData = $('<p>').addClass('no_data').html('好象出问题了!');
              noData.insertBefore(skyex.app.book.more);
              return;
            }
            
            list.append('<li data-role="list-divider" style="text-align:center">目录</li>');
            
            // book.chapters = chapters;
            for (var i = 0; i < chapters.length; i++) {
              chapters[i].book = book;
              skyex.app.book.addChapter(book, chapters[i], list, i + 1, chapters);
            }
            list.listview('refresh');
            skyex.app.book.more.a.unbind();
            
            skyex.app.book.more.hide();
            break;
          }
        });
      },
      byCategory : function(list, id, page, next) {
        skyex.lib.req(skyex.requestUrl, 'type=book&act=list&id=' + id + '&page=' + page, function(data) {
          switch (data.status) {
          case 1:
            var books = data.data;
            console.log(data);
            if (!books.length) {
              if (skyex.app.book.page == 1) {
                jqm_alert('inside 1');
                var noData = $('<p>').html('暂无书籍!');
                noData.insertBefore(skyex.app.book.more);
              }
              skyex.app.book.more.a.unbind();
              skyex.app.book.more.hide();
              
              return;
            }
            
            for (var i = 0; i < books.length; i++) {
              skyex.app.book.books[books[i].id] = books[i];
              var node = skyex.app.book.addNode(books[i], id);
              node.insertBefore(skyex.app.book.more);
            }
            skyex.app.book.more.a.unbind();
            skyex.app.book.more.a.click(function() {
              skyex.app.book.byCategory(list, id, skyex.app.book.page++);
            });
            list.listview();
            skyex.app.book.more.show();
            break;
          }
        });
      },
      backBtn : function(title, left, right) {
        function fd(data) {
          data = data || {};
          var da = {
            text : '返回'
          };
          
          for ( var i in da) {
            if (!data[i]) {
              data[i] = da[i];
            }
          }
          return data;
        }
        
        $.array2html(xdom.htmlTemplate['navBar'], $('.bar-title'), {
            title : title,
            left : fd(left),
            right : fd(right)
        });
        // $('.bar-title').header();
        $.mobile.resetActivePageHeight();
        // $('div[data-role=page]').trigger('pagecreate');
      },
      list : function(id) {
        
        $('.wrapper').html('');
        skyex.app.book.backBtn('书籍列表', {
            click : function() {
              var pid = skyex.app.category.pid.pop();
              skyex.app.category.get(pid);
              return false;
            },
            show : true
        });
        // skyex.app.book.initSearch();
        var list = skyex.app.book.initFrame(true);
        skyex.app.book.more.hide();
        skyex.app.book.page = 1;
        skyex.app.book.byCategory(list, id, skyex.app.book.page++);
      },
      initBook : function(id) {
        skyex.app.book.backBtn('书籍信息', {
            click : function() {
              if (skyex.app.category.pid.length) {
                console.log('inside initBook 1');
                var pid = skyex.app.category.pid.pop();
                skyex.app.category.get(pid);
              } else {
                console.log('inside initBook 2');
                skyex.app.book.initMainSearch();
              }
              return false;
            },
            show : true
        });
        
        $('.wrapper').html('');
        var list = $('<ul>').attr('data-role', 'listview');
        
        sections = $.array2html(xdom.htmlTemplate['bookHeader'], null, skyex.app.book.books[id]);
        for (var i = 0; i < sections.length; i++) {
          list.append(sections[i]);
        }
        $('.wrapper').append(list);
        
        list.listview();
        
        skyex.app.book.byBook(skyex.app.book.books[id], list);
        
      },
      initSearch : function() {
        return;
        var query = $('<input>').attr('type', 'search').attr('name', 'q').val('').attr('placeholder', '请输入要搜索的书名')
            .textinput();
        var form = $('<form>');
        form.append(query);
        form.bind('submit', function() {
          skyex.app.book.page = 1;
          console.log(query);
          jqm_alert('inside v = ' + query.val());
          if (query.val()) {
            skyex.app.book.initMainSearch(query.val());
          }
          return false;
        });
        
        $('.wrapper').append(form);
        $('.wrapper').append($('<br/>'));
        skyex.app.tab.swap($('#nav-bar-' + skyex.app.book.idx));
        $('.wrapper').trigger('create');
        
      },
      initFrame : function(filter) {
        var a = $('<a>').attr('id', 'more').html('显示更多...').css('text-align', 'center');
        var list = $('<ul>').addClass('book_list').attr('data-role', 'listview').attr('data-insert', 'true');
        if (filter) {
          list.attr('data-filter', true).attr('data-filter-placeholder', '请输入书名');
        }
        var more = $('<li>').attr('data-icon', false).append(a);// .append('<br/>');
        more.list = list;
        more.a = a;
        more.hide();
        list.append(more);
        
        $('.wrapper').append(list);
        skyex.app.book.more = more;
        
        return list;
        
      },
      
      init : function() {
        skyex.app.book.backBtn('我的书籍', {
          click : function() {
            return false;
          }
        }, {
            text : '添加我的书',
            click : function() {
              skyex.app.book.add();
              alert('add new book');
            },
            show : true
        });
        $.json2html(xdom.htmlTemplate['initBook'], $('.wrapper'));
      },
      initMainSearch : function(q) {
        q = q || '';
        skyex.app.book.page = 1;
        skyex.app.tab.swap($('#nav-bar-' + skyex.app.book.idx));
        $('.wrapper').html('');
        
        console.log('inside search init');
        
        if (skyex.app.category.pid.length) {
          skyex.app.book.backBtn('书籍搜索', {
              click : function() {
                var pid = skyex.app.category.pid.pop();
                skyex.app.category.get(pid);
                return false;
              },
              show : true
          });
        } else {
          skyex.app.book.backBtn('书籍搜索', {
              click : function() {
                skyex.app.book.init();
                return false;
              },
              show : true
          });
        }
        skyex.app.book.initSearch();
        skyex.app.book.initFrame();
        
        skyex.app.book.search(q, skyex.app.book.page++);
      },
      
      initChapter : function(book, data, idx, chapters) {
        skyex.app.book.backBtn("《" + book.name + "》", {
            click : function() {
              console.log('inside book');
              skyex.app.book.initBook(data.book_id);
              return false;
            },
            show : true
        });
        data.idx = idx;
        data.chapters = chapters;
        data.total = chapters.length;
        data.book = book;
        console.log('inside initChapter');
        $('.wrapper').html('');
        $.array2html(xdom.htmlTemplate['initChapter'], $('.wrapper'), data);
        window.scrollTo(0, 0);
      },
      
      initLocalChapter : function(book, data, idx, chapters) {
        skyex.app.book.backBtn("《" + book.name + "》", {
            click : function() {
              console.log('inside book');
              skyex.app.book.localBook(book);
              return false;
            },
            show : true
        });
        data.idx = idx;
        data.chapters = chapters;
        data.total = chapters.length;
        data.book = book;
        console.log('inside initChapter');
        $('.wrapper').html('');
        $.array2html(xdom.htmlTemplate['initLocalChapter'], $('.wrapper'), data);
        window.scrollTo(0, 0);
      },
      
      addChapter : function(book, data, node, idx, chapters) {
        var li = $('<li>');
        var a = $('<a>').html(data.title);
        a.click(function() {
          skyex.lib.req(skyex.requestUrl, 'type=book&act=chapter&id=' + data.id, function(data) {
            skyex.app.book.initChapter(book, data.data[0], idx, chapters);
          });
          // skyex.app.book.initChapter(data, idx, total);
        });
        li.append(a);
        node.append(li);
      },
      
      addLocalChapter : function(book, chapter, node, idx, chapters) {
        var li = $('<li>');
        var a = $('<a>').html(chapter.title);
        a.click(function() {
          bm.getChapterData(book.id, chapter.id, function(chapter) {
            chapter = JSON.parse(chapter);
            console.log(chapter);
            console.log("addLocalChapter");
            skyex.app.book.initLocalChapter(book, chapter, idx, chapters);
          });
        });
        li.append(a);
        node.append(li);
      },
      
      addBookDetail : function(data, id, click) {
        
        data.cat_id = id;
        data.clickable = click;
        return $.json2html(xdom.htmlTemplate['bookDetail'], null, data);
      },
      
      addNode : function(data, id, click) {
        
        data.cat_id = id;
        data.clickable = click;
        return $.json2html(xdom.htmlTemplate['bookNode'], null, data);
      },
      
      search : function(q, page, next) {
        q = q || '';
        page = page || 1;
        skyex.lib.req(skyex.requestUrl, 'type=book&act=search&q=' + encodeURIComponent(q) + "&page=" + page, function(
            data) {
          switch (data.status) {
          
          case 2:
            jqm_alert(data.message);
            break;
          case 1:
            data = data.data;
            if (!data.length) {
              skyex.app.book.more.hide();
              return;
            }
            skyex.app.book.more.list.html('');
            skyex.app.book.more.list.append(skyex.app.book.more);
            
            for (var i = 0; i < data.length; i++) {
              
              skyex.app.book.books[data[i].id] = data[i];
              var node = skyex.app.book.addNode(data[i]);
              node.insertBefore(skyex.app.book.more);
              // skyex.app.book.more.list.append(node);
            }
            
            skyex.app.book.more.show();
            skyex.app.book.more.list.listview();
            skyex.app.book.more.a.unbind();
            skyex.app.book.more.a.click(function() {
              console.log('inside click search');
              skyex.app.book.search(q, skyex.app.book.page++);
            });
            break;
          }
        });
      },
  
  };
  return skyex.app.book;
});