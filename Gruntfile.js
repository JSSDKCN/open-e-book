module.exports = function(grunt) {
  
  var name = 'ionic';
  
  //name = 'jqm';
  
  var config = {};
  
  config['ionic'] = {
      pkg: grunt.file.readJSON('package.json'),
      htmlmin: { // Task
        dist: { // Target
            options: { // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: {
              'dest/ionic/index.html': 'dest/ionic/ionic.html'
            }
        },
      },
      cssmin: {
        styles: {
            src: ["Library/ionic/styles/ionic.css", 'styles/app.css'],
            dest: 'dest/ionic/styles/<%= pkg.name %>.min.css'
        },
      },
      requirejs: {
        compile: {
          options: {
              baseUrl: "scripts",
              optimize: 'uglify',
              mainConfigFile: "scripts/config/ionic.js",
              out: "dest/ionic/scripts/<%= pkg.name %>.min.js",
              findNestedDependencies: true,
              include: ['../Library/requirejs/require.js']
          }
        }
      },
      inline_angular_templates: {
        dist: {
            options: {
                base: '.', // (Optional) ID of the <script> tag will be
                // relative to this folder. Default is project dir.
                prefix: '', // (Optional) Prefix path to the ID. Default is
                // empty string.
                selector: 'body', // (Optional) CSS selector of the element to
                // use to insert the templates. Default is
                // `body`.
                method: 'prepend', // (Optional) DOM insert method. Default is
                // `prepend`.
                unescape: { // (Optional) List of escaped characters to unescape
                    '&lt;': '<',
                    '&gt;': '>',
                    '&apos;': '\'',
                    '&amp;': '&'
                }
            },
            files: {
              'dest/ionic/ionic.html': ['templates/ionic/**/*.html']
            }
        }
      },
      copy: {
        main: {
          files: [{
              expand: true,
              cwd: 'Library/ionic/fonts/',
              src: ['**'],
              dest: 'dest/ionic/fonts/',
          }, {
              src: 'templates/ionic/index.html',
              dest: 'dest/ionic/ionic.html',
          }]
        
        }
      }
  };
  
  config['jqm'] = {
      pkg: grunt.file.readJSON('package.json'),
      htmlmin: { // Task
        dist: { // Target
            options: { // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: {
              'dest/jqm/index.html': 'dest/jqm/jqm.html'
            }
        },
      },
      cssmin: {
        styles: {
            src: ["Library/jquery.mobile-1.4.0/jquery.mobile-1.4.0.css",
                'styles/jpmapp.css'],
            dest: 'dest/jqm/styles/<%= pkg.name %>.min.css'
        },
      },
      requirejs: {
        compile: {
          options: {
              baseUrl: "scripts",
              optimize: 'uglify',
              mainConfigFile: "scripts/config/jqm.js",
              out: "dest/jqm/scripts/<%= pkg.name %>.min.js",
              findNestedDependencies: true,
              include: ['../Library/requirejs/require.js']
          }
        }
      },
      inline_angular_templates: {
        dist: {
            options: {
                base: '.', // (Optional) ID of the <script> tag will be
                // relative to this folder. Default is project dir.
                prefix: '', // (Optional) Prefix path to the ID. Default is
                // empty string.
                selector: 'body', // (Optional) CSS selector of the element to
                // use to insert the templates. Default is
                // `body`.
                method: 'prepend', // (Optional) DOM insert method. Default is
                // `prepend`.
                unescape: { // (Optional) List of escaped characters to unescape
                    '&lt;': '<',
                    '&gt;': '>',
                    '&apos;': '\'',
                    '&amp;': '&'
                }
            },
            files: {
              'dest/jqm/jqm.html': ['templates/jquerymobile/**/*.html']
            }
        }
      },
      copy: {
        main: {
          files: [{
              expand: true,
              cwd: 'Library/jquery.mobile-1.4.0/images/',
              src: ['**'],
              dest: 'dest/jqm/images/'
          }, {
              src: 'templates/jquerymobile/index.html',
              dest: 'dest/jqm/jqm.html'
          }]
        }
      }
  };
  
  grunt.initConfig(config[name]);
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-inline-angular-templates');
  
  grunt.registerTask('default', ['copy', 'inline_angular_templates', 'htmlmin',
      'requirejs', 'cssmin']);
  
  // grunt.registerTask('default', ['copy', 'inline_angular_templates']);
  grunt.registerTask('template', ['inline_angular_templates']);
  
};
