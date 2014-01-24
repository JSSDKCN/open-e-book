define(['jquery', 'skyex'], function($, skyex) {
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


var htmlTemplate = {};
htmlTemplate['initAccount'] = {
  tag : 'div',
  children : [ {
    tag : 'h3',
    children : [ {
      tag : 'text',
      text : '尊敬的用户「'
    }, {
      tag : 'span',
      attrs : {
        style : 'color: red'
      },
      text : ''
    }, {
      tag : 'text',
      text : '」，欢迎您！'
    } ]
  }, {
    tag : 'ul',
    attrs : {
      'data-role' : 'listview'
    },
    exe : {
      listview : []
    },
    children : [ {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '我的信息',
        events : {
          click : function() {
            //user.initProfile(user);
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '修改密码',
        events : {
          click : function() {
            //user.initPassword();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '我的书籍',
        events : {
          click : function() {
            //user.initPassword();
          }
        }
      } ]
    } ]
  }, {
    tag : 'br'
  }, {
    tag : 'a',
    text : '退 出',
    exe : {
      button : []
    },
    events : {
      click : function() {
        var user = require('user');
        user.logout();
      }
    }
  } ]
};

htmlTemplate['initLogin'] = {
  tag : 'form',
  attrs : {
    method : 'post'
  },
  children : [ {
    tag : 'lable',
    text : '用户名:',
    attrs : {
      'for' : 'username',
      'class' : 'ui-hidden-accessible',
    }
  }, {
    tag : 'input',
    attrs : {
      'placeholder' : '请输入注册用户名或者邮箱',
      'id' : 'username',
      'name' : 'username',
      'type' : 'text'
    },
    exe : {
      textinput : []
    },
    events : {
      keyup : function(event) {
        if (event.keyCode == 13) {
          $('form').submit();
        }
      }
    }
  }, {
    tag : 'lable',
    text : '密码：',
    attrs : {
      'for' : 'username',
      'class' : 'ui-hidden-accessible',
    }
  }, {
    tag : 'input',
    attrs : {
      'placeholder' : '请输入密码',
      'id' : 'password',
      'name' : 'password',
      'type' : 'password'
    },
    exe : {
      textinput : []
    },
    events : {
      keyup : function(event) {
        if (event.keyCode == 13) {
          $('form').submit();
        }
      }
    }
  }, {
    tag : 'a',
    text : '登 录',
    exe : {
      button : []
    },
    events : {
      click : function() {
        $('form').submit();
      }
    }
  }, {
    tag : 'a',
    text : '忘记密码?',
    exe : {
      button : []
    },
    events : {
      click : function() {
        var user = require('user');
        user.initForgetPassword();
      }
    }
  }, {
    tag : 'a',
    text : '注 册',
    exe : {
      button : []
    },
    events : {
      click : function() {
        var user = require('user');
        user.initRegister();
      }
    }
  }, ],
  events : {
    submit : function() {
      var username = $('input[name=username]').val();
      var password = $('input[name=password]').val();
      if (!username) {
        alert("请输入用户名!");
        return false;
      }
      if (!password) {
        alert("请输入密码!");
        return false;
      }
      var form = new FormData($('form').get(0));
      form.append('type', 'user');
      form.append('act', 'login');

      skyex.lib.req(skyex.requestUrl, form, function(data) {
        switch (data.status) {
        case 1:
          // alert(data.message);
          var user = require('user');
          user.profile();
          break;
        }
      });
      return false;
    }
  }
};

htmlTemplate['initForgetPassword'] = {
  tag : 'form',
  attrs : {
    method : 'post'
  },
  events : {
    submit : function() {
      var email = $('input[name=email]').val();
      if (!email) {
        alert("请输入邮箱!");
        return false;
      }
      var form = new FormData($('form').get(0));
      form.append('type', 'user');
      form.append('act', 'password_retreive');
      skyex.lib.req(skyex.requestUrl, form, function(data) {
        switch (data.status) {
          case 1:
            alert(data.message);
            var user = require('user');
            user.initLogin();
            break;
          case 2:
            alert(data.message, 2);
        }
      });
      return false;
    }
  },
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    children : [ {
      tag : 'label',
      text : '注册邮箱：',
      attrs : {
        'for' : 'email'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'email',
        type : 'input',
        id : 'email',
        placeholder : '请输入您的注册邮箱'
      },
      exe : {
        textinput : []
      },
      events : {
        keyup : function(event) {
          if (event.keyCode == 13) {
            $('form').submit();
          }
          return false;
        }
      }
    } ],
    exe : {
      fieldcontain : []
    }
  }, {
    tag : 'a',
    text : '发送',
    exe : {
      button : []
    },
    events : {
      click : function(event) {
        $('form').submit();
        return false;
      }
    }
  } ]
};

htmlTemplate['initRegister'] = {
  tag : 'form',
  attrs : {
    method : 'post'

  },
  events : {
    submit : function() {
      var username = $('input[name=username]').val();
      var password = $('input[name=password]').val();
      var password2 = $('input[name=password2]').val();
      var email = $('input[name=email]').val();
      var captcha = $('input[name=captcha]').val();
      if (!username) {
        alert("请输入用户名!");
        return false;
      }
      if (username.length < 2 || username.length > 20) {
        alert("用户名长度必须在2~20以内!");
        return false;
      }

      if (!password) {
        alert("请输入密码!");
        return false;
      }
      if (password.length < 6 || password.length > 20) {
        alert("密码长度必须在6~20以内!");
        return false;
      }

      if (!password2) {
        alert("请输入重复密码!");
        return false;
      }

      if (password != password2) {
        alert("两次输入的密码不一致!");
        return false;
      }
      if (!email) {
        alert("请输入电子邮箱!");
        return false;
      }

      if (!/^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i
          .test(email)) {
        alert("输入电子邮箱格式不正确!");
        return false;
      }

      if (!captcha) {
        alert("请输入验证码!");
        return false;
      }

      var form = new FormData($('form').get(0));
      form.append('type', 'user');
      form.append('act', 'register');

      skyex.lib.req(skyex.requestUrl, form, function(data) {
        switch (data.status) {
          case 1:
            alert(data.message);
            var user = require('user');
            user.initLogin();
            break;
        }
      });
      return false;
    }
  },
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    children : [ {
      tag : 'label',
      text : '用户名：',
      attrs : {
        'for' : 'username'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'username',
        id : 'username',
        maxlength : '20',
        type : 'text',
        placeholder : '由4-20位中英文、数字组成'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ],
    exe : {
      fieldcontain : []
    }
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '密码:',
      attrs : {
        'for' : 'password'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'password',
        id : 'password',
        maxlength : '20',
        type : 'password',
        placeholder : '由6-20位字母、数字或符号组成'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '确认密码:',
      attrs : {
        'for' : 'password2'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'password2',
        id : 'password2',
        maxlength : '20',
        type : 'password',
        placeholder : '请再次输入密码'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '邮箱:',
      attrs : {
        'for' : 'email'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'email',
        id : 'email',
        maxlength : '20',
        type : 'text',
        placeholder : '请输入常用邮箱，用来找回密码'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '验证码：',
      attrs : {
        'for' : 'verific_code'
      }
    }, {
      tag : 'input',
      attrs : {
        'name' : 'captcha',
        'type' : 'text',
        'placeholder' : '请输入验证码',
        'id' : 'verific_code'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '',
      attrs : {
        'for' : 'verific_code'
      }
    }, {
      tag : 'img',
      attrs : {
        id : 'verific_code_image',
        src : function() {
          return skyex.captchaUrl + "/" + localStorage[skyex.sessionName];
        },
        alt : '验证码'
      },
      events : {
        click : function() {
          this.src = skyex.captchaUrl + "/" + localStorage[skyex.sessionName];
        }
      }
    }, {
      tag : 'span',
      text : '点击图片刷新',
      css : {
        cursor : 'pointer',
        color : 'red',
        padding : '0 0.4em'
      },
      events : {
        click : function() {
          $('img').attr('src', skyex.captchaUrl);
        }
      }

    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '',
      attrs : {
        'for' : ''
      }
    }, ]
  }, {
    tag : 'a',
    text : '注册',
    exe : {
      button : []
    },
    events : {
      click : function() {
        $('form').submit();
      }
    }
  } ]
};

htmlTemplate['initModifyPassword'] = {
  tag : 'form',
  attrs : {
    method : 'post'
  },
  events : {
    submit : function() {
      var old_pass = $('input[name=old_pass]').val();
      var new_pass = $('input[name=new_pass]').val();
      var new_pass2 = $('input[name=new_pass2]').val();
      if (!old_pass) {
        alert("请输入旧密码!");
        return false;
      }
      if (!new_pass) {
        alert("请输入新密码!");
        return false;
      }

      if (!new_pass2) {
        alert("请输入确认密码!");
        return false;
      }

      if (new_pass != new_pass2) {
        alert("二次输入密码不一致!");
        return false;
      }

      if (new_pass == old_pass) {
        alert("尼玛，二次输入密码一致的，想玩我啊！!");
        return false;
      }

      var form = new FormData($('form').get(0));
      form.append('type', 'user');
      form.append('act', 'password_update');
      skyex.lib.req(skyex.requestUrl, form, function(data) {
        switch (data.status) {
          case 1:
            alert(data.message);
            var user = require('user');
            user.initAccount(user.data);
            break;
        }
      });
      return false;
    }
  },
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '旧密码：',
      attrs : {
        'for' : 'old_pass'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'old_pass',
        id : 'old_pass',
        type : 'password',
        placeholder : '请输入您的旧密码'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '新密码：',
      attrs : {
        'for' : 'new_pass'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'new_pass',
        id : 'new_pass',
        type : 'password',
        placeholder : '由6-20位字母、数字或符号组成'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '确认密码：',
      attrs : {
        'for' : 'new_pass2'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'new_pass2',
        id : 'new_pass2',
        type : 'password',
        placeholder : '由6-20位字母、数字或符号组成'
      },
      exe : {
        textinput : []
      },
      events : {}
    } ]
  }, {
    tag : 'a',
    text : '确 定',
    exe : {
      button : []
    },
    events : {
      click : function() {
        $('form').submit();
      }
    }
  } ]
};

htmlTemplate['initProfile'] = {
  tag : 'form',
  attrs : {
    method : 'post'
  },
  after : function() {
    this.trigger('create');
  },
  events : {
    submit : function() {
      var username = $('input[name=username]').val();
      var mobile = $('#mobile').val();
      var email = $('input[name=email]').val();
      var gender = $('input[name=gender').val();
      if (!username) {
        alert("请输入用户名!");
        return false;
      }

      if (!/^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/.test(mobile)) {
        alert("手机号输入不正确!");
        return false;
      }

      if (!/^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i
          .test(email)) {
        alert("输入电子邮箱格式不正确!");
        return false;
      }
      var form = new FormData($('form').get(0));
      form.append('type', 'user');
      form.append('act', 'update');

      skyex.lib.req(skyex.requestUrl, form, function(data) {
        switch (data.status) {
          case 1:
            alert(data.message);
            var user = require('user');
            user.data.username = username;
            user.data.mobile = mobile;
            user.data.email = email;
            user.data.gender = gender;
            user.initAccount(user.data);
            break;
        }
      });
      return false;
    }
  },
  children : [
      {
        tag : 'div',
        attrs : {
          'data-role' : 'fieldcontain'
        },
        exe : {
          fieldcontain : []
        },
        children : [ {
          tag : 'label',
          text : '用户名：',
          attrs : {
            'for' : 'username'
          }
        }, {
          tag : 'input',
          attrs : {
            name : 'username',
            id : 'username',
            type : 'text',
            placeholder : '由6-20位字母、数字或符号组成',
            value : function(user) {
              return user.username;
            }
          },
          exe : {
            textinput : []
          }
        } ]
      },
      {
        tag : 'div',
        attrs : {
          'data-role' : 'fieldcontain'
        },
        exe : {
          fieldcontain : []
        },
        children : [ {
          tag : 'label',
          text : '手机号：',
          attrs : {
            'for' : 'mobile'
          }
        }, {
          tag : 'input',
          attrs : {
            name : 'mobile',
            id : 'mobile',
            type : 'text',
            maxlength : 11,
            value : function(user) {
              return user.mobile;
            }
          },
          exe : {
            textinput : []
          }
        } ]
      },
      {
        tag : 'div',
        attrs : {
          'data-role' : 'fieldcontain'
        },
        exe : {
          fieldcontain : []
        },
        children : [ {
          tag : 'fieldset',
          attrs : {
            'data-role' : 'controlgroup'
          },
          exe : {
            controlgroup : []
          },
          children : [
              {
                tag : 'legend',
                text : '邮箱：'
              },
              {
                tag : 'input',
        classes: ['ui-input-text-mid'],
                attrs : {
                  name : 'email',
                  id : 'email',
                  type : 'email',
          'data-inline' : 'true',
                  value : function(user) {
                    return user.email;
                  }
                },
                exe : {
                  textinput : []
                }
              },
              {
                tag : 'text',
                text : '&nbsp;'
              },
              {
                tag : 'a',
                text : function(user) {
                  if (!parseInt(user.is_email_validated)) {
                    return '验证';
                  } else {
                    return '已验证';
                  }
                },
                exe : {
                  button : []
                },
                events : {
                  click : function() {
                    var self = $(this);
            var user = this.__data;
            if (!parseInt(user.is_email_validated)) {
              skyex.lib.req(skyex.requestUrl, 'type=user&act=email_verification', function(data) {
                            switch (data.status) {
                              case 1:
                                alert(data.message);
                                self.unbind();
                                self.attr('disabled', true);
                                self.html('验证中...');
                                break;
                            }
                          });
                      return false;
                    }
                  }
                }
              } ]
        } ]
      }, {
        tag : 'div',
        attrs : {
          'data-role' : 'fieldcontain'
        },
        exe : {
          fieldcontain : []
        },
        children : [ {
          tag : 'fieldset',
          attrs : {
            'data-role' : 'controlgroup',
            'data-type' : 'horizontal'
          },
          exe : {
            controlgroup : []
          },
          children : [ {
            tag : 'legend',
            text : '性别：'
          }, {
            tag : 'input',
            attrs : {
              name : 'gender',
              id : 'male',
              type : 'radio',
              value : 'male',
              checked : function(user) {
                if (user.gender == 'male') {
                  return 'checked';
                } else {
                  return false;
                }
              }
            },
            exe : {
              checkboxradio : []
            }
          }, {
            tag : 'label',
            text : '男',
            attrs : {
              'for' : 'male'
            }
          }, {
            tag : 'input',
            attrs : {
              name : 'gender',
              id : 'female',
              type : 'radio',
              value : 'female',
              checked : function(user) {
                if (user.gender == 'female') {
                  return true;
                } else {
                  return false;
                }
              }
            },
            exe : {
              checkboxradio : []
            }
          }, {
            tag : 'label',
            text : '女',
            attrs : {
              'for' : 'female'
            }
          }, {
            tag : 'input',
            attrs : {
              name : 'gender',
              id : 'hidden',
              type : 'radio',
              value : 'hidden',
              checked : function(user) {
                if (user.gender == 'hidden') {
                  return true;
                } else {
                  return false;
                }
              }
            },
            exe : {
              checkboxradio : []
            }
          }, {
            tag : 'label',
            text : '保密',
            attrs : {
              'for' : 'hidden'
            }
          } ]
        } ]
      }, {
        tag : 'a',
        text : '确 定',
        exe : {
          button : []
        },
        events : {
          click : function() {
            $('form').submit();
          }
        }
      } ]
};

htmlTemplate['initAbout'] = {
  tag : 'div',
  classes : [ 'about' ],
  children : [ {
    tag : 'img',
    attrs : {
      src : function() {
        return skyex.logoUrl;
      }
    }
  }, {
    tag : 'h2',
    text : '版本：V1.0'
  }, {
    tag : 'p',
    text : '天易书城: www.t1bao.com'
  }, {
    tag : 'p',
    text : '客服邮箱: service@t1bao.com'
  }, {
    tag : 'p',
    text : '商务合作: business@t1bao.com'
  }, {
    tag : 'p',
    text : 'Copyright©2013'
  }, {
    tag : 'p',
    text : '天易移动'
  } ]
};

htmlTemplate['initFeedback'] = {
  tag : 'form',
  attrs : {
    method : 'post'
  },
  events : {
    submit : function() {
      if (!$('textarea').val()) {
        alert('请输入反馈消息!');
        return false;
      }
      var data = 'type=more&act=feedback&feedback=' + $('textarea').val();
      skyex.lib.req(skyex.requestUrl, data, function(data) {
        switch (data.status) {
          case 2:

            alert(data.message, 2);
            var user = require('user');
            user.initLogin();
            break;
          case 1:
            alert(data.message, 5);
            skyex.app.more.init();
            break;
        }
      });
      return false;
    }
  },
  children : [ {
    tag : 'textarea',
    attrs : {
      placeholder : '您的意见很重要！'
    },
    css : {
      height : '5em'
    },
    exe : {
      textinput : []
    },
    events : {
      keypress : function() {
        if ($(this).val().length > 140) {
          $(this).val($(this).val().substring(0, 140));
        }
        $('b.num').html(140 - $(this).val().length);
      }
    }
  }, {
    tag : 'p',
    css : {
      'text-align' : 'right'
    },
    text : '还可以输入<b class="num">140</b>字'
  }, {
    tag : 'a',
    text : '确 认',
    exe : {
      button : []
    },
    events : {
      click : function() {
        $('form').submit();
        return false;
      }
    }
  } ]

};

htmlTemplate['initMore'] = {
  tag : 'div',
  children : [ {
    tag : 'ul',
    attrs : {
      'data-role' : 'listview'
    },
    exe : {
      listview : []
    },
    children : [ {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '关于天易书城',
        events : {
          click : function() {
            skyex.app.more.initAbout();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '意见反馈',
        events : {
          click : function() {
            skyex.app.more.initFeedback();
          }
        }
      } ]
    } ]
  } ]

};

htmlTemplate['initBook'] = {
  tag : 'div',
  children : [ {
    tag : 'ul',
    attrs : {
      'data-role' : 'listview'
    },
    exe : {
      listview : []
    },
    children : [ {
      tag : 'li',
      condition : function() {
        return hasPhoneGap();
      },
      children : [ {
        tag : 'a',
        text : '本地图书',
        events : {
          click : function() {
            skyex.app.book.local();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '所有书籍',
        events : {
          click : function() {
            skyex.app.book.initMainSearch();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '最近阅读',
        events : {
          click : function() {
            var user = require('user');
            user.created();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '我创建的',
        events : {
          click : function() {
            var user = require('user');
            user.created();
          }
        }
      } ]
    }, {
      tag : 'li',
      children : [ {
        tag : 'a',
        text : '我收藏的',
        events : {
          click : function() {
            var user = require('user');
            user.subscribed();
          }
        }
      } ]
    } ]
  } ]
};

htmlTemplate['initLocalChapter'] = [ {
  tag : 'h3',
  text : function(chapter) {
    return chapter.title;
  },
  css : {
    'text-align' : 'center'
  }
}, {
  tag : 'pre',
  classes : [ 'text' ],
  text : function(chapter) {
    return chapter.content;
  }
}, {
  tag : 'a',
  text : '下一回',
  events : {
    click : function(event) {
      var chapter = this.__data;
      //var newChapter = skyex.app.book.chapters[chapter.idx];
      bm.getChapterData(chapter.book.id, chapter.chapters[chapter.idx].id, function(c) {
        c = JSON.parse(c);
        console.log(c);
        console.log("addLocalChapter");
        skyex.app.book.initLocalChapter(chapter.book, c, chapter.idx + 1, chapter.chapters);
      })

      // skyex.app.book.initChapter(skyex.app.book.chapters[chapter.idx],
      // chapter.idx + 1, chapter.total);
    }
  },
  condition : function(chapter) {

    return (chapter.idx < chapter.total);
  },
  exe : {
    button : []
  }
} ];

htmlTemplate['initChapter'] = [
    {
      tag : 'h3',
      text : function(chapter) {
        return chapter.title;
      },
      css : {
        'text-align' : 'center'
      }
    },
    {
      tag : 'pre',
      classes : [ 'text' ],
      text : function(chapter) {
        return chapter.content;
      }
    },
    {
      tag : 'a',
      text : '下一回',
      events : {
        click : function(event) {
          var chapter = this.__data;
      //var newChapter = skyex.app.book.chapters[chapter.idx];
      skyex.lib.req(skyex.requestUrl, 'type=book&act=chapter&id=' + chapter.chapters[chapter.idx].id, function(data) {
        skyex.app.book.initChapter(chapter.book, data.data[0], chapter.idx + 1, chapter.chapters);
      });
      // skyex.app.book.initChapter(skyex.app.book.chapters[chapter.idx],
      // chapter.idx + 1, chapter.total);
        }
      },
      condition : function(chapter) {

        return (chapter.idx < chapter.total);
      },
      exe : {
        button : []
      }
    } ];

htmlTemplate['bookNode'] = {
  tag : 'li',
  children : [ {
    tag : 'a',
    events : {
      click : function() {
        var book = this.__data;
        if (!book.clickable) {
          if (book.cat_id) {
            skyex.app.category.pid.push(book.cat_id);
          }
          skyex.app.book.initBook(book.id);
        }
      }
    },
    children : [ {
      tag : 'img',
      css : {
        width : '84px',
        height : '100px'
      },
      attrs : {
        src : function(book) {
          return getUrl(book.image_ids);
        }
      }
    }, {
      tag : 'h3',
      text : function(book) {
        return book.name;
      }
    }, {
      tag : 'p',
      classes : [ 'ui-li-aside' ],
      text : function(book) {
        return '<b>作者:' + book.author + "</b>";
      }
    }, {
      tag : 'p',
      text : function(book) {
        return book.intro;
      }
    } ]
  } ]
};

htmlTemplate['bookDetail'] = {
  tag : 'li',
  children : [ {
    tag : 'a',
    events : {
      click : function() {
        var book = this.__data;
        if (!book.clickable) {
          if (book.cat_id) {
            skyex.app.category.pid.push(book.cat_id);
          }
          skyex.app.book.initBook(book.id);
        }
      }
    },
    children : [ {
      tag : 'img',
      css : {
        width : '84px',
        height : '100px'
      },
      attrs : {
        src : function(book) {
          return getUrl(book.image_ids);
        }
      }
    }, {
      tag : 'h3',
      text : function(book) {
        return book.name;
      }
    }, {
      tag : 'p',
      classes : [ 'ui-li-aside' ],
      text : function(book) {
        return '<b>作者:' + book.author + "</b>";
      }
    }, {
      tag : 'p',
    } ]
  } ]
};

htmlTemplate['bookHeader'] = [ {
  tag : 'li',
  text : '简介',
  css : {
    'text-align' : 'center'
  },
  attrs : {
    'data-role' : 'list-divider'
  },
}, {
  tag : 'li',
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    children : [ {
      tag : 'img',
      css : {
        width : '84px',
        height : '100px',
        float : 'left',
        margin : '.4em',
        padding : '.3em'
      },
      attrs : {
        src : function(book) {
          return getUrl(book.image_ids);
        }
      }
    }, {
      tag : 'b',
      css : {
        color : 'red',
        margin : '.5em',
        padding : '.3em'
      },
      text : function(book) {
        return '《' + book.name + '》';
      }
    }, {
      tag : 'br'
    }, {
      tag : 'span',
      css : {
        margin : '.6em',
        padding : '.3em'
      },
      text : function(book) {
        return '作者: <i>' + book.author + "</i>";
      }
    }, {
      tag : 'br'
    }, {
      tag : 'p',
      text : function(book) {
        return book.intro;
      },
      css : {
        margin : '.4em',
        padding : '.3em'
      },
    } ]
  }, {
    tag : 'div',
    children : [ {
      tag : 'select',
      attrs : {
        'data-role' : 'flipswitch',
        'id' : 'subscribe',
      },
      exe : {
        flipswitch : []
      },
      after : function(book) {
        var user = require("user");
        console.log('after');
        console.log(book);
        var user = require('user');
        console.log(user.data);
        if (!user.data || !book) {
          console.log('return');
          return;
        }

        var books = user.data.sub_books;
        var value = '订阅';
        var self = this;
        if (books && (books.indexOf(book.id) > -1)) {
          console.log('取消');
          value = '取消';
        }
        setTimeout(function() {
          $(self).val(value).flipswitch( "refresh" );
        }, 50);
      },
      events : {
        change : function() {
          // alert(this.value);
          var book = this.__data;
          var value = 1, timer = null;
          var old = '订阅';
          switch (this.value) {
            case '订阅':
              value = 0;
              old = '取消';
              break;
          }
          var self = this;
          var user = require('user');
          user.subscribe(book.id, value, function() {
            console.log("inside clear");
            clearTimeout(timer);
            $(self).val(self.value);
            //.flipswitch( "refresh" );
          });
          timer = setTimeout(function() {
            $(self).val(old);//.flipswitch( "refresh" );
          }, 100);
        }
      },
      children : [ {
        tag : 'option',
        text : '订阅',
        value : '订阅'
      }, {
        tag : 'option',
        text : '取消',
        value : '取消'
      } ]
    } ]
  }, ]
}, {
  tag : 'li',
  children : [ {
    tag : 'a',
    text : '下载',
    condition : function() {
      return true || hasPhoneGap();
    },
    events : {
      click : function() {
        var book = this.__data;
        console.log('下载' + book);
        jqm_alert("正在下载中.....", -1);
        var mb = bm;
        
        // 创建目录
        mb.createDir(book.id, function() {
          jqm_alert('正在保存文章信息...', -1);
          mb.setBookInfo(book.id, JSON.stringify( book ), function() {
            jqm_alert('保存文章信息成功，正在下载章节信息...', -1);
            skyex.lib.req(skyex.requestUrl, 'type=book&act=info&id=' + book.id, function(data) {
              switch (data.status) {
              case 1:
                var chapters = data.data;
                if (!chapters.length) {
                  // mb.removeDir(book.id);
                  jqm_alert('文章信息不存在，退出下载！', 2);
                  return;
                }
                jqm_alert('章节信息下载成功，正在保存...', -1);
                mb.setChapterInfo(book.id, JSON.stringify(chapters), function() {
                  jqm_alert('章节信息保存成功，正在下载文章内容...', -1);
                  var idx = 0;
                  console.log(chapters.length);
                  console.log(JSON.stringify(chapters[0]));

                  function saveChapter(idx, total) {
                    skyex.lib.req(skyex.requestUrl, 'type=book&act=chapter&id=' + chapters[idx].id, function(data) {
                      console.log("inside chapter get " + chapters[idx].id);
                      jqm_alert('第' + (idx + 1) + '章' + chapters[idx].title + '下载完成, 正在保存...', -1);
                      var c = data.data[0];
                      console.log(JSON.stringify(data.data));
                      mb.setChapterData(book.id, chapters[idx].id, JSON.stringify(c), function() {
                        if (idx >= total - 1) {
                          jqm_alert("下载完成!", 2);
                        } else {
                          saveChapter(idx + 1, total);
                        }
                      });
                    }, true);
                  }
                  saveChapter(0, chapters.length);

                });
              }
            }, true);
          });
        });
      }
    },
    exe : {
      button : []
    }

  } ]

} ];

htmlTemplate['booklocalHeader'] = [ {
  tag : 'li',
  text : '简介',
  css : {
    'text-align' : 'center'
  },
  attrs : {
    'data-role' : 'list-divider'
  },
}, {
  tag : 'li',
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    children : [ {
      tag : 'img',
      css : {
        width : '84px',
        height : '100px',
        float : 'left',
        margin : '.4em',
        padding : '.3em'
      },
      attrs : {
        src : function(book) {
          return getUrl(book.image_ids);
        }
      }
    }, {
      tag : 'b',
      css : {
        color : 'red',
        margin : '.5em',
        padding : '.3em'
      },
      text : function(book) {
        return '《' + book.name + '》';
      }
    }, {
      tag : 'br'
    }, {
      tag : 'span',
      css : {
        margin : '.6em',
        padding : '.3em'
      },
      text : function(book) {
        return '作者: <i>' + book.author + "</i>";
      }
    }, {
      tag : 'br'
    }, {
      tag : 'p',
      text : function(book) {
        return book.intro;
      },
      css : {
        margin : '.4em',
        padding : '.3em'
      },
    } ]
  } ]
} ];
htmlTemplate['navBar'] = [ {
  tag : 'a',
  text : function(info) {
    return info.left.text;
  },
  css : {
    display : function(info) {
      return ;
    }
  },
  attrs : {
    'data-icon' : 'arrow-l',
    id : 'backBtn'
  },
  classes: ['ui-btn-left', 'ui-btn', 'ui-btn-inline', 'ui-corner-all', 'ui-btn-icon-left', 'ui-icon-arrow-l'],
  events : {
    click : function(event) {
      var info = this.__data;
      if (info.left.click)
        info.left.click();
    }
  },
  after: function(info) {
    info.left.show ? $(this).show() : $(this).hide();
  }
}, {
  tag : 'h1',
  classes : [ 'title', 'ui-title' ],
  text : function(info) {
    return info.title;
  }
}, {
  tag : 'a',
  text : function(info) {
    return info.right.text;
  },
  classes : [ 'ui-btn-right' ],
  css : {
    display : function(info) {
      return info.left.show ? 'block' : 'none';
    }
  },
  attrs : {
    'data-icon' : 'plus',
    'data-theme' : 'b'
  },
  events : {
    click : function() {
      var info = this.__data;
      if (info.right.click)
        info.right.click();
    }
  },
  after: function(info) {
    info.right.show ? $(this).show() : $(this).hide();
  }
} ];

htmlTemplate['initAddBook'] = {
  tag : 'form',
  children : [ {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '书名：',
      attrs : {
        'for' : 'name'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'name',
        id : 'name',
        type : 'text',
        placeholder : '请输入您的书名'
      },
      exe : {
        textinput : []
      }
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '介绍',
      attrs : {
        'for' : 'intro'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'intro',
        id : 'intro',
        type : 'texteara',
        placeholder : '关于本书的简单介绍，200字以内'
      },
      exe : {
        textinput : []
      },
    } ]
  }, {
    tag : 'div',
    attrs : {
      'data-role' : 'fieldcontain'
    },
    exe : {
      fieldcontain : []
    },
    children : [ {
      tag : 'label',
      text : '封面:',
      attrs : {
        'for' : 'intro'
      }
    }, {
      tag : 'input',
      attrs : {
        name : 'intro',
        id : 'intro',
        type : 'file',
        placeholder : '关于本书的简单介绍，200字以内'
      },
      exe : {
        textinput : []
      },
    }, {
      tag : 'img',
    } ]
  }, {
    tag : 'a',
    text : '添 加',
    exe : {
      button : []
    },
    events : {
      click : function() {

      }
    }
  } ]
};

console.log('inside dom');
console.log(htmlTemplate['initLogin']);
return {
  htmlTemplate: htmlTemplate
};
});