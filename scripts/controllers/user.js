define(['jquery', 'skyex', 'req', 'dom','underscore', 'backbone'], function($, skyex, req, xdom, _, Backbone) {
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
  var user = {
    idx : 0,
    data : null,


    bind: function(info, handlers) {
      var tmp = info.temp;
      var bindView = {
        initialize: function(){
          this.render();
        },
        render: function(){
            // Compile the template using underscore
            var template = _.template( tmp.html(), info.data );
            // Load the compiled HTML into the Backbone "el"
            this.$el.html( template );
          },
          events: {}
        };

        for(var i = 0; i < handlers.length; i++) {
          var handle = handlers[i];
          bindView.events[handle.e] = 'bind' + i;
          bindView['bind' + i] = handle.func;
        }

        var view = Backbone.View.extend(bindView);
        var o = new view({el: info.el});
        $('.wrapper').trigger('create');
      },


      initAccount : function(userInfo) {
        $('.wrapper').html('');
        skyex.app.book.backBtn('我的天易', {
          click : function() {
            return false;
          },
        });
        var tmp = $("#dashboard");

        this.bind({
          temp: $("#dashboard"),
          el: $('.wrapper'),
          data: userInfo

        }, [
        {
          e: 'click li:nth-child(2)>a',
          func: function(e) {
            user.initModifyPassword();
          }
        },{
          e: 'click li:nth-child(1)>a',
          func: function(e) {
            user.initProfile(userInfo);
          }

        }, {
          e: 'click a[data-role=button]',
          func: function(e) {
            user.logout();
          }
        }

        ]);
      },
      
      subscribed : function() {
        if (!user.data) {
          user.profile(function() {
            user.subscribed();
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
              if (!user.data.sub_books) {
                user.data.sub_books = [book_id];
              } else {
                user.data.sub_books.push(book_id);
              }
            } else {
              if (user.data.sub_books) {
                var idx = user.data.sub_books.indexOf(book_id);
                user.data.sub_books.splice(idx, 1);
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
            user.initLogin();
            break;
            default:

          }
        });
      },
      init : function(idx) {
        user.initLogin();
        user.profile();
      },
      profile : function(callback) {
        var data = {
          type : 'user',
          act : 'profile'
        }
        skyex.lib.req(skyex.requestUrl, data, function(data) {
          switch (data.status) {
            case 1:
            user.data = data.data;
            if (!callback) {
              user.initAccount(data.data);
            } else {
              callback();
            }
            break;
            default:
            user.initLogin();
          }
        });
      },
      initProfile : function(userInfo) {
        skyex.app.book.backBtn('我的信息', {
          click : function() {
            user.initAccount(user.data);
            return false;
          },
          show : true
        });
        $.json2html(xdom.htmlTemplate['initProfile'], $('.wrapper'), userInfo);
      },
      initForgetPassword : function() {
        skyex.app.book.backBtn('忘记密码', {
          click : function() {
            user.initLogin();
          },
          show : true
        });

        $.json2html(xdom.htmlTemplate['initForgetPassword'], $('.wrapper'));
      },
      initModifyPassword : function() {
        skyex.app.book.backBtn('修改密码', {
          click : function() {
            user.initAccount(user.data);
          },
          show : true
        });
        $.json2html(xdom.htmlTemplate['initModifyPassword'], $('.wrapper'));
      },

      initRegister : function() {

        skyex.app.book.backBtn('用户注册', {
          click : function() {
            user.initLogin();
          },
          show : true
        });
        
        $.json2html(xdom.htmlTemplate['initRegister'], $('.wrapper'));
      },
      
      initLogin : function() {
        skyex.app.book.backBtn('用户登录', {
          click : function() {
            user.init();
            return false;
          }
        });
        skyex.app.tab.swap($('#nav-bar-' + user.idx));
        $.json2html(xdom.htmlTemplate['initLogin'], $('.wrapper'));
      }
    };

    skyex.app.user = user;

    return user;
  });