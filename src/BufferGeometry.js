'use strict';

let vec3 = require( 'src/Math/vec3' );
let ndarray = require( 'ndarray' );

class BufferGeometry {

	constructor() {

		this.attributes = {};

	}

	addAttribute( name, data, shape, isDynamic ) {

		this.attributes[ name ] = {

			data: data,
			shape: shape,
			isDynamic: !!isDynamic

		};

	}

	computeVertexNormals() {

		if ( !this.attributes.position || !this.attributes.index ) return;

		var positions = this.attributes.position;
		var indices = this.attributes.index;

		var pos = positions.data;

		var normals = ndarray( new Float32Array( positions.data.length ), positions.shape );

		for ( let i = 0; i < normals.data.length; i ++ ) {

			normals.data[ i ] = 0;

		}

		for ( let i = 0; i < indices.data.length; i += 3 ) {

			var vA = indices.data[ i + 0 ] * 3;
			var vB = indices.data[ i + 1 ] * 3;
			var vC = indices.data[ i + 2 ] * 3;

			var pA = vec3.fromValues( pos[ vA + 0 ], pos[ vA + 1 ], pos[ vA + 2 ] );
			var pB = vec3.fromValues( pos[ vB + 0 ], pos[ vB + 1 ], pos[ vB + 2 ] );
			var pC = vec3.fromValues( pos[ vC + 0 ], pos[ vC + 1 ], pos[ vC + 2 ] );

			var cb = vec3.fromValues(); vec3.sub( cb, pC, pB );
			var ab = vec3.fromValues(); vec3.sub( ab, pA, pB );
			vec3.cross( cb, cb, ab );

			normals.data[ vA + 0 ] += cb[ 0 ];
			normals.data[ vA + 1 ] += cb[ 1 ];
			normals.data[ vA + 2 ] += cb[ 2 ];

			normals.data[ vB + 0 ] += cb[ 0 ];
			normals.data[ vB + 1 ] += cb[ 1 ];
			normals.data[ vB + 2 ] += cb[ 2 ];

			normals.data[ vB + 0 ] += cb[ 0 ];
			normals.data[ vB + 1 ] += cb[ 1 ];
			normals.data[ vB + 2 ] += cb[ 2 ];

		}

		this.addAttribute( 'normal', normals.data, normals.shape );

	}

}

module.exports = BufferGeometry;
