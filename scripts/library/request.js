define(['jquery', 'skyex'], function($, skyex) {
  
  skyex.lib.req = function(url, data, callback, hide) {
    data = data || {};
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
            }, 500);
          }
        }
    });
  };
  return skyex.app.req;
});