require( './nyx' );

var $ = require( './engine' );
var PerspectiveCamera = require( './Camera/PerspectiveCamera' );
var OrbitCtrl = require( './Camera/Ctrl/OrbitCtrl' );
var Texture = require( './Texture' );
var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );
var Util = require( './Util' );

$.start( {

	renderer: {
		alpha: true,
		premultipliedAlpha: false
	},

	assets: {
		images: {

			matcap: './assets/tex/mc_red.jpg',
			stone: './assets/tex/stone.jpg'

		},
		json: {

			skull: './assets/ext/skull.json'

		},
		shaders: {

			matcapVert: './assets/shaders/matcap.vert',
			matcapFrag: './assets/shaders/matcap.frag',
			textureExampleVert: './assets/shaders/textureExample.vert',
			textureExampleFrag: './assets/shaders/textureExample.frag'
			
		}
	}

}, setup, draw );

function setup( $ ) {

	console.log( '$', $ );
	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.aspectRatio = $.width / $.height;
	$.renderer.setViewport( $.width, $.height );
	deployCanvas();
	initCamera();
	createSkullMesh();
	createBoxMesh();

}

function initCamera() {

	$.camera = new PerspectiveCamera( Util.rad( 45 ), $.aspectRatio, 1, 10000 );
	OrbitCtrl( $.renderer.canvas, $.camera );

}

function createSkullMesh() {

	var matcapTexture = new Texture.ImageTexture( { data: $.assets.images.matcap.data } );
	var geom = new BufferGeometry();
	var shader = new Shader( {
		vs: $.assets.shaders.matcapVert.data,
		fs: $.assets.shaders.matcapFrag.data,
		uniforms: {
			uMatcap: { type: 't', value: matcapTexture }
		}
	} );

	var skullData = $.assets.json.skull.data;
	var vpos = ndarray( new Float32Array( skullData.vertices ), [ skullData.vertices.length / 3, 3 ] );
	var vidx = ndarray( new Uint32Array( skullData.faces ), [ skullData.faces.length, 1 ] );

	geom.addAttribute( 'position', vpos.data, vpos.shape );
	geom.addAttribute( 'index', vidx.data, vidx.shape );
	geom.computeVertexNormals();

	$.mesh_skull = new Mesh( geom, shader );
	$.mesh_skull.position[0] = 1.0;
	$.mesh_skull.updateModelMatrix();

}

function createBoxMesh() {

	var geom = new BufferGeometry();
	var vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] );
	var indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);
	var uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]);
	geom.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] );
	geom.addAttribute( 'index', indices, [ indices.length, 1 ] );
	geom.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] );

	// FBO RTT texture
		var dt = new Texture.DataTexture( 512 );
		var RenderTarget = require( './RenderTarget' );
		$.rt = new RenderTarget( dt );
	// image texture
		var tex = new Texture.ImageTexture( { data: $.assets.images.stone.data } );

	var shader = new Shader( {

		vs: $.assets.shaders.textureExampleVert.data,
		fs: $.assets.shaders.textureExampleFrag.data,
		uniforms: {
			uTexture: { type: 't', value: tex } // value: rt or tex
		}

	} );
	$.box = new Mesh( geom, shader );
	vec3.set( $.box.position, -3.0, 0.0, 0.0 );
	$.box.updateModelMatrix();

}

function draw( $ ) {

	$.renderer.setClearColor( 0.12, 0.12, 0.13, 1.0 );
	$.renderer.clear();
	$.renderer.render( $.mesh_skull, $.camera );
	$.renderer.render( $.box, $.camera );

}

window.addEventListener( 'resize', Util.debounce( () => {

	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.aspectRatio = $.width / $.height;
	$.renderer.canvas.width = $.width;
	$.renderer.canvas.height = $.height;
	$.renderer.setViewport( $.width, $.height );
	$.camera.aspectRatio = $.aspectRatio;
	$.camera.updateProjectionMatrix();

}, 100 ) );

function deployCanvas() {

	var cv = $.renderer.canvas;
	cv.style.position = 'absolute';
	cv.style.top = '0px';
	cv.style.left = '0px';
	document.body.appendChild( cv );

}
