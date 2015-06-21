'use strict';

/**
 * @param {String} type; shader type 'vs' or 'fs'
 * @param {String} src
 */
function createShader( gl, type, src ) {

   var shaderType;

   if ( type === 'vs' ) shaderType = gl.VERTEX_SHADER;
   else if ( type === 'fs') shaderType = gl.FRAGMENT_SHADER;

   var shader = gl.createShader( shaderType );
   gl.shaderSource( shader, src );
   gl.compileShader( shader );

   if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

      console.error( gl.getShaderInfoLog( shader ) );
      gl.deleteShader( shader );
      return null;

   }

   return shader;

}

/**
 * @param {WebGLShader}
 */
function createProgram( gl, shaders ) {

   var program = gl.createProgram();
   shaders.forEach( shader => gl.attachShader( program, shader ) );

   gl.linkProgram( program );

   if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {

      console.error( gl.getProgramInfoLog( program ) );
      gl.deleteProgram( program );
      return null;

   }

   return program;

}

module.exports = {

   createShader: createShader,
   createProgram: createProgram

}
