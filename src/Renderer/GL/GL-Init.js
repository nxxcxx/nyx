'use strict'

function initContext( opts = {

	// default opts
	alpha: true,
	premultipliedAlpha: false

} ) {

	let canvas = opts.canvas || document.createElement( 'canvas' )
	let GL = canvas.getContext( 'webgl', opts )
	if ( !GL ) throw 'WebGL not supported.'
	enableAllSupportedExtensions( GL )

	return [ GL, canvas ]

}

function enableAllSupportedExtensions( GL ) {

	let glExts = GL.getSupportedExtensions()

	glExts.forEach( ext => {

		if ( !GL.getExtension( ext ) ) console.warn( `${ext} extension not supported.` )

	} )

	// console.info( `Enabled WebGL extensions: ${glExts}` )

}

module.exports = {

	initContext

}
