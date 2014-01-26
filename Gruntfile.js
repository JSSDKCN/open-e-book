module.exports = function(grunt) {
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      htmlmin: {                                     // Task
        dist: {                                      // Target
          options: {                                 // Target options
            removeComments: true,
            collapseWhitespace: true
          },
          files: {                                   // Dictionary of files
            'dest/index.html': 'index.html',     // 'destination': 'source'
          }
        },
      },
      cssmin: {
        styles: {
            src: ["Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0.css", 'styles/*.css'],
            dest: 'dest/styles/<%= pkg.name %>.min.css'
        },
      },
      requirejs: {
        compile: {
          options: {
              baseUrl: "scripts",
              name: 'main',
              optimize: 'uglify',
              mainConfigFile: "scripts/config/global.js",
              out: "dest/scripts/<%= pkg.name %>.min.js",
              findNestedDependencies: true,
              include: ['../Library/require.js']
          }
        }
      }
  });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.registerTask('default', ['requirejs', 'cssmin', 'htmlmin']);
};
