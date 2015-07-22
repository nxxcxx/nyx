precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec3 e;
varying vec3 n;

void main() {

   mat4 modelViewMatrix = viewMatrix * modelMatrix;
   e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
   n = normalize( vec3( modelViewMatrix * vec4( normal, 0.0 ) ) );

   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
