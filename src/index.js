'use strict';

global.NYX = require( './nyx' );

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT_RATIO = WIDTH / HEIGHT;

var MOUSE_X = 0;
var MOUSE_Y = 0;
var MOUSE_HOLD = false;
var PREV_MOUSE_X = 0;
var PREV_MOUSE_Y = 0;
var ANGLE_X = Math.PI * 0.5;
var ANGLE_Y = 0;
var TMP_ANGLE_X = 0;
var TMP_ANGLE_Y = 0;
var DX = 0;
var DY = 0;
var CAM_DIST = 10.0;

global.RENDERER = new NYX.Renderer( {} );
global.gl = RENDERER.gl;

global.canvas = RENDERER.canvas;
canvas.style.position = 'absolute';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.style.margin = '0px';
document.body.appendChild( canvas );


RENDERER.setViewport( WIDTH, HEIGHT );
RENDERER.setClearColor( 0.12, 0.12, 0.13, 1.0 );
RENDERER.clear();

global.CAMERA = new NYX.Camera( NYX.Util.rad( 45 ), ASPECT_RATIO, 1, 10000 );
vec3.set( CAMERA.position, 0.0, 0.0, 10.0 );
CAMERA.updateViewMatrix();

var vertexBuffer = new NYX.TestGeometry();
var shader = new NYX.Shader();
global.mesh = new NYX.Mesh( vertexBuffer, shader );


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

      mesh2.drawMode = NYX.CONST.LINES;

   }
}
req.open( 'GET', './ext/skull-high.json' );
req.send();




( function run( time ) {

   // todo: face melt shader

   requestAnimationFrame( run );
   // todo: only update camera when needed
   ctrlCamera( CAMERA, MOUSE_X, MOUSE_Y );

   RENDERER.clear();
   // todo: fix attribute problem not enable correctly for current mesh
   // todo: webgl current state manager
   RENDERER.render( mesh, CAMERA );
   if ( mesh2 ) RENDERER.render( mesh2, CAMERA );

} )();

function ctrlCamera( cam, mx, my ) {

   // control camera using spherical coordinate
   // var phi = (-ANGLE_Y + 0.5)  * Math.PI;

   var theta = ANGLE_X;
   var phi = ANGLE_Y;

   var t = CAM_DIST * Math.cos( phi );
   var y = CAM_DIST * Math.sin( phi );

   var x = t * Math.cos( theta );
   var z = t * Math.sin( theta );

   vec3.set( cam.position, x, y, z );
   vec3.set( cam.lookAt, 0.0, 0.0, 0.0 );
   vec3.set( cam.upVector, 0.0, 1.0, 0.0 );
   cam.updateViewMatrix();

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

window.addEventListener( 'mousemove', event => {

   MOUSE_X = event.x / WIDTH;
   MOUSE_Y = event.y / HEIGHT;

   if ( MOUSE_HOLD ) {

      var gain = 5.0;
      DX = gain * ( MOUSE_X - PREV_MOUSE_X );
      DY = gain * ( MOUSE_Y - PREV_MOUSE_Y );
      ANGLE_X = TMP_ANGLE_X + DX;
      ANGLE_Y = TMP_ANGLE_Y + DY;
      ANGLE_Y = clamp( ANGLE_Y, -Math.PI * 0.5 , Math.PI * 0.5 );

   }



} );

window.addEventListener( 'mousedown', event => {

   MOUSE_HOLD = true;
   PREV_MOUSE_X = event.x / WIDTH;
   PREV_MOUSE_Y = event.y / HEIGHT;
   TMP_ANGLE_X = ANGLE_X;
   TMP_ANGLE_Y = ANGLE_Y;

} );


window.addEventListener( 'mouseup', event => {

   MOUSE_HOLD = false;

} );

window.addEventListener( 'mousewheel', event => {

   var dt = event.wheelDelta;
   CAM_DIST -= dt * 0.01;
   CAM_DIST = clamp( CAM_DIST, 1, 50 );

} );

function clamp( x, min, max ) {
  return Math.min( Math.max( x, min ), max );
};
