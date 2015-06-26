/* jshint -W117 */
'use strict';

require( './nyx' );

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT_RATIO = WIDTH / HEIGHT;

global.RENDERER = new NYX.Renderer( {} );
global.gl = RENDERER.gl;

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
RENDERER.setClearColor( 0.12, 0.12, 0.13, 1.0 );
RENDERER.clear();

global.CAMERA = new NYX.PerspectiveCamera( NYX.Util.rad( 45 ), ASPECT_RATIO, 1, 10000 );
NYX.OrbitCtrl( canvas, CAMERA );

// OrthographicCamera Test
// global.CAMERA = new NYX.OrthographicCamera( -1, 1, -1, 1, 1, 10 );
// vec3.set( CAMERA.position, 0, 0, -5 );
// CAMERA.updateViewMatrix();

NYX.AssetManager.fetch( {

   images: {
      stone: './assets/tex/stone.jpg'
   },
   json: {
      skull: './assets/ext/skull-high.json'
   },
   shaders: {
      textureExampleVert: './assets/shaders/textureExample.vert',
      textureExampleFrag: './assets/shaders/textureExample.frag',
      normalExampleVert: './assets/shaders/normalExample.vert',
      normalExampleFrag: './assets/shaders/normalExample.frag'
   }

}, assets => {

   global.ASSETS = assets;
   console.log( 'Assets:', ASSETS );
   main();
   run();

} );

function main() {

   // Mesh - texture test
      var geom = new NYX.BufferGeometry();
      var shader = new NYX.Shader( {

         vs: ASSETS.shaders.textureExampleVert.data,
         fs: ASSETS.shaders.textureExampleFrag.data

      } );
      global.mesh = new NYX.Mesh( geom, shader );

      var vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] );
      var indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);
      var uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]);

      geom.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] );
      geom.addAttribute( 'index', indices, [ indices.length, 1 ] );
      geom.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] );

      shader.uniforms.uTexture = { type: 't', value: ASSETS.images.stone.data };

   // Mesh2 - json & normal test

      var geom = new NYX.BufferGeometry();
      var shader = new NYX.Shader( {

         vs: ASSETS.shaders.normalExampleVert.data,
         fs: ASSETS.shaders.normalExampleFrag.data

      } );

      global.mesh2 = new NYX.Mesh( geom, shader );
      vec3.set( mesh2.scale, 0.5, 0.5, 0.5 );
      vec3.set( mesh2.position, -2.5, 0.0, 0.0 );
      mesh2.updateModelMatrix();

      var res = ASSETS.json.skull.data;
      var vpos = ndarray( new Float32Array( res.vertices ), [ res.vertices.length / 3, 3 ] );
      var vidx = ndarray( new Uint32Array( res.faces ), [ res.faces.length, 1 ] );

      geom.addAttribute( 'position', vpos.data, vpos.shape );
      geom.addAttribute( 'index', vidx.data, vidx.shape );

      geom.computeVertexNormals();
}


function run( time ) {

   requestAnimationFrame( run );

   RENDERER.clear();

   RENDERER.render( mesh, CAMERA );
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

}, 50) );
