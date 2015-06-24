'use strict';

function createTexture( gl, img ) {

	var tex = gl.createTexture();
	gl.bindTexture( gl.TEXTURE_2D, tex );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );

   /*
   var ext = gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
   gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
   var max_anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
   gl.texParameterf( gl.TEXTURE_2D, 34046, 16 );
   */

	gl.generateMipmap( gl.TEXTURE_2D );
	gl.bindTexture( gl.TEXTURE_2D, null );
   return tex;

}

function loadImage( path, done ) {

	var img = new Image();
	img.onload = () => done( img );
	img.src = path;

}

module.exports = {

   loadImage,
   createTexture

};
