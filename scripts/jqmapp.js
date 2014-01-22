var skyex = {};
skyex.lib = {};
skyex.LIMIT = 100;
skyex.PAGE = 1;

// skyex.domain = 't1book.com';
//skyex.domain = location.hostname;
skyex.domain = 'book.t1bao.com';
skyex.assetsUrl = '/assets';
skyex.requestUrl = 'http://' + skyex.domain + '/web/app';
skyex.requestUrl = '';
skyex.requestUrl = 'http://' + skyex.domain + '/jqmapp';
skyex.captchaUrl = skyex.requestUrl + '/captcha';
skyex.downloadUrl = skyex.requestUrl + '/download';
skyex.logoUrl = '/assets/img/logo.jpg';

// prepared for session handling
skyex.postSession = true;
skyex.sessionName = 'ci_session_name';

var localBook = null;

function jqm_alert(message, time) {
  message = message || '';
  if (message) {

    $.mobile.loading("show", {
      text : message,
      textVisible : true,
      theme : "z"
    });
  }

  if (time === -1) {
    return;
  }

  time = time ? time * 1000 : 1000;

  // Do your ajax call and processing here
  setTimeout(function() {
    $.mobile.loading("hide");
  }, time);
}

function hasPhoneGap() {
  return (typeof cordova !== 'undefined') || (typeof PhoneGap !== 'undefined') || (typeof phonegap !== 'undefined');
}

function getUrl(image_ids) {
  var url = '/assets/img/no_book_pic.jpg';
  try {
    image_ids = eval("(" + image_ids + ")");
  } catch (e) {
    image_ids = null;
  }

  if (image_ids && image_ids.length) {
    image_ids = image_ids[0];

    for ( var k in image_ids) {
      url = image_ids[k];
      break;
    }
  }
  return url;
}

skyex.lib.req = function(url, data, callback, hide) {
  data = data || {};
  var id = null;
  hide = hide || false;

  var isString = (data instanceof String || (typeof data === 'string'));
  var processData = true, contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  if (!isString) {
    if (data) {
      if (data instanceof FormData) {
        if (skyex.postSession) {
          if (localStorage && !!localStorage[skyex.sessionName]) {
            data.append(skyex.sessionName, localStorage[skyex.sessionName]);
          }
        }
        processData = false;
        contentType = false;
      } else {
        if (skyex.postSession) {
          if (localStorage && !!localStorage[skyex.sessionName]) {
            data[skyex.sessionName] = localStorage[skyex.sessionName];
          }
        }
      }
    }
  } else {
    console.log('inside text 2');
    if (skyex.postSession) {
      if (localStorage && (!!localStorage[skyex.sessionName])) {
        console.log('inside text');
        if (data) {
          data += "&" + skyex.sessionName + "=" + localStorage[skyex.sessionName];
        } else {
          data = skyex.sessionName + "=" + localStorage[skyex.sessionName];
        }

      }
    }

  }
  // $.mobile.showPageLoadingMsg("b", "正在向服务器发送/请求...");
  if (!hide) {
    $.mobile.loading("show", {
      text : "正在向服务器发送/请求...",
      textVisible : true,
      theme : "b"
    });
  }

  // options are (theme, text, boolean textonly)

  $.ajax({
    url : url,
    type : 'post',
    data : data,
    crossDomain : true,
    contentType : contentType,
    dataType : 'json',
    header : {
      'Mobile-Static-Cookie' : localStorage[skyex.sessionName]
    },
    processData : processData,
    success : function(data, textStatus, request) {
      console.log('inside');
      console.log(request.getAllResponseHeaders());
      console.log('inside2');
      // $.mobile.showPageLoadingMsg("b", "数据获取成功...");

      if (!hide) {
        $.mobile.loading("show", {
          text : "数据获取成功...",
          textVisible : true,
          theme : "b"
        });
        setTimeout(function() {
          $.mobile.loading("hide");
          // $.mobile.hidePageLoadingMsg();
        }, 500);
      }

      data = data || {};
      if (data[skyex.sessionName]) {
        localStorage[skyex.sessionName] = data[skyex.sessionName];
      }
      if (data.status !== 0) {
        callback(data);
      } else {

        if (data.info) {
          alert(data.info, 5);
        }
        if (data.message) {
          alert(data.message);
        }
      }
    },
    error : function(e) {
      if (!hide) {

        $.mobile.loading("show", {
          text : "获取服务器数据失败..." + e.message,
          textVisible : true,
          theme : "b"
        });
        setTimeout(function() {
          $.mobile.loading("hide");

          // $.mobile.hidePageLoadingMsg();
        }, 500);
      }

      // $.mobile.hidePageLoadingMsg('获取服务器数据失败');
    }
  });
};

skyex.app = {};

skyex.app.book = {
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

    sections = $.array2html(htmlTemplate['booklocalHeader'], null, book);
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
    })

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
    $.json2html(htmlTemplate['initAddBook'], $('.wrapper'));
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

    sections = $.array2html(htmlTemplate['bookHeader'], null, skyex.app.book.books[id]);
    for (var i = 0; i < sections.length; i++) {
      list.append(sections[i]);
    }
    $('.wrapper').append(list);

    list.listview();

    skyex.app.book.byBook(skyex.app.book.books[id], list);

  },
  initSearch : function() {

    var query = $('<input>').attr('type', 'search').attr('name', 'q').val('').attr('placeholder', '请输入要搜索的书名').textinput();
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
    $.json2html(htmlTemplate['initBook'], $('.wrapper'));
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
    $.array2html(htmlTemplate['initChapter'], $('.wrapper'), data);
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
    $.array2html(htmlTemplate['initLocalChapter'], $('.wrapper'), data);
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

skyex.app.category = {
  pid : [],
  isListed : false,
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

skyex.app.box = {
  init : function() {
    skyex.app.tab.init();
  }
};

skyex.app.more = {
  init : function() {
    skyex.app.book.backBtn('更多', {
      click : function() {
        var pid = skyex.app.category.pid.pop();
        skyex.app.category.get(pid);
        return false;
      }
    });

    $.json2html(htmlTemplate['initMore'], $('.wrapper'));
  },

  initAbout : function() {
    skyex.app.book.backBtn('关于天易书城', {
      click : function() {
        skyex.app.more.init();
        return false;
      },
      show : true
    });
    $.json2html(htmlTemplate['initAbout'], $('.wrapper'));
  },
  initFeedback : function() {
    skyex.app.book.backBtn('意见反馈', {
      click : function() {
        skyex.app.more.init();
        return false;
      },
      show : true
    });

    $.json2html(htmlTemplate['initFeedback'], $('.wrapper'));
  }
};

skyex.app.user = {
  data : null,

  subscribed : function() {
    if (!skyex.app.user.data) {
      skyex.app.user.profile(function() {
        skyex.app.user.subscribed();
      });
    }
    ;
  },

  subscribe : function(book_id, subscribe, callback) {
    var data = {
      type : 'user',
      act : 'subscribe',
      book_id : book_id,
      subscribe : subscribe
    };
    skyex.lib.req(skyex.requestUrl, data, function(data) {
      switch (data.status) {
      case 1:
        if (subscribe) {
          if (!skyex.app.user.data.sub_books) {
            skyex.app.user.data.sub_books = [ book_id ];
          } else {
            skyex.app.user.data.sub_books.push(book_id);
          }
        } else {
          if (skyex.app.user.data.sub_books) {
            var idx = skyex.app.user.data.sub_books.indexOf(book_id);
            skyex.app.user.data.sub_books.splice(idx, 1);
          }
        }

        callback();
        break;
      case 2:
        jqm_alert('您尚未登录，请先完成账号的登录！', -1);
        setTimeout(function() {
          jqm_alert('');
        }, 3000);

        break;
      default:

      }
    });
  },
  logout : function() {
    var data = {
      type : 'user',
      act : 'logout'
    };

    skyex.lib.req(skyex.requestUrl, data, function(data) {
      switch (data.status) {
      case 1:
        skyex.app.user.initLogin();
        break;
      default:

      }
    });
  },
  init : function(idx) {
    skyex.app.user.initLogin();
    skyex.app.user.profile();
  },
  profile : function(callback) {
    var data = {
      type : 'user',
      act : 'profile'
    }
    skyex.lib.req(skyex.requestUrl, data, function(data) {
      switch (data.status) {
      case 1:
        skyex.app.user.data = data.data;
        if (!callback) {
          skyex.app.user.initAccount(data.data);
        } else {
          callback();
        }
        break;
      default:
        skyex.app.user.initLogin();
      }
    });
  },
  initProfile : function(user) {
    skyex.app.book.backBtn('我的信息', {
      click : function() {
        skyex.app.user.initAccount(skyex.app.user.data);
        return false;
      },
      show : true
    });
    $.json2html(htmlTemplate['initProfile'], $('.wrapper'), user);
  },
  initForgetPassword : function() {
    skyex.app.book.backBtn('忘记密码', {
      click : function() {
        skyex.app.user.initLogin();
      },
      show : true
    });

    $.json2html(htmlTemplate['initForgetPassword'], $('.wrapper'));
  },
  initModifyPassword : function() {
    skyex.app.book.backBtn('修改密码', {
      click : function() {
        skyex.app.user.initAccount(skyex.app.user.data);
      },
      show : true
    });
    $.json2html(htmlTemplate['initModifyPassword'], $('.wrapper'));
  },
  initAccount : function(user) {
    $('.wrapper').html('');
    skyex.app.book.backBtn('我的天易', {
      click : function() {
        return false;
      },
    });
    htmlTemplate['initAccount'].children[0].children[1].text = user.username;
    htmlTemplate['initAccount'].children[1].children[0].children[0].events.click = function() {
      skyex.app.user.initProfile(user);
    };
    htmlTemplate['initAccount'].children[1].children[1].children[0].events.click = function() {
      skyex.app.user.initModifyPassword();
    };
    $.json2html(htmlTemplate['initAccount'], $('.wrapper'));
  },

  initRegister : function() {

    skyex.app.book.backBtn('用户注册', {
      click : function() {
        skyex.app.user.initLogin();
      },
      show : true
    });

    $.json2html(htmlTemplate['initRegister'], $('.wrapper'));
  },

  initLogin : function() {
    skyex.app.book.backBtn('用户登录', {
      click : function() {
        skyex.app.user.init();
        return false;
      }
    });
    skyex.app.tab.swap($('#nav-bar-' + skyex.app.user.idx));
    $.json2html(htmlTemplate['initLogin'], $('.wrapper'));
  }
};

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
    var tabs = [ {
      'name' : '我的天易',
      'icon' : 'home',
      'action' : function() {
        skyex.app.user.idx = 0;
        skyex.app.user.init();
      }
    }, {
      'name' : '书籍',
      'icon' : 'search',
      'action' : function() {
        skyex.app.book.idx = 1;
        skyex.app.category.pid = [];
        skyex.app.book.init();
      }
    }, {
      'name' : '分类',
      'icon' : 'grid',
      'action' : function() {
        skyex.app.category.idx = 2;
        skyex.app.category.get();
      }
    }, {
      'name' : '更多',
      'icon' : 'gear',
      'action' : function() {
        skyex.app.more.idx = 3;
        skyex.app.more.init();
      }
    } ];

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
  skyex.app.box.init();
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
     * bm.save('3.txt', "new file\n", function() { console.log('created new file
     * 3.txt'); bm.remove('2.txt'); });
     */

  });
  /*
   * createDirectory('books', function() { createFile('books/2.txt', 'this is a
   * novel\n', function() { listFile('books'); }); });
   */
}, false);
