'use strict';

/*
 * @return {WebGLTexture}
 */

function createTexture( img ) {

	var tex = GL.createTexture();
	GL.bindTexture( GL.TEXTURE_2D, tex );
	GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img );

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR );
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST );

	/*
	var ext = GL.getExtension("MOZ_EXT_texture_filter_anisotropic");
	GL.texParameterf(GL.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
	var max_anisotropy = GL.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
	GL.texParameterf( GL.TEXTURE_2D, 34046, 16 );
	*/

	GL.generateMipmap( GL.TEXTURE_2D );
	GL.bindTexture( GL.TEXTURE_2D, null );
	return tex;

}

module.exports = {

	createTexture

};
