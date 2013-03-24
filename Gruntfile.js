
/*

    collect.local().select('slick.grid.upstream.css')
    collect.local('path/to/config/').select('slick.grid.upstream.css')


    collect.bower('slickgrid').select('main')

    collect.bower('foo').select({'option1': 'value1'})        // uses collection.js


 */

var path = require('path');
var grunt = require('grunt');

function Collection(base) {
  this.base = base;
  this.jsonPath = path.join(base, 'collection.json');
  this.config = grunt.file.readJSON(this.jsonPath);
}

Collection.prototype = {

  constructor: Collection,

  select: function(key) {
    if (typeof key === 'string') {
      var config = this.config[key];
      if (config === undefined) {
        throw new Error('Bad config, no such key "' + key +
          '" in file "' + this.jsonPath + '".');
      }
      if (! Array.isArray(config)) {
        throw new Error('Bad config, value must be an array for key "' + key +
          '" in file "' + this.jsonPath + '".');
      }
      // paths relative from json file path
      var result = [];
      for (var i = 0; i < config.length; i++) {
        result.push(path.join(this.base, config[i]));
      }
      return result;
    } else {
      throw new Error('Not yet supported.');
    }
  }

};

var collect = {

  local: function (/*optional*/ base) {
    // base parameter specifies the root location, place of collection.json
    if (base === undefined) {
      // grunt makes sure that we are cwd to the gruntfile's location,
      // this will make everything relative to the gruntfile.
      base = '.';
    }
    return new Collection(base);
  },

  bower: function (pkgName) {
    // Bower's packages are under components/${pkgName}
    var base = path.join('components', pkgname);
    return new Collection(base);
  }

};


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
            collect.local().select('slickgrid.upstream.js')
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
            collect.local().select('slickgrid.upstream.js')
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
