'use strict';

var NYX = global.NYX = require( './nyx.js' );

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT_RATIO = WIDTH / HEIGHT;

var MOUSE_X = 0;
var MOUSE_Y = 0;

var RENDERER = global.RENDERER = new NYX.Renderer( {} );
global.ctx = RENDERER.context;

var canvas = global.canvas = RENDERER.canvas;
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

var CAMERA = global.CAMERA = new NYX.Camera( NYX.Util.rad( 45 ), ASPECT_RATIO, 1, 10000 );
vec3.set( CAMERA.position, 0.0, 0.0, 10.0 );
CAMERA.updateViewMatrix();

var vertexBuffer = new NYX.Geometry();
var shader = new NYX.Shader();
var mesh = global.mesh = new NYX.Mesh( vertexBuffer, shader );


( function run( time ) {

   requestAnimationFrame( run );

   ctrlCamera( CAMERA, MOUSE_X, MOUSE_Y );

   RENDERER.clear();
   RENDERER.render( mesh, CAMERA );

} )();

function ctrlCamera( cam, mx, my ) {

   // control camera using spherical coordinate
   var r = 10.0;
   var theta = -mx * Math.PI * 2.0;
   var phi = (-my + 0.5)  * Math.PI;

   var t = r * Math.cos( phi );
   var y = r * Math.sin( phi );

   var x = t * Math.cos( theta );
   var z = t * Math.sin( theta );

   vec3.set( cam.position, x, y, z );
   vec3.set( cam.lookAt, 0.0, 0.0, 0.0 );
   vec3.set( cam.upVector, 0.0, 1.0, 0.0 );
   cam.updateViewMatrix();

}

window.addEventListener( 'resize', NYX.Util.debounce( function ( event ) {

   WIDTH = window.innerWidth;
   HEIGHT = window.innerHeight;
   canvas.width = WIDTH;
   canvas.height = HEIGHT;
   ASPECT_RATIO = WIDTH / HEIGHT;
   RENDERER.setViewport( WIDTH, HEIGHT );
   CAMERA.aspectRatio = ASPECT_RATIO;
   CAMERA.updateProjectionMatrix();

}, 50) );

window.addEventListener( 'mousemove', function ( event ) {

   MOUSE_X = event.x / WIDTH;
   MOUSE_Y = event.y / HEIGHT;

} );
