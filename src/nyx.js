'use strict';

var glMatrix = require( 'gl-matrix' );
global.vec2 = glMatrix.vec2;
global.vec3 = glMatrix.vec3;
global.mat4 = glMatrix.mat4;
global.quat = glMatrix.quat;

global.vec2.new = function( x, y ) {
   return vec3.set( vec2.create(), x || 0, y || 0 );
};

global.vec3.new = function( x, y, z ) {
   return vec3.set( vec3.create(), x || 0, y || 0, z || 0 );
};

global.ndarray = require( 'ndarray' );


global.NYX = {

   CONST            : require( './Global/Constants' ),
   Renderer         : require( './Renderer/Renderer' ),
   PerspectiveCamera: require( './Camera/PerspectiveCamera' ),
   OrbitCtrl        : require( './Camera/Ctrl/OrbitCtrl'),
   Mesh             : require( './Mesh/Mesh' ),
   BufferGeometry   : require( './Geometry/BufferGeometry' ),
   Shader           : require( './Shader/Shader' ),
   Util             : require( './Util/Util' ),

   TestGeometry     : require( './Geometry/TestGeometry' ),
   Tex              : require( './Texture/Texture' ),

   AssetManager     : require( './Manager/AssetManager')

};

module.exports = NYX;
