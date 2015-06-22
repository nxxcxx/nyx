'use strict';

var glMatrix = require( 'gl-matrix' );
global.vec3 = glMatrix.vec3;
global.mat4 = glMatrix.mat4;
global.quat = glMatrix.quat;

global.vec3.new = function( x, y, z ) {
   return vec3.set( vec3.create(), x || 0, y || 0, z || 0 );
}

global.ndarray = require( 'ndarray' );




var NYX = {

   CONST: require( './constants' ),
   Renderer: require( './renderer' ),
   Camera: require( './camera' ),
   Mesh: require( './mesh' ),
   BufferGeometry: require( './BufferGeometry' ),
   Shader: require( './shader' ),
   Util: require( './util' ),

   TestGeometry: require( './TestGeometry' ),

   GL_Buffer: require( './GL-Buffer' ),
   GL_Program: require( './GL-Program' ),

   OBJLoader: require( './OBJLoader' )

};

module.exports = NYX;
