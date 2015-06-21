'use strict';

class Shader {

	constructor( opts ) {

		this._program = null;

		this.vertexShaderSrc = NYX.CONST.DEFAULT_VERTEX_SHADER;
      this.fragmentShaderSrc = NYX.CONST.DEFAULT_FRAGMENT_SHADER;

		this.uniforms = {
			projectionMatrix: { type: 'm4', value: null },
			viewMatrix:       { type: 'm4', value: null },
			modelMatrix:      { type: 'm4', value: null}
		}

	}

}

module.exports = Shader;
