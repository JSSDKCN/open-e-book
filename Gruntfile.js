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
            'dest/index.html': 'angular_index.html',     // 'destination': 'source'
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
              optimize: 'uglify',
              mainConfigFile: "scripts/config/angularconf.js",
              out: "dest/scripts/<%= pkg.name %>.min.js",
              findNestedDependencies: true,
              include: ['../Library/require.js']
          }
        }
      },
      /*
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
      },
      */
      inline_angular_templates: {
        dist: {
            options: {
                base: '.', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
                prefix: '',            // (Optional) Prefix path to the ID. Default is empty string.
                selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
                method: 'prepend',       // (Optional) DOM insert method. Default is `prepend`.
                unescape: {             // (Optional) List of escaped characters to unescape
                    '&lt;': '<',
                    '&gt;': '>',
                    '&apos;': '\'',
                    '&amp;': '&'
                }
            },
            files: {
                'angular_index.html': ['templates/**/*.html', 'templates/**/**/*.html']
            }
        }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-inline-angular-templates');
  
  grunt.registerTask('default', ['requirejs', 'cssmin', 'htmlmin']);
  grunt.registerTask('template', ['inline_angular_templates']);
  
};
