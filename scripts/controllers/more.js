define(['jquery', 'skyex', 'req', 'dom'], function($, skyex, req, xdom) {
  
  skyex.app.more = {
      idx: 3,
      init : function() {
        skyex.app.book.backBtn('更多', {
          click : function() {
            var pid = skyex.app.category.pid.pop();
            skyex.app.category.get(pid);
            return false;
          }
        });
        
        $.json2html(xdom.htmlTemplate['initMore'], $('.wrapper'));
      },
      
      initAbout : function() {
        skyex.app.book.backBtn('关于天易书城', {
            click : function() {
              skyex.app.more.init();
              return false;
            },
            show : true
        });
        $.json2html(xdom.htmlTemplate['initAbout'], $('.wrapper'));
      },
      initFeedback : function() {
        skyex.app.book.backBtn('意见反馈', {
            click : function() {
              skyex.app.more.init();
              return false;
            },
            show : true
        });
        
        $.json2html(xdom.htmlTemplate['initFeedback'], $('.wrapper'));
      }
  };
  return skyex.app.more;
});