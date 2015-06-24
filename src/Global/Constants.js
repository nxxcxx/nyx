'use strict';

const CONST = {

   WEBGL_EXTENSIONS: [ "OES_element_index_uint", "OES_standard_derivatives", "OES_texture_float" ],

   POINTS: 0,
   LINES: 1,
   LINE_LOOP: 2,
   LINE_STRIP: 3,
   TRIANGLES: 4,
   TRIANGLE_STRIP: 5,
   TRIANGLE_FAN: 6,

   DEFAULT_VERTEX_SHADER:
      `
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

      `
   ,

   DEFAULT_FRAGMENT_SHADER:
      `
      precision highp float;

      uniform sampler2D uTexture;

      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
         vec3 color = texture2D( uTexture, vUv ).rgb;
         gl_FragColor = vec4( color, 1.0 );
      }

      `
   ,

};

module.exports = CONST;
