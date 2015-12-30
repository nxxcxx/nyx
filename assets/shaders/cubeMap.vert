precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

varying vec3 n;

void main() {

	mat4 modelViewMatrix = viewMatrix * modelMatrix;
	n = normalize( normal );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
