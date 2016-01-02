'use strict';


var $ = require( './engine' );
var Joint = require( './joint' );

var BufferGeometry = require( './BufferGeometry' );
var Shader = require( './Shader' );
var Mesh = require( './Mesh' );

var gltf = $.assets.json[ 'cesium' ].data;
var bin = $.assets.binary[ 'cesium' ].data;

$.skins = parseSkin();
console.log( $.skins );

function parseSkin() {

	var allSkins = {};

	for ( let skin in gltf.skins ) {

		var jointsNames = gltf.skins[ skin ].jointNames;
		var currentSkin = {};

		for ( let i in jointsNames ) {

			var currentJoint = processJoint( jointsNames[ i ] );
			currentSkin[ currentJoint.name ] = currentJoint;

		}

		// parent
		for ( let joint in currentSkin ) {

			let ch = currentSkin[ joint ].children;
			for ( let c in ch ) {

				let child = ch[ c ];
				currentSkin[ child ].parent = joint;

			}

		}

		// multiple root ?
		let root = [];
		for ( let joint in currentSkin ) {
			if ( currentSkin[ joint ].parent === null ) {
				root.push( currentSkin[ joint ] );
			}
		}

		for ( let i in root ) {
			updateMatrixHierarchy( root[ i ], currentSkin );
		}

		// crate mesh
		for ( let joint in currentSkin ) {
			currentSkin[ joint ].createMesh();
		}

		allSkins[ skin ] = currentSkin;
		assignAnimation( currentSkin );

	}



	return allSkins;


	function updateMatrixHierarchy( root, currentSkin ) {

		var rmat = root.matrix;

		for ( let i in root.children ) {

			var jointName = root.children[ i ];
			var cmat = currentSkin[ jointName ].matrix;
			mat4.multiply( currentSkin[ jointName ].matrix, rmat, cmat );

			if ( currentSkin[ jointName ].children.length !== 0 ) {

				updateMatrixHierarchy( currentSkin[ jointName ], currentSkin );

			}

		}

	}

	function processJoint( jointName ) {

		var joint = gltf.nodes[ jointName ];

		var mat = mat4.create();

		var rotateTranslate = mat4.create();
		var scale = mat4.create();

		mat4.scale( scale, scale, joint.scale );
		mat4.fromRotationTranslation( rotateTranslate, joint.rotation, joint.translation );
		mat4.multiply( mat, rotateTranslate, scale );

		var res = new Joint( jointName, mat );
		res.children = joint.children;

		return res;

	}

	function assignAnimation( skin ) {

		Object.keys( gltf.animations ).forEach( name => {

			var joint = gltf.animations[ name ].channels[0].target.id;
			var params = gltf.animations[ name ].parameters;

			skin[ joint ].rotationSeq = extractAnimRot( params.rotation );
			skin[ joint ].translationSeq = extractAnimTrans( params.translation );
			skin[ joint ].scalingSeq = extractAnimScale( params.scale );

		} );

	}

	function extractAnimRot( acc ) {

		var loc = getAccessor( gltf, acc );
		var view = getBufferView( gltf, loc.bufferView );
		return new Float32Array( bin, loc.byteOffset + view.byteOffset, loc.count * 4 );

	}

	function extractAnimTrans( acc ) {

		var loc = getAccessor( gltf, acc );
		var view = getBufferView( gltf, loc.bufferView );
		return new Float32Array( bin, loc.byteOffset + view.byteOffset, loc.count * 3 );

	}

	function extractAnimScale( acc ) {

		var loc = getAccessor( gltf, acc );
		var view = getBufferView( gltf, loc.bufferView );
		return new Float32Array( bin, loc.byteOffset + view.byteOffset, loc.count * 3 );

	}

	function getAccessor( gltf, id ) { return gltf.accessors[ id ]; }
	function getBufferView( gltf, id ) { return gltf.bufferViews[ id ]; }

}
