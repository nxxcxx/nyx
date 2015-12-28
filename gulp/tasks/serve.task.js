var gulp = require( 'gulp' );
var browserSync = require( 'browser-sync' ).create();

module.exports = function () {

	browserSync.init( {

		files: [ './css/*.css' ],
		injectChanges: true,

		server: {

			baseDir: '.',
			index: 'index.html'

		},

		port: 3000,
		ui: false,
		open: false,
		reloadOnRestart: true

	} );

	gulp.watch( [

		'index.html',
		'./build/*',
		'./assets/**/*'

	], browserSync.reload );

};
