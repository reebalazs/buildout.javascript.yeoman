
/*

    collect.local().select('slick.grid.upstream.css')
    collect.local('path/to/config/').select('slick.grid.upstream.css')


    collect.bower('slickgrid').select('main')

    collect.bower('foo').select({'option1': 'value1'})        // uses collection.js


 */

var collect = require('grunt-collection-helper');


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! Built by <%= pkg.name %> */\n'
      },
      js: {
        files: {
          'dist/slickgrid.upstream.js':
            collect.local().select('slickgrid.upstream.js'),
          'dist/jquery.js':
            collect.bower('jquery').select('jquery.js')
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= concat.options.banner %>'
      },
      js: {
        files: {
          'dist/slickgrid.upstream.js':
            collect.local().select('slickgrid.upstream.js'),
          'dist/jquery.js':
            collect.bower('jquery').select('jquery.js')
        }
      }
    },
    less: {
      'default': {
        options: {
          paths: ['src/slickgrid/examples']
        },
        files: {
          'src/slickgrid/examples/example-bootstrap.css':
            collect.local().select('example-bootstrap.css')
        }
      },
      minify: {
        options: {
          paths: ['src/slickgrid/examples'],
          yuicompress: true
        },
        files: {
          'src/slickgrid/examples/example-bootstrap.css':
            collect.local().select('example-bootstrap.css')
        }
      }
    },
    watch: {
      options: {
        debounceDelay: 250
      },
      'default': {
        files:
            collect.local().select('slickgrid.upstream.js') +
            collect.local().select('example-bootstrap.css'),
        tasks: ['concat:js', 'concat:css', 'less:default']
      },
      minify: {
        files:
            collect.local().select('slickgrid.upstream.js') +
            collect.local().select('example-bootstrap.css'),
        tasks: ['uglify:js', 'concat:css', 'less:minify']
      }
    }
  });

  // Load the task plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['concat:js', 'less:default']);
  grunt.registerTask('minify', ['uglify:js', 'less:minify']);
  grunt.registerTask('watch-default', ['watch:default']);
  grunt.registerTask('watch-minify', ['watch:minify']);

};
