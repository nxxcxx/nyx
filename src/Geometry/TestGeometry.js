/* jshint -W008, -W117 */
'use strict';

var BufferGeometry = require( './BufferGeometry' );

class TestGeometry extends BufferGeometry {

   constructor() {

      super();

      var vertices = new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1] );
		var indices = new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);
      var vertexColor = new Float32Array([1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,.5,.5,1,1,.5,.5,1,1,.5,.5,1,1,.5,.5,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1]);
      var uv = new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]);

		this.addAttribute( 'position', vertices, [ vertices.length / 3, 3 ] );
      this.addAttribute( 'color', vertexColor, [ vertexColor.length / 4, 4 ] );
		this.addAttribute( 'uv', uv, [ uv.length / 2, 2 ] );
		this.addAttribute( 'index', indices, [ indices.length, 1 ] );


      // var vertexColor = this.testGenerateVertexColor();
      // this.addAttribute( 'color', vertexColor.data, vertexColor.shape );

   }

   testGenerateVertexColor() {

		var numVerts = 8;
		var res = ndarray( new Float32Array( numVerts * 4 ), [ numVerts, 4 ] );

		for ( let i = 0; i < numVerts; i ++ ) {
			for ( let j = 0; j < 4; j ++ ) {
				res.set( i, j, Math.random() );
			}
		}

		return res;

	}

}

module.exports = TestGeometry;
