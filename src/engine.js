var renderer = require( './Renderer/Renderer' );
var AssetManager = require( './AssetManager' );
var engine = {};

engine.start = function ( opts, setup, draw ) {

	engine.renderer = renderer( opts );

	AssetManager.fetch( opts.assets, assets => {

		engine.assets = assets;
		setup( engine );
		( function tick() {
			requestAnimationFrame( tick );
			draw( engine );
		} )();

	} );

};

module.exports = engine;
