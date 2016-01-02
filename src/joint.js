'use strict';

var $ = require( './engine' );
var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );

class Joint {

	constructor( name, matrix ) {

		this.name = name;
		this.matrix = matrix;
		this.children = [];
		this.parent = null;

		this.currentSequence = 0;

	}

	stepSequence() {

		var o1 = this.currentSequence * 3;
		var o2 = this.currentSequence * 4;
		var currentScale = [ this.scalingSeq[ o1 ], this.scalingSeq[ o1 + 1 ], this.scalingSeq[ o1 + 2] ];
		var currentTranslation = [ this.translationSeq[ o1 ], this.translationSeq[ o1 + 1 ], this.translationSeq[ o1 + 2] ];
		var currentRotation = [ this.rotationSeq[ o2 ], this.rotationSeq[ o2 + 1 ], this.rotationSeq[ o2 + 2], this.rotationSeq[ o2 + 3 ] ];

		var sc = mat4.create();
		var rt = mat4.create();
		mat4.identity( this.matrix );
		mat4.scale( sc, sc, currentScale );
		mat4.fromRotationTranslation( rt, currentRotation, currentTranslation );
		mat4.multiply( this.matrix, rt, sc );

		mat4.copy( this.mesh.modelMatrix, this.matrix );

		this.currentSequence += 1;

		if ( this.currentSequence >= this.translationSeq.length / 3 ) this.currentSequence = 1;

		console.log( this.currentSequence );

	}

	updateMesh() {

		mat4.copy( this.mesh.modelMatrix, this.matrix );

	}

	updateMatrixHierarchy( root, currentSkin ) {

		var rmat = root.matrix;

		for ( let i in root.children ) {

			var jointName = root.children[ i ];

			var cmat = currentSkin[ jointName ].matrix;

			mat4.multiply( currentSkin[ jointName ].matrix, rmat, cmat );

			if ( currentSkin[ jointName ].children.length !== 0 ) {

				this.updateMatrixHierarchy( currentSkin[ jointName ], currentSkin );

			}

		}

	}

	createMesh() {

		var ico = $.assets.json.ico.data;
		var vpos = ndarray( new Float32Array( ico.vertices ), [ ico.vertices.length / 3, 3 ] );
		var vidx = ndarray( new Uint32Array( ico.faces ), [ ico.faces.length, 1 ] );

		var geom = new BufferGeometry();
		geom.addAttribute( 'position', vpos.data, vpos.shape );
		geom.addAttribute( 'index', vidx.data, vidx.shape );
		geom.computeVertexNormals();

		var shader = new Shader();

		ico = new Mesh( geom, shader );
		mat4.copy( ico.modelMatrix, this.matrix );

		this.mesh = ico;

	}

}

module.exports = Joint;
