'use strict';

class Texture2D {

	constructor( opts = {} ) {

		this.data             = opts.data;

		this.wrapS            = opts.wrapS || 'CLAMP_TO_EDGE';
		this.wrapT            = opts.wrapT || 'CLAMP_TO_EDGE';
		this.minFilter        = opts.minFilter ||  'LINEAR_MIPMAP_NEAREST';
		this.magFilter        = opts.magFilter || 'LINEAR';
		this.generateMipmap   = opts.generateMipmap;

	}

}

class ImageTexture extends Texture2D {

	constructor( opts = {} ) {

		super( {

			data: opts.data,
			generateMipmap: true

		} );

	}

}

class DataTexture extends Texture2D {

	constructor( size ) {

		super( {

			minFilter: 'NEAREST',
			magFilter: 'NEAREST',
			generateMipmap: false

		} );

		this.size = size;

	}

}

module.exports = {

	ImageTexture,
	DataTexture

};
