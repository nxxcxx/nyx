'use strict';

class Shader {

	constructor( opts ) {

		this.vertexShaderSrc = [

         'precision highp float;',
         'attribute vec3 vertexPosition;',
         'uniform mat4 modelMatrix;',
         'uniform mat4 viewMatrix;',
         'uniform mat4 projectionMatrix;',
         'varying vec3 vPosition;',
         'void main() {',
         '  vPosition = vertexPosition;',
         '  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( vertexPosition, 1.0 );',
         '}'

      ].join( '\n' );

      this.fragmentShaderSrc = [

         'precision highp float;',
         'varying vec3 vPosition;',
         'void main() {',
         '  vec3 color = vPosition * 0.5 + vec3( 0.5 );',
         '  gl_FragColor = vec4( color, 1.0 );',
         '}'

      ].join( '\n' );

	}

   _initShaders( gl ) {

      var vertexShader = gl.createShader( gl.VERTEX_SHADER );
      gl.shaderSource( vertexShader, this.vertexShaderSrc );
      gl.compileShader( vertexShader );

      if ( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ) {
      	console.error( gl.getShaderInfoLog( vertexShader ) );
      }

      var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
      gl.shaderSource( fragmentShader, this.fragmentShaderSrc );
      gl.compileShader( fragmentShader );

      if ( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ) {
      	console.error( gl.getShaderInfoLog( fragmentShader ) );
      }

      this._program = gl.createProgram();
      gl.attachShader( this._program, vertexShader );
      gl.attachShader( this._program, fragmentShader );
      gl.linkProgram( this._program );

   }

}

module.exports = Shader;
