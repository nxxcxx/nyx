'use strict';

class Shader {

	constructor( opts ) {

		this._program = null;

		opts = opts || {};

		this.vertexShaderSrc   = opts.vs || NYX.CONST.DEFAULT_VERTEX_SHADER;
      this.fragmentShaderSrc = opts.fs || NYX.CONST.DEFAULT_FRAGMENT_SHADER;
		this.drawMode          = opts.drawMode === undefined ? NYX.CONST.TRIANGLES : opts.drawMode;

		this.depthTest         = null;
		this.blenEquation      = null;
		this.blendFunc         = null;
		this.culling           = null;
		this.cullside          = null;

		// built-in uniforms
		this.uniforms = {
			projectionMatrix: { type: 'm4', value: null },
			viewMatrix: { type: 'm4', value: null },
			modelMatrix: { type: 'm4', value: null }
		};

		// append user uniforms
		Object.keys( opts.uniforms || {} ).forEach( name => {

			this.uniforms[ name ] = opts.uniforms[ name ];

		} );

	}

}

module.exports = Shader;
