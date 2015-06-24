'use strict';

/*
 * @param  {TypedArray}  data
 * @param  {boolean}     isIndexed
 * @return {WebGLBuffer}
 */
function createBuffer( gl, data, isIndexed ) {

	var buffer = gl.createBuffer();
	var target = isIndexed ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
	gl.bindBuffer( target, buffer );
	gl.bufferData( target, data, gl.STATIC_DRAW );
	return buffer;

}



module.exports = {

	createBuffer

};
