'use strict';

class BufferGeometry {

	constructor() {

		this.attributes = {};

	}

	addAttribute( name, data, shape ) {

		this.attributes[ name ] = {
			data: data,
			shape: shape
		};

	}

}

module.exports = BufferGeometry;
