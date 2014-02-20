define(function() {
  
  return {
      domain: function() {
        return 'book.t1bao.com';
        // return location.hostname ? location.hostname : 'book.t1bao.com';
      },
      assetsUrl: function() {
        return '/assets';
      },
      requestUrl: function() {
        return 'http://' + this.domain() + '/jqmapp';
      },
      captchaUrl: function() {
        return this.requestUrl() + '/captcha';
      },
      downloadUrl: function() {
        return this.requestUrl() + '/download';
      },
      logoUrl: function() {
        return '/assets/img/logo.jpg';
      },
      
      session: {
          postSession: true,
          init: function(postSession) {
            this.postSession = postSession;
          },
          key: 'ci_session_name',
          get: function() {
            if (this.postSession) {
              if (localStorage && !!localStorage[this.key]) {
                return [this.key, localStorage[this.key]];
              }
            }
            return null;
          },
          set: function(value) {
            if (this.postSession && localStorage) {
              localStorage[this.key] = value;
            }
          }
      },
      
      box: {
          show: function(message) {
            if ($.mobile) {
              $.mobile.loading("show", {
                  text: message || "正在向服务器发送/请求...",
                  textVisible: true,
                  theme: "b"
              });
            }
            
          },
          hide: function() {
            if ($.mobile) {
              $.mobile.loading("hide");
            }
            
          },
          showLimited: function(message, time) {
            time = time || 100;
            this.show(message);
            setTimeout(this.hide, time);
          }
      },
      
      post: function($http, requestData, callback, hide) {
        var self = this;
        requestData = requestData || {};
        hide = hide || false;
        
        var contentType = 'application/x-www-form-urlencoded';
        var transformRequest = function(obj) {
          var str = [];
          for ( var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        };
        
        // Append sessionToken when necessory
        var sessionToken = this.session.get();
        if (requestData instanceof String || (typeof requestData === 'string')) {
          if (sessionToken) {
            requestData += "&" + sessionToken[0] + "=" + sessionToken[1];
          }
          transformRequest = null;
          
        } else if (requestData instanceof FormData) {
          if (sessionToken) {
            requestData.append(sessionToken[0], sessionToken[1]);
          }
          contentType = 'undefined';
          transformRequest = null;
          
        } else {
          if (sessionToken) {
            requestData[sessionToken[0]] = sessionToken[1];
          }
        }
        
        //
        if (!hide) {
          this.box.show();
        }
        
        var httpInfo = {
            method: 'POST',
            url: this.requestUrl(),
            headers: {
              'Content-Type': contentType
            },
            transformRequest: transformRequest,
            data: requestData
        };
        $http.defaults.useXDomain = true;
        return $http(httpInfo).then(function(response) {
          self.box.showLimited('请求成功!');
          // this callback will be called asynchronously
          // when the response is available
          console.log("request end");
          console.log(response);
          return callback(response.data);
        });
      }
  };
});