'use strict';

const CONST = {

	DEFAULT_VERTEX_SHADER:
		`
		precision highp float;

		attribute vec3 position;

		uniform mat4 modelMatrix;
		uniform mat4 viewMatrix;
		uniform mat4 projectionMatrix;

		void main() {

			gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

		}

		`
	,

	DEFAULT_FRAGMENT_SHADER:
		`
		precision highp float;

		void main() {

			gl_FragColor = vec4( vec3( 1.0 ), 1.0 );

		}

		`
	,

};

module.exports = CONST;
