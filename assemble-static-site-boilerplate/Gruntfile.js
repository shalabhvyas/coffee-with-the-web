module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('_config.json'),

    assemble: {
      options: {

        //Any fields defined here can be directly referred as Root Context in templates/layouts/partials.

        flatten: true,
        production: "<%= config.production %>",
        assets: '<%= config.assets %>',        

        // Metadata        
        data: ['<%= config.data %>/*.json'],

        // Templates
        partials: '<%= config.partials %>',
        layoutdir: '<%= config.layouts %>',
        layout: '<%= config.default_layout %>',


      },
      build: {
        files: {
          '<%= config.build_path %>/': ['<%= config.templates %>/*.hbs']
        }
      },
      design: {
        files: {
          './': ['<%= config.templates %>/*.hbs']
        }
      }
    },

    //Compile SASS files 
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/scss',
          src: ['*.scss'],
          dest: '<%= config.assets %>/css',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      combine: {
        options:{
          keepSpecialComments : 0
        },
        files: {
          '<%= config.build_path %>/<%= config.app_name %>.min.css': ['<%= config.assets %>/css/**/*.css']
        }
      }
    },

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', '<%= config.assets %>/js/**/*.js'],      
      options: {
        jshintrc: '.jshintrc',
        force: true
      }
    },

    //Minify JS and CSS files
    uglify: {
      build: {
        files: {
          '<%= config.build_path %>/<%= config.app_name %>.min.js': ['<%= config.assets %>/js/**/*.js']          
        }
      }
    },

    //Clean the build folder
    clean: {
      build: ["<%= config.build_path %>"]
    },

    copy: {
      build: {
        //Copy only images and fonts. CSS and JS are minified
        src: ['<%= config.assets %>/img','<%= config.assets %>/fonts'],
        dest: '<%= config.build_path %>/',
        expand: true
      }
    },

    //Watch the CSS and JS files.
    watch: {
      styles: {
        //Watch SASS files to compile to CSS files
        files: ['<%= config.assets %>/scss/**/*.scss'],
        tasks: ['sass']        
      },
      scripts: {
        //Watch JS files to do linting
        files: ['<%= config.assets %>/js/**/*.js'],
        tasks: ['jshint']
      },
      templates: {
        //Watch template and data files
        files: ['<%= config.templates %>/**/*.hbs','<%= config.data %>/*.json'],
        tasks: ['assemble:design']
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['clean','sass','jshint', 'assemble:build','uglify','cssmin','copy']);
  grunt.registerTask('design', ['clean','sass','jshint', 'assemble:design', 'watch']);

};