'use strict';

const CONST = {

   WEBGL_EXTENSIONS: ["ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "OES_element_index_uint", "OES_standard_derivatives", "OES_texture_float", "OES_texture_float_linear", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBKIT_WEBGL_compressed_texture_s3tc", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_depth_texture", "WEBKIT_WEBGL_depth_texture", "WEBGL_draw_buffers", "WEBGL_lose_context", "WEBKIT_WEBGL_lose_context"],

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
