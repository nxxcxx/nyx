'use strict';

var gl_matrix = require( 'gl-matrix' );
var vec3 = gl_matrix.vec3;

var NYX = global.NYX = require( './nyx.js' );

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var ASPECT_RATIO = WIDTH / HEIGHT;

var MOUSE_X = 0;
var MOUSE_Y = 0;

var RENDERER = global.RENDERER = new NYX.Renderer( {} );
global.ctx = RENDERER.context;

var canvas = RENDERER.canvas;
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

var CAMERA = global.CAMERA = new NYX.Camera( NYX.Util.rad( 75 ), ASPECT_RATIO, 1, 10000 );
vec3.set( CAMERA.position, 0.0, 0.0, 5.0 );
CAMERA.updateViewMatrix();

var vertexBuffer = new NYX.VertexBuffer();
var shader = new NYX.Shader();
var mesh = new NYX.Mesh( vertexBuffer, shader );

   var transformMatrix = mat4.create();
   var qu = quat.create();
   quat.setAxisAngle( qu, vec3.new( 0.0, 0.0, 1.0 ), Math.PI * 0.25 ) ;
   mat4.fromQuat( transformMatrix, qu );
   vertexBuffer.applyMatrix( transformMatrix );


var vertexBuffer2 = new NYX.VertexBuffer();
var mesh2 = new NYX.Mesh( vertexBuffer2, shader );

   var transformMatrix = mat4.create();
   mat4.translate( transformMatrix, transformMatrix, vec3.new( 5.0, 0.0, 0.0 ) );
   vertexBuffer2.applyMatrix( transformMatrix );


var frameCount = 0;

( function run( time ) {

   requestAnimationFrame( run );

   var r = 8.0;
   var theta = MOUSE_X * Math.PI * 2.0;
   vec3.set( CAMERA.position, r * Math.cos( theta ), 0.0, r * Math.sin( theta ) );
   vec3.set( CAMERA.lookAt, 0.0, 0.0, 0.0 );
   vec3.set( CAMERA.upVector, 0.0, 1.0, 0.0 );
   CAMERA.updateViewMatrix();

   RENDERER.clear();
   RENDERER.renderMesh( mesh, CAMERA );
   RENDERER.renderMesh( mesh2, CAMERA );

} )();


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

   MOUSE_X = event.x / WIDTH * 2.0 - 1.0;
   MOUSE_Y = event.y / HEIGHT * 2.0 - 1.0;

} );
