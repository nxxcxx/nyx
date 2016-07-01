var $ = require( './shell' );
var PerspectiveCamera = require( './Camera/PerspectiveCamera' );
var OrbitCtrl = require( './Camera/Ctrl/OrbitCtrl' );
var Texture = require( './Texture' );
var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );

// TODO replace AssetManager w/ webpack loader
// webpack raw loader console.log( require( 'raw!root/assets/shaders/matcap.frag' ) )

$( {
	assets: {
		images: {
			matcap: './assets/tex/mc_deepskin.jpg'
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

function initCamera( $ ) {
	$.camera = new PerspectiveCamera( 45 * Math.PI / 180.0, $.aspectRatio, 1, 10000 );
	OrbitCtrl( $.renderer.canvas, $.camera );
}

function createSkullMesh( $ ) {
	var matcapTexture = new Texture.ImageTexture( { data: $.assets.images.matcap.data } );
	var shader = new Shader( {
		vs: $.assets.shaders.matcapVert.data,
		fs: $.assets.shaders.matcapFrag.data,
		uniforms: {
			uMatcap: { type: 't', value: matcapTexture }
		}
	} );
	var geom = new BufferGeometry();
	var skullData = $.assets.json.skull.data;
	geom.addAttribute( 'position', new Float32Array( skullData.vertices ), [ skullData.vertices.length / 3, 3 ], true );
	geom.addAttribute( 'index', new Uint32Array( skullData.faces ), [ skullData.faces.length, 1 ] );
	geom.computeVertexNormals();
	$.mesh_skull = new Mesh( geom, shader );
}

function setup( $ ) {
	$.width = window.innerWidth;
	$.height = window.innerHeight;
	$.aspectRatio = $.width / $.height;
	$.renderer.setViewport( $.width, $.height );
	deployCanvas( $ );
	initCamera( $ );
	createSkullMesh( $ );
}

function draw( $ ) {
	$.renderer.setClearColor( 0.12, 0.12, 0.13, 1.0 );
	$.renderer.clear();
	$.renderer.render( $.mesh_skull, $.camera );
}

function deployCanvas( $ ) {
	var cv = $.renderer.canvas;
	document.body.appendChild( cv );
	window.addEventListener( 'resize', require( 'src/Util/debounce' )( () => {
		$.width = window.innerWidth;
		$.height = window.innerHeight;
		$.aspectRatio = $.width / $.height;
		$.renderer.canvas.width = $.width;
		$.renderer.canvas.height = $.height;
		$.renderer.setViewport( $.width, $.height );
		$.camera.aspectRatio = $.aspectRatio;
		$.camera.updateProjectionMatrix();
	}, 100 ) );
}
