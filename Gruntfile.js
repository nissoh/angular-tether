'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: require('./bower.json'),
    paths : {
      src : "src",
      dist : "dist",
      tmp : ".tmp"
    },
    watch: {
      sass: {
        files: ['<%= paths.src %>/css/*.scss'],
        tasks: ['sass:server']
      },
      js: {
        files: ['<%= paths.src %>/**/.js'],
        options: {
          livereload: true
        }
      }
    },
    sass: {
      server: {
        files: {
          '<%= paths.src %>/styles/main.css': '<%= paths.src %>/styles/main.scss'
        },
        options: {
          sourceComments: 'none'
        }
      }
    },
    connect: {
      dev: {
        options: {
          livereload : 35729,
          port: 8080,
          hostname: 'localhost',
          base: [
            'src'
          ]
        }
      }
    },
    release: {
      options: {
        npm: false,
        file: 'bower.json'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: process.env.CI
      }
    },
    ngmin: {
      dist: {
        expand: true,
        cwd: '<%= paths.src %>',
        src: '*.js',
        dest: '<%= paths.tmp %>'
      }
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: '<%= paths.tmp %>/**/*.js',
        dest: '<%= paths.dist %>/angular-tether.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/angular-tether.min.js': 'dist/angular-tether.js'
        }
      }
    },
    concurrent: {
      tasks: ['connect:dev:keepalive', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });



  grunt.registerTask('dev', [
    'watch',
    'connect:dev:keepalive'
  ]);

  grunt.registerTask('build', [
    'ngmin',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'concurrent'
  ]);
};
