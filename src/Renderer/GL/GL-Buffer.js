'use strict';

/*
 * @param  {TypedArray}  data
 * @param  {boolean}     isIndexed
 * @return {WebGLBuffer}
 */
function createBuffer( data, isIndexed ) {

	var buffer = GL.createBuffer();
	var target = isIndexed ? GL.ELEMENT_ARRAY_BUFFER : GL.ARRAY_BUFFER;
	GL.bindBuffer( target, buffer );
	GL.bufferData( target, data, GL.STATIC_DRAW );
	return buffer;

}

module.exports = {

	createBuffer

};
