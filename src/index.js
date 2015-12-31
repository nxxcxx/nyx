require( './nyx' );

var $ = require( './engine' );
var PerspectiveCamera = require( './Camera/PerspectiveCamera' );
var OrbitCtrl = require( './Camera/Ctrl/OrbitCtrl' );
var Texture = require( './Texture' );
var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );
var Util = require( './Util' );

// // test glslify
// var glsl = require( 'glslify' );
// var src = glsl( '../assets/shaders/matcap.frag' );
// console.log( src );

$.start( {

	renderer: {

		alpha: true,
		premultipliedAlpha: false

	},

	assets: {

		images: {

			matcap_red: './assets/tex/mc_deepskin.jpg',
			stone: './assets/tex/stone.jpg',
			noise256: './assets/tex/noise256.png',

			nx: './assets/skybox/nx.png',
			ny: './assets/skybox/ny.png',
			nz: './assets/skybox/nz.png',
			px: './assets/skybox/px.png',
			py: './assets/skybox/py.png',
			pz: './assets/skybox/pz.png'

		},

		json: {

			skull: './assets/ext/skull.json',
			ico: './assets/ext/ico.json'

		},

		shaders: {

			matcapVert: './assets/shaders/matcap.vert',
			matcapFrag: './assets/shaders/matcap.frag',
			textureExampleVert: './assets/shaders/textureExample.vert',
			textureExampleFrag: './assets/shaders/textureExample.frag',
			cubeMapVert: './assets/shaders/cubeMap.vert',
			cubeMapFrag: './assets/shaders/cubeMap.frag',

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
	createSkullMesh2();
	createBoxMesh();

	createCubeMap();

}

function initCamera() {

	$.camera = new PerspectiveCamera( Util.rad( 45 ), $.aspectRatio, 1, 10000 );
	OrbitCtrl( $.renderer.canvas, $.camera );

}

function createSkullMesh() {

	var matcapTexture = new Texture.ImageTexture( { data: $.assets.images.matcap_red.data } );
	var noiseTexture = new Texture.ImageTexture( { data: $.assets.images.noise256.data } );
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
	$.mesh_skull.updateModelMatrix();

}

function createSkullMesh2() {

	var skullData = $.assets.json.skull.data;
	var vpos = ndarray( new Float32Array( skullData.vertices ), [ skullData.vertices.length / 3, 3 ] );
	var vidx = ndarray( new Uint32Array( skullData.faces ), [ skullData.faces.length, 1 ] );

	var geom = new BufferGeometry();
	geom.addAttribute( 'position', vpos.data, vpos.shape );
	geom.addAttribute( 'index', vidx.data, vidx.shape );
	geom.computeVertexNormals();

	var shader = new Shader( { drawMode: 'LINES' } );

	$.mesh_skull2 = new Mesh( geom, shader );
	$.mesh_skull2.position[1] = 2.0;
	$.mesh_skull2.updateModelMatrix();

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
		// if using dataTexture as screen buffer, size need to be equal to screen size
		var dataTexture = new Texture.DataTexture( 1024 );
		var RenderTarget = require( './RenderTarget' );
		$.renderTarget = new RenderTarget( dataTexture );

	// image texture
		var stoneTexture = new Texture.ImageTexture( { data: $.assets.images.stone.data } );

	var shader = new Shader( {

		vs: $.assets.shaders.textureExampleVert.data,
		fs: $.assets.shaders.textureExampleFrag.data,
		uniforms: {

			uTexture: { type: 't', value: $.renderTarget } // value: renderTarget or Texture

		}

	} );

	$.sss = shader;

	$.box = new Mesh( geom, shader );
	vec3.set( $.box.position, -3.0, 2.0, 0.0 );
	$.box.updateModelMatrix();

}

function createCubeMap() {

	var cubeMap = new Texture.CubeMapTexture( { data: [

		$.assets.images.px.data,
		$.assets.images.nx.data,
		$.assets.images.ny.data,
		$.assets.images.py.data,
		$.assets.images.pz.data,
		$.assets.images.nz.data

	] } );

	var ico = $.assets.json.ico.data;
	var vpos = ndarray( new Float32Array( ico.vertices ), [ ico.vertices.length / 3, 3 ] );
	var vidx = ndarray( new Uint32Array( ico.faces ), [ ico.faces.length, 1 ] );

	var geom = new BufferGeometry();
	geom.addAttribute( 'position', vpos.data, vpos.shape );
	geom.addAttribute( 'index', vidx.data, vidx.shape );
	geom.computeVertexNormals();

	var shader = new Shader( {

		vs: $.assets.shaders.cubeMapVert.data,
		fs: $.assets.shaders.cubeMapFrag.data,
		uniforms: {
			uCubeMap: { type: 't', value: cubeMap }
		}

	} );

	$.ico = new Mesh( geom, shader );
	vec3.set( $.ico.position, -2.0, -1.0, 0.0 );
	// var s = 1000.0;
	// vec3.set( $.ico.scale, s, s, s );
	$.ico.updateModelMatrix();

}

function draw( $, time ) {

	$.renderer.setClearColor( 0.12, 0.12, 0.13, 1.0 );
	$.renderer.clear();

	$.renderer.setClearColor( 0.5, 0.5, 0.55, 1.0 );
	$.renderer.clearRenderTarget( $.renderTarget );
	$.renderer.render( $.mesh_skull, $.camera, $.renderTarget );

	$.renderer.render( $.mesh_skull, $.camera );
	$.renderer.render( $.mesh_skull2, $.camera );
	$.renderer.render( $.box, $.camera );
	$.renderer.render( $.ico, $.camera );

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
