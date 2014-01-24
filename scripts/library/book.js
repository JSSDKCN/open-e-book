(function() {
  function Book() {

  }
})(jQuery);

var book = {
  bar : null,
  page : 1,
  more : null,
  books : {},
  chapters : null,
  localBook : function(book) {
    this.backBtn('书籍信息', {
      click : function() {

        this.local();
        return false;
      },
      show : true
    });

    $('.wrapper').html('');
    var list = $('<ul>').attr('data-role', 'listview');

    sections = $.array2html(htmlTemplate['booklocalHeader'], null, book);
    for (var i = 0; i < sections.length; i++) {
      list.append(sections[i]);
    }
    $('.wrapper').append(list);
    list.listview();
    list.append('<li data-role="list-divider" style="text-align:center">目录</li>');

    var chapters = book.chapters;
    for (var i = 0; i < chapters.length; i++) {
      this.addLocalChapter(book, chapters[i], list, i + 1, chapters.length);
    }

    list.listview();
    list.listview('refresh');
    // $('.wrapper').trigger('create');
  },
  local : function() {
    bm.list(function(books) {
      $('.wrapper').html('');
      this.backBtn('下载图书列表', {
        click : function() {
          this.init();
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
          var a = $('<a>').append(books[i].name);
          console.log(books[i].name);
          a.click((function(name) {
            return function() {
              jqm_alert('正在加载书籍，请耐心等待....', -1);
              localBook = null;
              bm.read(name, function(content) {
                jqm_alert();
                jqm_alert('书籍加载完成！');
                $('.wrapper').html('');
                this.backBtn('文件内容', {
                  click : function() {
                    this.local();
                    return false;
                  },
                  show : true
                });
                localBook = eval('(' + content + ')');
                this.localBook(localBook);
                // $('.wrapper').html(content);
              });

            };
          })(books[i].name));
          var li = $('<li>').append(a);
          li.on('taphold', (function(name) {
            return function() {
              var self = this;

              if (confirm('你确定要删除当前书籍吗?\n操作不可恢复')) {
                bm.remove(name, function() {
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
    this.backBtn('添加新书', {
      click : function() {
        this.init();
        return false;
      },
    });
    $.json2html(htmlTemplate['initAddBook'], $('.wrapper'));
  },
  byBook : function(id, list) {
    skyex.lib.req(skyex.requestUrl, 'type=book&act=info&id=' + id, function(data) {
      switch (data.status) {
      case 1:
        var chapters = data.data;
        this.chapters = chapters;
        if (!chapters.length) {
          var noData = $('<p>').addClass('no_data').html('好象出问题了!');
          noData.insertBefore(this.more);
          return;
        }

        list.append('<li data-role="list-divider" style="text-align:center">目录</li>');

        for (var i = 0; i < chapters.length; i++) {
          this.addChapter(chapters[i], list, i + 1, chapters.length);
        }
        list.listview('refresh');
        this.more.a.unbind();

        this.more.hide();
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
          if (this.page == 1) {
            jqm_alert('inside 1');
            var noData = $('<p>').html('暂无书籍!');
            noData.insertBefore(this.more);
          }

          this.more.a.unbind();
          this.more.hide();

          return;
        }

        for (var i = 0; i < books.length; i++) {
          this.books[books[i].id] = books[i];
          var node = this.addNode(books[i], id);
          node.insertBefore(this.more);
        }
        this.more.a.unbind();
        this.more.a.click(function() {
          this.byCategory(list, id, this.page++);
        });
        list.listview();
        this.more.show();
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

    $.array2html(htmlTemplate['navBar'], $('.bar-title'), {
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
    this.backBtn('书籍列表', {
      click : function() {
        var pid = skyex.app.category.pid.pop();
        skyex.app.category.get(pid);
        return false;
      },
      show : true
    });
    // this.initSearch();
    var list = this.initFrame(true);
    this.more.hide();
    this.page = 1;
    this.byCategory(list, id, this.page++);
  },
  initBook : function(id) {
    this.backBtn('书籍信息', {
      click : function() {
        if (skyex.app.category.pid.length) {
          console.log('inside initBook 1');
          var pid = skyex.app.category.pid.pop();
          skyex.app.category.get(pid);
        } else {
          console.log('inside initBook 2');
          this.initMainSearch();
        }
        return false;
      },
      show : true
    });

    $('.wrapper').html('');
    var list = $('<ul>').attr('data-role', 'listview');

    sections = $.array2html(htmlTemplate['bookHeader'], null, this.books[id]);
    for (var i = 0; i < sections.length; i++) {
      list.append(sections[i]);
    }
    $('.wrapper').append(list);

    list.listview();

    this.byBook(id, list);

  },
  initSearch : function() {

    var query = $('<input>').attr('type', 'search').attr('name', 'q').val('').attr('placeholder', '请输入要搜索的书名').textinput();
    var form = $('<form>');
    form.append(query);
    form.bind('submit', function() {
      this.page = 1;
      console.log(query);
      jqm_alert('inside v = ' + query.val());
      if (query.val()) {
        this.initMainSearch(query.val());
      }
      return false;
    });

    $('.wrapper').append(form);
    $('.wrapper').append($('<br/>'));
    skyex.app.tab.swap($('#nav-bar-' + 1));
    $('.wrapper').trigger('create');

  },
  initFrame : function(filter) {
    var a = $('<a>').attr('id', 'more').html('显示更多...').css('text-align', 'center');
    var list = $('<ul>').addClass('book_list').attr('data-role', 'listview').attr('data-insert', 'true');
    if (filter) {
      list.attr('data-filter', true).attr('data-filter-placeholder', '请输入书名');
    }
    var more = $('<li>').attr('data-icon', false).append(a).append('<br/>');
    more.list = list;
    more.a = a;
    list.append(more);

    $('.wrapper').append(list);
    this.more = more;

    return list;

  },

  init : function() {
    this.backBtn('我的书籍', {
      click : function() {
        return false;
      }
    }/*
       * , { text : '新建一本书', click : function() { this.add(); jqm_alert('add new
       * book'); }, show : true }
       */);
    $.json2html(htmlTemplate['initBook'], $('.wrapper'));
  },
  initMainSearch : function(q) {
    q = q || '';
    this.page = 1;
    skyex.app.tab.swap($('#nav-bar-' + 1));
    $('.wrapper').html('');

    console.log('inside search init');

    if (skyex.app.category.pid.length) {
      this.backBtn('书籍搜索', {
        click : function() {
          var pid = skyex.app.category.pid.pop();
          skyex.app.category.get(pid);
          return false;
        },
        show : true
      });
    } else {
      this.backBtn('书籍搜索', {
        click : function() {
          this.init();
          return false;
        },
        show : true
      });
    }
    this.initSearch();
    this.initFrame();

    this.search(q, this.page++);
  },

  initChapter : function(data, idx, total) {
    this.backBtn("《" + this.books[data.book_id].name + "》", {
      click : function() {
        console.log('inside book');
        this.initBook(data.book_id);
        return false;
      },
      show : true
    });
    data.idx = idx;
    data.total = total;
    console.log('inside initChapter');
    $.array2html(htmlTemplate['initChapter'], $('.wrapper'), data);
  },

  initLocalChapter : function(book, data, idx, total) {
    this.backBtn("《" + book.name + "》", {
      click : function() {
        console.log('inside book');
        this.localBook(book);
        return false;
      },
      show : true
    });
    data.idx = idx;
    data.total = total;
    console.log('inside initChapter');
    $.array2html(htmlTemplate['initChapter'], $('.wrapper'), data);
  },

  addChapter : function(data, node, idx, total) {
    var li = $('<li>');
    var a = $('<a>').html(data.title);
    a.click(function() {
      skyex.lib.req(skyex.requestUrl, 'type=book&act=info&id=' + id, function(chapter) {
        this.initChapter(chapter, idx, total);
      });
    });
    li.append(a);
    node.append(li);
  },

  addLocalChapter : function(book, data, node, idx, total) {
    var li = $('<li>');
    var a = $('<a>').html(data.title);
    a.click(function() {
      this.initLocalChapter(book, data, idx, total);
    });
    li.append(a);
    node.append(li);
  },

  addBookDetail : function(data, id, click) {

    data.cat_id = id;
    data.clickable = click;
    return $.json2html(htmlTemplate['bookDetail'], null, data);
  },

  addNode : function(data, id, click) {

    data.cat_id = id;
    data.clickable = click;
    return $.json2html(htmlTemplate['bookNode'], null, data);
  },

  search : function(q, page, next) {
    q = q || '';
    page = page || 1;
    skyex.lib.req(skyex.requestUrl, 'type=book&act=search&q=' + encodeURIComponent(q) + "&page=" + page, function(data) {
      switch (data.status) {

      case 2:
        jqm_alert(data.message);
        break;
      case 1:
        data = data.data;
        if (!data.length) {
          this.more.hide();
          return;
        }
        this.more.list.html('');
        this.more.list.append(this.more);

        for (var i = 0; i < data.length; i++) {

          this.books[data[i].id] = data[i];
          var node = this.addNode(data[i]);
          node.insertBefore(this.more);
          // this.more.list.append(node);
        }

        this.more.show();
        this.more.list.listview();
        this.more.a.unbind();
        this.more.a.click(function() {
          console.log('inside click search');
          this.search(q, this.page++);
        });
        break;
      }
    });
  },

};