'use strict';

class Geometry {

	constructor() {

		this.__buffers = {};

		var vertices = new Float32Array([-1,-1,1,-1,1,1,1,-1,1,1,1,1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,-1]);
		var indices = new Uint16Array([0,1,2,2,1,3,3,1,5,5,7,3,0,4,2,2,4,6,4,5,6,6,5,7,2,3,6,6,3,7,4,5,0,0,5,1]);
		var vertexColor = this.testGenerateVertexColor();

		this.addBuffer( 'position', vertices, 8, 3 );
		this.addBuffer( 'index', indices, 36, 1 );
		this.addBuffer( 'color', vertexColor, 8, 4 );

	}

	addBuffer( name, data, num, itemSize ) {

		this.__buffers[ name ] = {

			data: data,
			num: num,
			itemSize: itemSize,
			buffer: null

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
