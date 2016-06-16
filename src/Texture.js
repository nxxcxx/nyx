'use strict';

class Texture2D {

	constructor( opts = {} ) {

		this.data           = opts.data;

		this.flipY          = opts.flipY === undefined ? true : opts.flipY;
		this.wrapS          = opts.wrapS || 'CLAMP_TO_EDGE';
		this.wrapT          = opts.wrapT || 'CLAMP_TO_EDGE';
		this.minFilter      = opts.minFilter || 'LINEAR_MIPMAP_NEAREST';
		this.magFilter      = opts.magFilter || 'LINEAR';
		this.generateMipmap = opts.generateMipmap === undefined ? true : opts.generateMipmap;

	}

}

class ImageTexture extends Texture2D {

	constructor( opts = {} ) {

		super( opts );
		this.generateMipmap = true;

	}

}

class DataTexture extends Texture2D {

	constructor( size ) {

		super();
		this.minFilter = 'NEAREST';
		this.magFilter = 'NEAREST';
		this.generateMipmap = false;
		this.size = size;

	}

}

class CubeMapTexture extends Texture2D {

	constructor( opts = {} ) {

		super( opts );

		this.minFilter = 'LINEAR';
		this.magFilter = 'LINEAR';
		this.generateMipmap = false;

	}

}

module.exports = {

	ImageTexture,
	DataTexture,
	CubeMapTexture

};
