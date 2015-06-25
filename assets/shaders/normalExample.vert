precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {

   vNormal = normalize( normal );
   vPosition = position;
   gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

}
