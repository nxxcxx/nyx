
let $ = require( 'src/shell' )
let PerspectiveCamera = require( 'src/Camera/PerspectiveCamera' )
let OrbitCtrl = require( 'src/Camera/Ctrl/OrbitCtrl' )
let Texture = require( 'src/Texture' )
let BufferGeometry = require( 'src/BufferGeometry' )
let Shader = require( 'src/Shader' )
let Mesh = require( 'src/Mesh' )
let vec3 = require( 'src/Math/vec3' )
let ndarray = require( 'ndarray' )

// TODO replace AssetManager w/ webpack loader
// using webpack raw loader
// console.log( require( 'raw!root/assets/shaders/matcap.frag' ) )

$( {

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
			pz: './assets/skybox/pz.png',

			duck: './assets/glTF/duck/duckCM.png',
			cesium: './assets/glTF/cesiumMan/cesium_Man.jpg'

		},

		json: {

			skull: './assets/ext/skull.json',
			ico: './assets/ext/ico.json',

			box: './assets/glTF/box/box.gltf',
			duck: './assets/glTF/duck/duck.gltf',
			invoker: './assets/glTF/invoker/invoker.gltf',
			cesium: './assets/glTF/cesiumMan/Cesium_Man.gltf',
			monster: './assets/glTF/monster/monster.gltf'

		},

		binary: {

			box: './assets/glTF/box/box.bin',
			duck: './assets/glTF/duck/duck.bin',
			invoker: './assets/glTF/invoker/invoker.bin',
			cesium: './assets/glTF/cesiumMan/Cesium_Man.bin',
			monster: './assets/glTF/monster/monster.bin'

		},

		shaders: {

			matcapVert: './assets/shaders/matcap.vert',
			matcapFrag: './assets/shaders/matcap.frag',
			textureExampleVert: './assets/shaders/textureExample.vert',
			textureExampleFrag: './assets/shaders/textureExample.frag',
			normalVert: './assets/shaders/normalExample.vert',
			normalFrag: './assets/shaders/normalExample.frag',
			cubeMapVert: './assets/shaders/cubeMap.vert',
			cubeMapFrag: './assets/shaders/cubeMap.frag',
			cesiumVert: './assets/glTF/cesiumMan/cesium.vert',
			cesiumFrag: './assets/glTF/cesiumMan/cesium.frag'

		}

	}

}, setup, draw )

function setup( $ ) {

	$.width = window.innerWidth
	$.height = window.innerHeight
	$.aspectRatio = $.width / $.height
	$.renderer.setViewport( $.width, $.height )
	deployCanvas( $ )
	initCamera( $ )
	createSkullMesh( $ )
	createSkullMesh2( $ )
	createBoxMesh( $ )
	createCubeMap( $ )

}

function initCamera( $ ) {

	$.camera = new PerspectiveCamera( 45 * Math.PI / 180.0, $.aspectRatio, 1, 10000 )
	OrbitCtrl( $.renderer.canvas, $.camera )

}

function createSkullMesh( $ ) {

	let matcapTexture = new Texture.ImageTexture( { data: $.assets.images.matcap_red.data } )
	let noiseTexture = new Texture.ImageTexture( { data: $.assets.images.noise256.data } )
	let shader = new Shader( {
		vs: $.assets.shaders.matcapVert.data,
		fs: $.assets.shaders.matcapFrag.data,

		uniforms: {

			uMatcap: { type: 't', value: matcapTexture }

		}

	} )

	let geom = new BufferGeometry()
	let skullData = $.assets.json.skull.data
	geom.addAttribute( 'position', new Float32Array( skullData.vertices ), [ skullData.vertices.length / 3, 3 ], true )
	geom.addAttribute( 'index', new Uint32Array( skullData.faces ), [ skullData.faces.length, 1 ] )
	geom.computeVertexNormals()

	$.mesh_skull = new Mesh( geom, shader )

}

function createSkullMesh2( $ ) {


	let geom = new BufferGeometry()
	let skullData = $.assets.json.skull.data
	geom.addAttribute( 'position', new Float32Array( skullData.vertices ), [ skullData.vertices.length / 3, 3 ], true )
	geom.addAttribute( 'index', new Uint32Array( skullData.faces ), [ skullData.faces.length, 1 ] )
	geom.computeVertexNormals()

	let shader = new Shader( { drawMode: 'LINES' } )

	$.mesh_skull2 = new Mesh( geom, shader )
	$.mesh_skull2.position[1] = 2.0
	$.mesh_skull2.updateModelMatrix()

}

function createBoxMesh( $ ) {

	let geom = new BufferGeometry()
	let vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] )
	let indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23])
	let uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1])
	geom.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] )
	geom.addAttribute( 'index', indices, [ indices.length, 1 ] )
	geom.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] )

	// FBO RTT texture
		// if using dataTexture as screen buffer, size need to be equal to screen size
		let dataTexture = new Texture.DataTexture( 1024 )
		let RenderTarget = require( 'src/RenderTarget' )
		$.renderTarget = new RenderTarget( dataTexture )

	// image texture
		let stoneTexture = new Texture.ImageTexture( { data: $.assets.images.stone.data } )

	let shader = new Shader( {

		vs: $.assets.shaders.textureExampleVert.data,
		fs: $.assets.shaders.textureExampleFrag.data,
		uniforms: {

			uTexture: { type: 't', value: $.renderTarget } // value: renderTarget or Texture

		}

	} )

	$.box = new Mesh( geom, shader )
	vec3.set( $.box.position, -3.0, 2.0, 0.0 )
	$.box.updateModelMatrix()

}

function createCubeMap( $ ) {

	let cubeMap = new Texture.CubeMapTexture( { data: [

		$.assets.images.px.data,
		$.assets.images.nx.data,
		$.assets.images.ny.data,
		$.assets.images.py.data,
		$.assets.images.pz.data,
		$.assets.images.nz.data

	] } )

	let ico = $.assets.json.ico.data
	let vpos = ndarray( new Float32Array( ico.vertices ), [ ico.vertices.length / 3, 3 ] )
	let vidx = ndarray( new Uint32Array( ico.faces ), [ ico.faces.length, 1 ] )

	let geom = new BufferGeometry()
	geom.addAttribute( 'position', vpos.data, vpos.shape )
	geom.addAttribute( 'index', vidx.data, vidx.shape )
	geom.computeVertexNormals()

	let shader = new Shader( {

		vs: $.assets.shaders.cubeMapVert.data,
		fs: $.assets.shaders.cubeMapFrag.data,
		uniforms: {
			uCubeMap: { type: 't', value: cubeMap }
		}

	} )

	$.ico = new Mesh( geom, shader )
	vec3.set( $.ico.position, -2.0, -1.0, 0.0 )
	// let s = 1000.0
	// vec3.set( $.ico.scale, s, s, s )
	$.ico.updateModelMatrix()

}


function draw( $, time ) {

	$.renderer.setClearColor( 0.12, 0.12, 0.13, 1.0 )
	$.renderer.clear()

	$.renderer.setClearColor( 0.5, 0.5, 0.55, 1.0 )
	$.renderer.clearRenderTarget( $.renderTarget )
	$.renderer.render( $.mesh_skull, $.camera, $.renderTarget )

	for ( let i = 0; i < $.mesh_skull.geometry.attributes.position.data.length; i ++ ) {
		$.mesh_skull.geometry.attributes.position.data[ i ] += ( Math.random() - 0.5 ) * 0.01
	}

	$.renderer.render( $.mesh_skull, $.camera )
	$.renderer.render( $.mesh_skull2, $.camera )
	$.renderer.render( $.box, $.camera )
	$.renderer.render( $.ico, $.camera )

}

function deployCanvas( $ ) {

	let cv = $.renderer.canvas
	document.body.appendChild( cv )

	window.addEventListener( 'resize', require( 'src/Util/debounce' )( () => {

		$.width = window.innerWidth
		$.height = window.innerHeight
		$.aspectRatio = $.width / $.height
		$.renderer.canvas.width = $.width
		$.renderer.canvas.height = $.height
		$.renderer.setViewport( $.width, $.height )
		$.camera.aspectRatio = $.aspectRatio
		$.camera.updateProjectionMatrix()

	}, 100 ) )

}
