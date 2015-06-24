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
CAMERA.updateViewMatrix();

// Mesh


var mesh;
// Texture test
NYX.Tex.loadImage( './tex/stone.jpg', img => {

   var geom = new NYX.BufferGeometry();
   var shader = new NYX.Shader();
   mesh = global.mesh = new NYX.Mesh( geom, shader );

   var vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] );
   var indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);
   var uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]);

   geom.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] );
   geom.addAttribute( 'index', indices, [ indices.length, 1 ] );
   geom.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] );

   var tex = NYX.Tex.createTexture( gl, img );

   shader.uniforms.uTexture = { type: 't', value: tex };

} );



// Mesh2
   var mesh2 = global.mesh2;
   var req = new XMLHttpRequest();
   req.onreadystatechange = () => {

      if ( req.readyState === 4 && req.status === 200 ) {

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

   };

   req.open( 'GET', './ext/skull-high.json' );
   req.send();
//


( function run( time ) {

   requestAnimationFrame( run );

   RENDERER.clear();

   if ( mesh ) RENDERER.render( mesh, CAMERA );
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
