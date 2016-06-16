var Renderer = require( './Renderer/Renderer' );
var AssetManager = require( './AssetManager' );
var shell = {};

shell.start = function ( opts, setup, draw ) {

	shell.renderer = Renderer( opts.renderer );

	AssetManager.fetch( opts.assets, assets => {

		shell.assets = assets;
		setup( shell );

		( function tick( time ) {

			requestAnimationFrame( tick );
			draw( shell, time );

		} )();

	} );

};

module.exports = shell;
