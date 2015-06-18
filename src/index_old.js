'use strict';

require( './parts.js' );

var gl_matrix = require( 'gl-matrix' );
var mat4 = gl_matrix.mat4;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// add canvas to DOM
var canvas = global.canvas = document.createElement( 'canvas' );
canvas.style.position = 'absolute';
canvas.style.top = '0px';
canvas.style.left = '0px';
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild( canvas );

var body = document.body;
body.style.margin = '0px';

var gl = global.gl = canvas.getContext( 'webgl' );
if ( !gl ) throw new Error( 'WebGL not supported' );

gl.viewport( 0.0, 0.0, WIDTH, HEIGHT );




var vertexBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
var verts = [
    .5, .5, 0.0,
   -.5, .5, 0.0,
    .5, -.5, 0.0,
   -.5, -.5, 0.0
];
gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( verts ), gl.STATIC_DRAW );

var square = {
	buffer: vertexBuffer,
	vertSize: 3,
	nVerts: 4,
	primtype: gl.TRIANGLE_STRIP
};

var modelMatrix = mat4.create();
mat4.translate( modelMatrix, modelMatrix, [ 0, 0, -3.0 ] );

var projectionMatrix = mat4.create();
mat4.perspective( projectionMatrix, Math.PI / 4, WIDTH / HEIGHT, 1, 10000 );




var vertexShaderSrc = [

   'attribute vec3 vertexPosition;',
   'uniform mat4 modelMatrix;',
   'uniform mat4 projectionMatrix;',
   'void main() {',
   '  gl_Position = projectionMatrix * modelMatrix * vec4( vertexPosition, 1.0 );',
   '}'

].join( '\n' );

var fragmentShaderSrc = [

   'void main() {',
   '  gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );',
   '}'

].join( '\n' );

var vertexShader = gl.createShader( gl.VERTEX_SHADER );
gl.shaderSource( vertexShader, vertexShaderSrc );
gl.compileShader( vertexShader );

if ( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ) {
	console.error( gl.getShaderInfoLog( vertexShader ) );
}

var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
gl.shaderSource( fragmentShader, fragmentShaderSrc );
gl.compileShader( fragmentShader );

if ( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ) {
	console.error( gl.getShaderInfoLog( fragmentShader ) );
}

var shaderProgram = gl.createProgram();
gl.attachShader( shaderProgram, vertexShader );
gl.attachShader( shaderProgram, fragmentShader );
gl.linkProgram( shaderProgram );

var shaderVertexPositionAttribute = gl.getAttribLocation( shaderProgram, 'vertexPosition' );
gl.enableVertexAttribArray( shaderVertexPositionAttribute );

var shaderProjectionMatrixUniform = gl.getUniformLocation( shaderProgram, 'projectionMatrix' );
var shaderModelViewMatrixUniform = gl.getUniformLocation( shaderProgram, 'modelMatrix' );


if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
	console.error( 'Could not initialise shaders' );
}




gl.clearColor( 0.12, 0.12, 0.13, 1.0 );
gl.clear( gl.COLOR_BUFFER_BIT );

gl.bindBuffer( gl.ARRAY_BUFFER, square.buffer );

gl.useProgram( shaderProgram );

gl.vertexAttribPointer( shaderVertexPositionAttribute, square.vertSize, gl.FLOAT, false, 0, 0 );
gl.uniformMatrix4fv( shaderProjectionMatrixUniform, false, projectionMatrix );
gl.uniformMatrix4fv( shaderModelViewMatrixUniform, false, modelMatrix );

gl.drawArrays( square.primtype, 0, square.nVerts );
