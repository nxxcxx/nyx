'use strict';

/*
 * @param  {TypedArray}  data
 * @param  {boolean}	  isIndexed
 * @return {WebGLBuffer}
 */
function createBuffer( data, isIndexed, isDynamic ) {

	var buffer = GL.createBuffer();
	var target = isIndexed ? GL.ELEMENT_ARRAY_BUFFER : GL.ARRAY_BUFFER;
	var usage = isDynamic ? GL.DYNAMIC_DRAW : GL.STATIC_DRAW;
	GL.bindBuffer( target, buffer );
	GL.bufferData( target, data, usage );
	return buffer;

}

module.exports = {

	createBuffer

};
