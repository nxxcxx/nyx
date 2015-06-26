precision highp float;

attribute vec3 position;
attribute vec4 color;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vPosition;

void main() {

   vUv = uv;
   vPosition = position;
   gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

}