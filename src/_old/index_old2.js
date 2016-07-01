'use strict';

require( 'src/globals' );

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let ASPECT_RATIO = WIDTH / HEIGHT;

global.RENDERER = NYX.Renderer();

( function initCanvas() {

	global.canvas = RENDERER.canvas;
	canvas.style.position = 'absolute';
	canvas.style.top = '0px';
	canvas.style.left = '0px';
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	document.body.style.margin = '0px';
	document.body.appendChild( canvas );

} )();

RENDERER.setViewport( WIDTH, HEIGHT );
RENDERER.clear();

global.CAMERA = new NYX.PerspectiveCamera( NYX.Util.rad( 45 ), ASPECT_RATIO, 1, 10000 );
NYX.OrbitCtrl( canvas, CAMERA );

NYX.AssetManager.fetch( {

	images: {
		stone: './assets/tex/stone.jpg',
		matcap: './assets/tex/mc_skymetal.jpg'
	},
	json: {
		skull: './assets/ext/skull.json'
	},
	shaders: {
		textureExampleVert: './assets/shaders/textureExample.vert',
		textureExampleFrag: './assets/shaders/textureExample.frag',
		normalExampleVert: './assets/shaders/normalExample.vert',
		normalExampleFrag: './assets/shaders/normalExample.frag',
		matcapVert: './assets/shaders/matcap.vert',
		matcapFrag: './assets/shaders/matcap.frag'
	}

}, assets => {

	global.ASSETS = assets;
	main();
	run();

} );

function main() {

	// Mesh - texture test
		let geom = new NYX.BufferGeometry();
		let vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] );
		let indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);
		let uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]);
		geom.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] );
		geom.addAttribute( 'index', indices, [ indices.length, 1 ] );
		geom.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] );

		// FBO RTT test
			let dt = new NYX.Texture.DataTexture( 512 );
			global.rt = new NYX.RenderTarget( dt );
		// normal texture
			let tex = new NYX.Texture.ImageTexture( { data: ASSETS.images.stone.data } );

		let shader = new NYX.Shader( {

			vs: ASSETS.shaders.textureExampleVert.data,
			fs: ASSETS.shaders.textureExampleFrag.data,
			uniforms: {
				uTexture: { type: 't', value: rt }
			}

		} );
		global.mesh = new NYX.Mesh( geom, shader );
		vec3.set( mesh.position, -3.0, 0.0, 0.0 );
		mesh.updateModelMatrix();

	// Mesh2 - json & normal test

		let matcap = new NYX.Texture.ImageTexture( { data: ASSETS.images.matcap.data } );

		let geom = new NYX.BufferGeometry();
		let shader = new NYX.Shader( {

			vs: ASSETS.shaders.matcapVert.data,
			fs: ASSETS.shaders.matcapFrag.data,
			uniforms: {
				uMatcap: { type: 't', value: matcap }
			}

		} );

		global.mesh2 = new NYX.Mesh( geom, shader );
		vec3.set( mesh2.scale, 1.0, 1.0, 1.0 );
		// vec3.set( mesh2.position, -2.5, 0.0, 0.0 );
		mesh2.updateModelMatrix();

		let res = ASSETS.json.skull.data;
		let vpos = ndarray( new Float32Array( res.vertices ), [ res.vertices.length / 3, 3 ] );
		let vidx = ndarray( new Uint32Array( res.faces ), [ res.faces.length, 1 ] );

		geom.addAttribute( 'position', vpos.data, vpos.shape );
		geom.addAttribute( 'index', vidx.data, vidx.shape );

		geom.computeVertexNormals();

}

function run( time ) {

	requestAnimationFrame( run );

	RENDERER.setClearColor( 0.12, 0.12, 0.13, 1.0 );
	RENDERER.clear();

	RENDERER.setClearColor( 0.0, 1.0, 0.0, 1.0 );
	RENDERER.clearRenderTarget( rt );
	RENDERER.render( mesh2, CAMERA, rt );

	// RENDERER.render( mesh, CAMERA );
	RENDERER.render( mesh2, CAMERA );

}

window.addEventListener( 'resize', NYX.Util.debounce( event => {

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ASPECT_RATIO = WIDTH / HEIGHT;
	RENDERER.setViewport( WIDTH, HEIGHT );
	CAMERA.aspectRatio = ASPECT_RATIO;
	CAMERA.updateProjectionMatrix();

}, 50 ) );
