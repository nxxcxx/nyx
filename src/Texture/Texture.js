'use strict';

class Texture2D {

	constructor( opts ) {

		this.data             = opts.data;
		this.format           = null;
		this.type             = null;
		this.mapping          = null;
		this.wrapS            = null;
		this.wrapT            = null;
		this.minFilter        = null;
		this.magFilter        = null;
		this.offset           = null;
		this.repeat           = null;
		this.generateMipmap   = null;
		this.preMultiplyAlpha = null;
		this.flipY            = null;

	}

}

class ImageTexture {}

class DataTexture {}

module.exports = {


};

function createTexture( gl, tex ) {

	var glTex = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, glTex );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.data );

	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tex.wrapS || gl.CLAMP_TO_EDGE );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tex.wrapT || gl.CLAMP_TO_EDGE );

	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, tex.minFilter || gl.LINEAR_MIPMAP_NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, tex.magFilter || gl.LINEAR );

	/* if not dataTexture
	var ext = gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
	gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
	var max_anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
	gl.texParameterf( gl.TEXTURE_2D, 34046, 16 );
	*/

	// if not dataTexture
	gl.generateMipmap( gl.TEXTURE_2D );

	gl.bindTexture( gl.TEXTURE_2D, null );
	return glTex;

}

/* glTexparameter constants

GL_TEXTURE_MAG_FILTER, GL_TEXTURE_MIN_FILTER, GL_TEXTURE_WRAP_S ,GL_TEXTURE_WRAP_T
default: min&mag -> linear, wrapS&T -> repeat

general usage:
min filter: GL_NEAREST, GL_LINEAR, GL_LINEAR_MIPMAP_NEAREST
mag filter: GL_NEAREST, GL_LINEAR

wrap: GL_CLAMP_TO_EDGE, GL_MIRRORED_REPEAT, GL_REPEAT

*/
