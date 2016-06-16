precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform vec3 camera;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {

	mat4 modelViewMatrix = viewMatrix * modelMatrix;

	vPosition = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
	vNormal = normalize( normal );

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		
}
