precision highp float;

attribute vec3 position;
attribute vec3 normal;

attribute vec4 jointIndex;
attribute vec4 weight;

uniform mat4 inverseBindPose[19];
uniform mat4 jointMatrices[19];

uniform vec3 camera;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {

	mat4 skinMat = weight.x * jointMatrices[ int( jointIndex.x ) ] * inverseBindPose[ int( jointIndex.x ) ];
	skinMat += weight.y * jointMatrices[ int( jointIndex.y ) ] * inverseBindPose[ int( jointIndex.y ) ];
	skinMat += weight.z * jointMatrices[ int( jointIndex.z ) ] * inverseBindPose[ int( jointIndex.z ) ];
	skinMat += weight.w * jointMatrices[ int( jointIndex.w ) ] * inverseBindPose[ int( jointIndex.w ) ];

	gl_Position = projectionMatrix * viewMatrix * modelMatrix * skinMat * vec4( position, 1.0 );

}
