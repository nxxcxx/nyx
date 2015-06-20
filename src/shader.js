'use strict';

class Shader {

	constructor( opts ) {

		this.vertexShaderSrc = NYX.CONST.DEFAULT_VERTEX_SHADER;
      this.fragmentShaderSrc = NYX.CONST.DEFAULT_FRAGMENT_SHADER;

		this.attributes = {};
		this.uniforms = {};

		this._program = null;

	}

}

module.exports = Shader;
