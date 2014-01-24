var BookManager = {
  fs : null,
  dir : null,

  init : function(dir, success, fail) {
    this.dir = dir;
    var self = this;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      self.fs = fileSystem;
      fileSystem.root.getDirectory(dir, {
        create : true,
        exclusive : false
      }, success, fail);
    });
  },
  createDir : function(path, success, fail) {
    this.fs.root.getDirectory(this.dir + '/' + path, {
      create : true,
      exclusive : false
    }, success, fail);
  },
  removeDir : function(path, success, fail) {
    this.fs.root.getDirectory(this.dir + '/' + path, {
      create : true,
      exclusive : false
    }, function(entry) {
      entry.removeRecursively(function() {

        console.log("Remove Recursively Succeeded");
        success();
      }, fail);
    }, fail);
  },
  download : function(url, filename, callback) {

    this.fs.root.getFile(this.dir + '/' + filename, {
      create : true,
      exclusive : false
    }, function(fileEntry) {

      var fileTransfer = new FileTransfer();
      var uri = encodeURI(url);

      fileTransfer.download(uri, fileEntry.fullPath, function(entry) {
        console.log("download complete: " + entry.fullPath);
        callback ? callback() : '';
      }, function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
        callback ? callback() : '';
      }, false, {});
    });
  },
  list : function(callback) {
    this.fs.root.getDirectory(this.dir, {
      create : true,
      exclusive : false
    }, function(directory) {
      var directoryReader = directory.createReader();
      directoryReader.readEntries(callback, function(error) {
        console.log(error.code);
      });
    });
  },
  read : function(filename, callback) {
    this.fs.root.getFile(this.dir + '/' + filename, null, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
          console.log("Read as text");
          console.log(evt.target.result);
          callback(evt.target.result);
        };
        try {
          reader.readAsText(file);
        } catch (e) {
          callback('error:' + e.message);
        }

      })
    }, function(e) {
      callback('file error:' + e.message);
    });

  },
  save : function(filename, content, callback) {
    this.fs.root.getFile(this.dir + '/' + filename, {
      create : true,
      exclusive : false
    }, function(fileEntry) {
      console.log("get file root name = " + fileEntry.fullPath);

      fileEntry.createWriter(function(writer) {
        console.log("createWriter name = " + writer);
        writer.onwriteend = function(evt) {
          console.log("write success");
          if (callback instanceof Function) {
            callback(fileEntry);
          }
        };

        writer.write(content);
        writer.abort();
      }, function(error) {
        console.log("error : " + error.code);
      });
    });
  },
  remove : function(filename, success, fail) {
    this.fs.root.getFile(this.dir + '/' + filename, {
      create : false,
      exclusive : false
    }, function(fileEntry) {
      fileEntry.remove(success, fail);
    });
  },
  getBookInfo : function(id, callback) {
    this.read(id + '/info', callback);
  },
  setBookInfo : function(id, data, callback) {
    var self = this;
    this.createDir(id, function() {
      self.save(id + '/info', data, callback);
    });
  },
  getChapterInfo : function(id, callback) {
    this.read(id + '/chapters', callback);
  },
  setChapterInfo : function(id, data, callback) {
    var self = this;
    this.createDir(id, function() {
      self.save(id + '/chapters', data, callback);
    });
  },
  getChapterData : function(book_id, chapter_id, callback) {
    this.read(book_id + '/chapter-' + chapter_id, callback);
  },
  setChapterData : function(book_id, chapter_id, data, callback) {
    var self = this;
    this.createDir(book_id, function() {
      self.save(book_id + '/chapter-' + chapter_id, data, callback);
    });
  },
};
