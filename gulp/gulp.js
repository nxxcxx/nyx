var gulp = require( 'gulp' );

gulp.task( 'bundle', require( './tasks/bundle.task' ) );
gulp.task( 'serve', [ 'bundle' ], require( './tasks/serve.task') );
