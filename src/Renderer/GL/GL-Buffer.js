'use strict'

/*
 * @param  {TypedArray}  data
 * @param  {boolean}	  isIndexed
 * @return {WebGLBuffer}
 */
function createBuffer( GL, data, isIndexed, isDynamic ) {

	let buffer = GL.createBuffer()
	let target = isIndexed ? GL.ELEMENT_ARRAY_BUFFER : GL.ARRAY_BUFFER
	let usage = isDynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW
	GL.bindBuffer( target, buffer )
	GL.bufferData( target, data, usage )
	return buffer

}

module.exports = {

	createBuffer

}
