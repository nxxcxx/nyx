'use strict';

class Geometry {

	constructor() {

		this.attributes = {};

		var vertices = new Float32Array([-1,-1,1,-1,1,1,1,-1,1,1,1,1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,-1]);
		var indices = new Uint16Array([0,1,2,2,1,3,1,5,3,3,5,7,2,3,6,6,3,7,4,5,0,0,5,1,4,0,6,6,0,2,6,7,4,4,7,5]);
		var vertexColor = this.testGenerateVertexColor();

		this.addBuffer( 'position', vertices, 8, 3 );
		this.addBuffer( 'color', vertexColor, 8, 4 );
		this.addBuffer( 'index', indices, 36, 1 );

	}

	addBuffer( name, data, num, itemSize ) {

		this.attributes[ name ] = {

			data: data,
			dimension: [ num, itemSize ]

		};

	}

	testGenerateVertexColor() {

		var numVerts = 8;
		var res = ndarray( new Float32Array( numVerts * 4 ), [ numVerts, 4 ] );

		for ( let i = 0; i < numVerts; i ++ ) {
			for ( let j = 0; j < 4; j ++ ) {
				res.set( i, j, Math.random() );
			}
		}

		return res.data;

	}

}

module.exports = Geometry;
