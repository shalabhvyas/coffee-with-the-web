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
        data: ['<%= config.data %>/*.{json}'],

        // Templates
        partials: '<%= config.partials %>',
        layoutdir: '<%= config.layouts %>',
        layout: '<%= config.default_layout %>',


      },
      build: {
        files: {
          '<%= config.build_path %>/': ['<%= config.templates %>/*.hbs']
        }
      }
    },

    //Compile SASS files 
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/scss',
          src: ['*.scss'],
          dest: 'assets/css',
          ext: '.css'
        }]
      }
    },

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', '<%= config.assets %>/js/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      styles: {
        files: ['<%= config.assets %>/scss/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false          
        }
      },
      scripts: {
        files: ['<%= config.assets %>/js/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false          
        }
      }

    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('design', ['readme', 'sync']);

};