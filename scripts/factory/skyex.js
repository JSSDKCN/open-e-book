define(function() {
  
  return {
      cache: {},
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
        var id = this.session.get();
        if (!id) {
          return this.requestUrl() + '/captcha';
        }
        return this.requestUrl() + '/captcha/' + id[1];
        
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
          },
          update: function(post) {
            this.set(post[this.key]);
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
          var str = new Array();
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
          contentType = "undefined";
          transformRequest = null;
          
        } else {

          
          if (sessionToken) {
            requestData[sessionToken[0]] = sessionToken[1];
          }
          console.log('inside request ');
          console.log(requestData);

          if (this.cache[JSON.stringify(requestData)] && requestData['__cache']) {
            console.log('get cached data');
            //console.log(requestData);
            return callback(this.cache[JSON.stringify(requestData)]);
          }
          
          if (requestData['__cache']) {
            delete requestData['__cache'];
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
          self.session.update(response.data);
          if (response.status !== 0) {
            self.cache[JSON.stringify(requestData)] = response.data;
            console.log('inside save ');
            console.log(requestData);
            return callback(response.data);
          }
          if (response.info) {
            self.box.showLimited(data.info);
          }
          if (response.message) {
            self.box.showLimited(data.message);
          }
          return null;
          
        });
      }
  };
});