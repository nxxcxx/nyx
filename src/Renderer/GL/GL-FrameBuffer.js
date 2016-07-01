'use strict'

function createFramebuffer( GL, renderTarget ) {

	let fb = GL.createFramebuffer()
	GL.bindFramebuffer( GL.FRAMEBUFFER, fb )
	GL.framebufferTexture2D( GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, renderTarget.dataTexture._WebGLTexture, 0 )

	// depth write
	let rb = GL.createRenderbuffer()
	GL.bindRenderbuffer( GL.RENDERBUFFER, rb )
	GL.renderbufferStorage( GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, renderTarget.dataTexture.size, renderTarget.dataTexture.size )
	GL.framebufferRenderbuffer( GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, rb )
	GL.bindRenderbuffer( GL.RENDERBUFFER, null )

	GL.bindFramebuffer( GL.FRAMEBUFFER, null )

	return fb

}

module.exports = {

	createFramebuffer

}
