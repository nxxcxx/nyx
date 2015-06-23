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

	addElementAttribute( name, data ) {

		

	}

}

module.exports = BufferGeometry;
