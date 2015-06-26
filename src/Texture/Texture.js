'use strict';

class Texture2D {

	constructor( opts = {} ) {

		this.data             = opts.data;

		this.wrapS            = opts.wrapS || 'CLAMP_TO_EDGE';
		this.wrapT            = opts.wrapT || 'CLAMP_TO_EDGE';
		this.minFilter        = opts.minFilter ||  'LINEAR_MIPMAP_NEAREST';
		this.magFilter        = opts.magFilter || 'LINEAR';

	}

}

class ImageTexture extends Texture2D {

	constructor( opts = {} ) {

		super( {
			data: opts.data
		} );

	}

}

class DataTexture extends Texture2D {

	constructor( size ) {

		super( {

		} );

	}

}

module.exports = {

	ImageTexture,
	DataTexture

};

function createTexture( gl, tex ) {

	var glTex = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, glTex );

	if ( tex instanceof ImageTexture ) {

		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.data );

	}
	else if ( tex instanceof DataTexture ) {

	}

	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, tex.wrapS );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, tex.wrapT );

	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, tex.minFilter );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, tex.magFilter );

	if ( tex.generateMipmap ) gl.generateMipmap( gl.TEXTURE_2D );

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
