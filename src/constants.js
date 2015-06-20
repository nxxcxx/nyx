'use strict';
const CONST = {

   WEBGL_EXTENSIONS: [ "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "OES_element_index_uint", "OES_standard_derivatives", "OES_texture_float", "OES_texture_float_linear", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBKIT_WEBGL_compressed_texture_s3tc", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_depth_texture", "WEBKIT_WEBGL_depth_texture", "WEBGL_draw_buffers", "WEBGL_lose_context", "WEBKIT_WEBGL_lose_context" ],

   POINTS: 0,
   LINES: 1,
   LINE_LOOP: 2,
   LINE_STRIP: 3,
   TRIANGLES: 4,
   TRIANGLE_STRIP: 5,
   TRIANGLE_FAN: 6,

   DEFAULT_VERTEX_SHADER: [

      'precision highp float;',

      'attribute vec3 position;',
      'attribute vec4 color;',

      'uniform mat4 modelMatrix;',
      'uniform mat4 viewMatrix;',
      'uniform mat4 projectionMatrix;',

      'varying vec3 vPosition;',
      'varying vec4 vColor;',

      'void main() {',
      '  vColor = color;',
      '  vPosition = position;',
      '  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );',
      '}'

   ].join( '\n' ),

   DEFAULT_FRAGMENT_SHADER: [

      'precision highp float;',

      'varying vec3 vPosition;',
      'varying vec4 vColor;',

      'void main() {',
      '  vec3 color = vPosition * 0.5 + vec3( 0.5 );',
      // '  vec3 color = vColor.rgb;',
      '  gl_FragColor = vec4( color, 1.0 );',
      '}'

   ].join( '\n' )

}

module.exports = CONST;
