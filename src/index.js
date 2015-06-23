/* jshint -W117 */
'use strict';

require( './nyx' );

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT_RATIO = WIDTH / HEIGHT;


global.RENDERER = new NYX.Renderer( {} );
global.gl = RENDERER.gl;

( function createCanvas() {

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
CAMERA.updateViewMatrix();

// Mesh
var vertexBuffer = new NYX.TestGeometry();
var shader = new NYX.Shader();
global.mesh = new NYX.Mesh( vertexBuffer, shader );

// Mesh2
var mesh2 = global.mesh2;
var req = new XMLHttpRequest();
req.onreadystatechange = function() {

   if ( req.readyState == 4 && req.status == 200 ) {

      var res = JSON.parse( req.responseText );

      var vb = new NYX.BufferGeometry();
      var sh = new NYX.Shader();
      mesh2 = new NYX.Mesh( vb, sh );

      vec3.set( mesh2.scale, 0.5, 0.5, 0.5 );
      vec3.set( mesh2.position, -2.5, 0.0, 0.0 );
      mesh2.updateModelMatrix();

      var vpos = ndarray( new Float32Array( res.vertices ), [ res.vertices.length / 3, 3 ] );
      var vidx = ndarray( new Uint32Array( res.faces ), [ res.faces.length, 1 ] );

      mesh2.geometry.addAttribute( 'position', vpos.data, vpos.shape );
      mesh2.geometry.addAttribute( 'index', vidx.data, vidx.shape );

   }
}
req.open( 'GET', './ext/skull-high.json' );
req.send();



( function run( time ) {

   // todo: face melt shader

   requestAnimationFrame( run );

   RENDERER.clear();

   RENDERER.render( mesh, CAMERA );
   if ( mesh2 ) RENDERER.render( mesh2, CAMERA );

} )();

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
