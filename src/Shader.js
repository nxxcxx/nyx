'use strict';

const DEFAULT_SHADER = {

	VERTEX:
		`
		precision highp float;

		attribute vec3 position;
		attribute vec3 normal;

		uniform vec3 camera;
		uniform mat4 modelMatrix;
		uniform mat4 viewMatrix;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		void main() {

			gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

		}

		`,

	FRAGMENT:
		`
		precision highp float;

		uniform vec3 camera;

		void main() {

			vec3 color = vec3( 1.0, 1.0, 1.0 );
			gl_FragColor = vec4( color, 1.0 );

		}

		`,

};

class Shader {

	constructor( opts ) {

		this._program = null;

		opts = opts || {};

		this.vertexShaderSrc	= opts.vs || DEFAULT_SHADER.VERTEX;
		this.fragmentShaderSrc = opts.fs || DEFAULT_SHADER.FRAGMENT;
		this.drawMode			 = opts.drawMode || 'TRIANGLES';

		// todos
		this.depthTest			= null;
		this.blenEquation		= null;
		this.blendFunc			= null;
		this.culling			= null;
		this.cullside			= null;

		// built-in uniforms
		this.uniforms = {

			projectionMatrix: { type: 'm4', value: null },
			viewMatrix: { type: 'm4', value: null },
			modelMatrix: { type: 'm4', value: null },
			modelViewMatrix: { type: 'm4', value: null },
			normalMatrix: { type: 'm4', value: null },
			camera: { type: 'v3', value: null }

		};

		// append user uniforms
		Object.keys( opts.uniforms || {} ).forEach( name => {

			this.uniforms[ name ] = opts.uniforms[ name ];

		} );

	}

	_setProgram( program ) {

		this._program = program;

	}

}

module.exports = Shader;
