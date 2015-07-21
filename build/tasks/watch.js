var gulp = require('gulp');
var paths = require('../paths');
var runSequence = require('run-sequence');

// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}


gulp.task('copy-to-aurelia', [], function() {
  gulp.src(paths.output + 'commonjs/**/*.js')
    .pipe(gulp.dest('../../Code/t1/jspm_packages/github/tfrydrychewicz/aurelia-flux@master'));
});

gulp.task('watcher', function(cb) {
  runSequence('clean','build-commonjs','copy-to-aurelia',cb);
});

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', [], function() {
  gulp.watch(paths.source, ['watcher']).on('change', reportChange);  
});
