var Renderer = require( './Renderer/Renderer' );
var AssetManager = require( './AssetManager' );
var engine = {};

engine.start = function ( opts, setup, draw ) {

	engine.renderer = Renderer( opts.renderer );

	AssetManager.fetch( opts.assets, assets => {

		engine.assets = assets;
		setup( engine );

		( function tick( time ) {

			requestAnimationFrame( tick );
			draw( engine, time );

		} )();

	} );

};

module.exports = engine;
