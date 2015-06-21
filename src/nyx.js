'use strict';

global.gl_matrix = require( 'gl-matrix' );
global.vec3 = gl_matrix.vec3;
global.mat4 = gl_matrix.mat4;
global.quat = gl_matrix.quat;

global.vec3.new = function( x, y, z ) {
   return vec3.set( vec3.create(), x || 0, y || 0, z || 0 );
}

global.ndarray = require( 'ndarray' );

var NYX = {

   CONST: require( './constants' ),
   Renderer: require( './renderer' ),
   Camera: require( './camera' ),
   Mesh: require( './mesh' ),
   Geometry: require( './geometry' ),
   Shader: require( './shader' ),
   Util: require( './util' ),

   GL_Buffer: require( './GL-Buffer' ),
   GL_Program: require( './GL-Program' )

};

module.exports = NYX;
