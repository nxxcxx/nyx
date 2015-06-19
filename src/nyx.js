'use strict';

var gl_matrix = global.gl_matrix = require( 'gl-matrix' );
global.vec3 = gl_matrix.vec3;
global.mat4 = gl_matrix.mat4;
global.quat = gl_matrix.quat;

global.vec3.new = function( x, y, z ) {
   return vec3.set( vec3.create(), x, y, z );
}

global.ndarray = require( 'ndarray' );

var NYX = {

   CONST: require( './constants.js' ),
   Renderer: require( './renderer.js' ),
   Camera: require( './camera.js' ),
   Mesh: require( './mesh.js' ),
   VertexBuffer: require( './vertexBuffer.js' ),
   Shader: require( './shader.js' ),
   Util: require( './util.js' )

};

module.exports = NYX;
