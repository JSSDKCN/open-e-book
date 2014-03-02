define(['skyex'], function(skyex) {
  var user = {};
  var profile = null;
  var cache = {
    profile: null
  
  };
  
  user.curProfile = function() {
    return profile;
  };
  
  user.init = function($http, $location) {
    this.$http = $http;
    this.$location = $location;
  };
  
  user.cache = cache;
  user.post = function(params, callback) {
    return skyex.post(this.$http, params, function(response) {
      if (callback) {
        callback(response);
      }
      return response;
    });
  };
  user.subscribe = function(id, subscribe, callback) {
    var params = {
        type: 'user',
        act: 'subscribe',
        book_id: book_id,
        subscribe: subscribe || 0
    };
    return user.post(params, function(response) {
      switch (response.status) {
      case 1:
        if (subscribe) {
          if (!profile.sub_books) {
            profile.sub_books = [id];
          } else {
            profile.sub_books.push(id);
          }
        } else {
          if (profile.sub_books) {
            var idx = profile.sub_books.indexOf(id);
            profile.sub_books.splice(idx, 1);
          }
        }
        if (callback)
          callback();
        break;
      case 2:
        alert('您尚未登录，请先完成账号的登录！');
        break;
      }
    });
  };
  
  user.mail = {

  };
  user.mail.verify = function(callback) {
    console.log(profile);
    if (profile && !parseInt(profile.is_email_validated)) {
      var params = {
          type: 'user',
          act: 'email_verification'
      };
      user.post(params, function(data) {
        switch (data.status) {
        case 1:
          alert(data.message);
          // $('.verification').attr('disabled', true);
          $('.verification').html('验证中...');
          break;
        }
      });
    }
    
  };
  user.update = function(username, mobile, email, gender, callback) {
    
    var params = {
        type: 'user',
        act: 'update',
        username: username,
        mobile: mobile,
        email: email,
        gender: gender
    };
    
    user.post(params, function(response) {
      switch (response.status) {
      case 1:
        alert(response.message);
        profile.username = username;
        profile.mobile = mobile;
        profile.email = email;
        profile.gender = gender;
        if (callback)
          callback(response);
        break;
      }
    });
  };
  user.password = {};
  user.password.retrieve = function(email) {
    var params = {
        type: 'user',
        act: 'password_retreive',
        email: email
    };
    user.post(params, function(data) {
      switch (data.status) {
      case 1:
        alert(data.message);
        user.$location.path('/user');
        break;
      case 2:
        alert(data.message, 2);
      }
    });
  };
  user.password.update = function(old_pass, new_pass, callback) {
    var params = {
        type: 'user',
        act: 'password_update',
        old_pass: old_pass,
        new_pass: new_pass,
        new_pass2: new_pass
    };
    user.post(params, function(response) {
      switch (response.status) {
      case 0:
        alert(response.message);
        break;
      case 1:
        alert(response.message);
        user.$location.path('/user/home');
        break;
      }
    });
    return false;
    
  };
  user.logout = function() {
    var params = {
        type: 'user',
        act: 'logout'
    };
    user.post(params, function(data) {
      switch (data.status) {
      case 1:
        profile = null;
        user.$location.path('/user');
        break;
      default:

      }
    });
  };
  user.login = function(username, password, callback) {
    var params = {
        type: 'user',
        act: 'login',
        username: username,
        password: password
    };
    
    user.post(params, function(response) {
      switch (response.status) {
      case 1:
        user.getProfile(function() {
          user.$location.path('/user/home');
        });
        
        break;
      }
    });
  };
  user.getProfile = function(callback) {
    if (profile) {
      if (!callback) {
        user.$location.path('/user/home');
      } else {
        callback(profile);
      }
      return profile;
    }
    var params = {
        type: 'user',
        act: 'profile',
        __cache: true
    };
    user.post(params, function(response) {
      switch (response.status) {
      case 1:
        profile = response.data;
        console.log('inside profile');
        console.log(profile);
        if (!callback) {
          user.$location.path('/user/home');
        } else {
          callback(profile);
        }
        break;
      }
    });
  };
  user.register = function(username, password, email, captcha, callback) {
    
    var params = {
        type: 'user',
        act: 'register',
        username: username,
        password: password,
        password2: password,
        email: email,
        captcha: captcha
    };
    
    user.post(params, function(response) {
      switch (response.status) {
      case 1:
        alert(response.message);
        if (!callback) {
          user.$location.path('/user');
        } else {
          calback(response);
        }
        break;
      }
    });
  };
  
  return function($http, $location) {
    console.log('inside user factory');
    user.init($http, $location);
    return user;
  };
});