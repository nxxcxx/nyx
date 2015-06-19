'use strict';

class Shader {

	constructor( opts ) {

		this.vertexShaderSrc = NYX.CONST.DEFAULT_VERTEX_SHADER;

      this.fragmentShaderSrc = NYX.CONST.DEFAULT_FRAGMENT_SHADER;

		this.attributes = {};
		this.uniforms = {};

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



	_enableVertexAttributes() {

	}

	_bindAttributesUniforms() {

	}

}

module.exports = Shader;
