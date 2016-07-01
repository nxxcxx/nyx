'use strict'

let Texture = require( 'src/Texture' )

function createTexture( GL, tex ) {

	if ( tex instanceof Texture.CubeMapTexture ) {

		return createTextureCubeMap( GL, tex )

	} else {

		return createTexture2D( GL, tex )

	}

}

function createTexture2D( GL, tex ) {

	let glTex = GL.createTexture()
	GL.bindTexture( GL.TEXTURE_2D, glTex )

	GL.pixelStorei( GL.UNPACK_FLIP_Y_WEBGL, tex.flipY )

	if ( tex instanceof Texture.ImageTexture ) {

		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, tex.data )

	}
	else if ( tex instanceof Texture.DataTexture ) {

		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, tex.size, tex.size, 0, GL.RGBA, GL.FLOAT, null )

	}

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL[ tex.wrapS ] )
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL[ tex.wrapT ] )

	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL[ tex.minFilter ] )
	GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL[ tex.magFilter ] )

	//Enable Anisotropic Filtering
	// TODO: this should not be here
	let ext = GL.getExtension( 'EXT_texture_filter_anisotropic' )
	if ( ext ) {

		let max_anisotropy = GL.getParameter( ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT )
		GL.texParameterf( GL.TEXTURE_2D, 34046, max_anisotropy )

	}

	if ( tex.generateMipmap ) GL.generateMipmap( GL.TEXTURE_2D )

	GL.bindTexture( GL.TEXTURE_2D, null )
	return glTex

}

function createTextureCubeMap( GL, tex ) {

	let glTex = GL.createTexture()
	GL.bindTexture( GL.TEXTURE_CUBE_MAP, glTex )

	GL.pixelStorei( GL.UNPACK_FLIP_Y_WEBGL, tex.flipY )

	for ( let i = 0; i < 6; i ++ ) {

		GL.texImage2D( GL.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, tex.data[ i ] )

	}

	GL.texParameteri( GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL[ tex.wrapS ] )
	GL.texParameteri( GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL[ tex.wrapT ] )

	GL.texParameteri( GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL[ tex.minFilter ] )
	GL.texParameteri( GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL[ tex.magFilter ] )

	return glTex

}

module.exports = {

	createTexture

}
