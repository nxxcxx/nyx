'use strict';

// var ext = GL.getExtension("MOZ_EXT_texture_filter_anisotropic");
// GL.texParameterf(GL.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
// var max_anisotropy = GL.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
// GL.texParameterf( GL.TEXTURE_2D, 34046, 16 );

var Texture = require( '../../Texture' );

function createTexture( tex ) {

	var glTex = GL.createTexture();
	GL.bindTexture( GL.TEXTURE_2D, glTex );

	GL.pixelStorei( GL.UNPACK_FLIP_Y_WEBGL, tex.flipY );

	if ( tex instanceof Texture.ImageTexture ) {

		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, tex.data );

	}
	else if ( tex instanceof Texture.DataTexture ) {

		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, tex.size, tex.size, 0, GL.RGBA, GL.FLOAT, null );

	}

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL[ tex.wrapS ] );
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL[ tex.wrapT ] );

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL[ tex.minFilter ] );
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL[ tex.magFilter ] );

	if ( tex.generateMipmap ) GL.generateMipmap( GL.TEXTURE_2D );

	GL.bindTexture( GL.TEXTURE_2D, null );
	return glTex;

}

module.exports = {

	createTexture

};
