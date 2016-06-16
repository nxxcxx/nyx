var Renderer = require( './Renderer/Renderer' );
var AssetManager = require( './AssetManager' );

function shell( opts, setup, draw ) {

	let $ = {};
	$.renderer = Renderer( opts.renderer );

	AssetManager.fetch( opts.assets, assets => {

		$.assets = assets;
		setup( $ );

		( function tick( time ) {

			requestAnimationFrame( tick );
			draw( $, time );

		} )();

	} );

	return $;

}

module.exports = shell;
