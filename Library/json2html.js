(function($) {
  
  function f(val, dom, data) {
    if (typeof val === 'function') {
      return val.apply(dom, [data||{}]);
    }
    return val;
  }
  function json2html(node, exes, data) {

    //for html elements they should have the following attributes
    /*
     * 
     *  1. tag name       @string
     *    li, tr, td
     *  2. text      @string
     *
     *  3. attributes     @json
     *    {key: value}
     *  4. children       @array
     *    [node1, node2, node3]
     *    
     *  5. events          @json
     *    {event1: function() {}, event2: function() {}}
     *  */

    var dom = null;
    if (node.condition) {
      console.log('inside condition');
      console.log(data);
      if (!node.condition.apply(this, [data||{}])) {
        console.log('inside true');
        return null;
      }
    }
    switch (node.tag) {
      case 'text':
        dom = $(document.createTextNode(f(node.text, dom, data)));
      default:
        dom = $('<' + node.tag + '>');
        if (node.text) {
          dom.html(f(node.text, dom, data));
        }
    }
    var temp = dom.get(0);
    temp.__data =  data;
    if (node.attrs) {
      for ( var key in node.attrs) {
        dom.attr(key, f(node.attrs[key], dom, data));
      }
    }
    
    if (node.classes) {
      for ( var j = 0; j < node.classes.length; j++) {
        dom.addClass(f(node.classes[j], dom, data));
      }
    }
    
    if (node.css) {
      for ( var key in node.css) {
        dom.css(key, f(node.css[key], dom, data));
      }
    }

    if (node.events) {
      for ( var event in node.events) {
        dom.on(event, node.events[event]);
      }
    }

    if (node.children) {
      for ( var j = 0; j < node.children.length; j++) {
        var child = json2html(node.children[j], exes, data);
        if (child) {
          dom.append(child);
        }
      }
    }
    if (node.exe) {
      for ( var func in node.exe) {
        if (typeof exes == 'undefined') {
          dom[func].apply(dom, node.exe[func]);
        } else {
          exes.push([ dom[func], dom, node.exe[func]]);
        }
      }
    }
    if (node.after) {
      if (typeof exes == 'undefined') {
        node.after.apply(dom, [data||{}]);
      } else {
        exes.push([ node.after, dom, [data||{}]]);
      }
      
    }
    return dom;
  }

  $.extend({
    json2html : function(json, dom, data, noclear) {
      var exes = [];
      var html = json2html(json, exes, data);
      console.log(html);
      if (dom && html) {
        if (!noclear) {
          dom.html('');
        }
        dom.append(html);
      }
      for ( var i = 0; i < exes.length; i++) {
        var exe = exes[i];
        exe[0].apply(exe[1], exe[2]);
      }
      return html;
    },
    array2html : function(arr, dom, data) {
      var htmls = [];
      if (dom) {
        dom.html('');
      }
      for(var i = 0; i < arr.length; i++) {
        var json = arr[i];
        console.log(json);
        htmls.push(this.json2html(json, dom, data, true));
      }
      return htmls;
    }
  });
})(jQuery);
