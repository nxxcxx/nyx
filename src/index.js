require( './nyx' );

var engine = require( './engine' );

engine.start( {

	assets: {
		images: {
			matcap: './assets/tex/mc_red.jpg'
		},
		json: {
			skull: './assets/ext/skull.json'
		},
		shaders: {
			matcapVert: './assets/shaders/matcap.vert',
			matcapFrag: './assets/shaders/matcap.frag'
		}
	}

}, setup, draw );


var PerspectiveCamera = require( './Camera/PerspectiveCamera' );
var OrbitCtrl = require( './Camera/Ctrl/OrbitCtrl' );
var Texture = require( './Texture' );
var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );
var Util = require( './Util' );

function setup( $ ) {

	console.log( 'setup', $ );

	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.aspectRatio = $.width / $.height;

	appendCanvasToBody( $ );
	$.renderer.setViewport( $.width, $.height );

	setupCamera();

	createSkullMesh();

}

function setupCamera() {

	var $ = engine;
	$.camera = new PerspectiveCamera( Util.rad( 45 ), $.aspectRatio, 1, 10000 );
	OrbitCtrl( $.renderer.canvas, $.camera );

}

function createSkullMesh() {

	var $ = engine;
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

}

function draw( $ ) {

	$.renderer.setClearColor( 0.12, 0.12, 0.13, 1.0 );
   $.renderer.clear();
   $.renderer.render( $.mesh_skull, $.camera );

}

function appendCanvasToBody( $ ) {

	var cv = $.renderer.canvas;
   cv.style.position = 'absolute';
   cv.style.top = '0px';
   cv.style.left = '0px';
   document.body.appendChild( cv );

}

window.addEventListener( 'resize', Util.debounce( () => {

	var $ = engine;
	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.aspectRatio = $.width / $.height;
	$.renderer.canvas.width = $.width;
	$.renderer.canvas.height = $.height;
	$.renderer.setViewport( $.width, $.height );
	$.camera.aspectRatio = $.aspectRatio;
	$.camera.updateProjectionMatrix();

}, 100 ) );
