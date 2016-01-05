precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

attribute vec4 jointIndex;
attribute vec4 weight;

uniform mat4 inverseBindMatrices[19];
uniform mat4 jointMatrices[19];

uniform vec3 camera;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;

void main() {

	vUv = uv;
	vNormal = normalize( normal );

	mat4 skinMat = weight.x * jointMatrices[ int( jointIndex.x ) ] * inverseBindMatrices[ int( jointIndex.x ) ];
	skinMat += weight.y * jointMatrices[ int( jointIndex.y ) ] * inverseBindMatrices[ int( jointIndex.y ) ];
	skinMat += weight.z * jointMatrices[ int( jointIndex.z ) ] * inverseBindMatrices[ int( jointIndex.z ) ];
	skinMat += weight.w * jointMatrices[ int( jointIndex.w ) ] * inverseBindMatrices[ int( jointIndex.w ) ];

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * skinMat * vec4( position, 1.0 );

}
