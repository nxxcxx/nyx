/* jshint -W079 */
'use strict';

var BufferGeometry = require( './BufferGeometry' );
var Node = require( './Node' );
var Skeleton = require( './Skeleton' );
var SkinningFrame = require( './SkinningFrame' );

const VERSION = '1.0';

const AC_COMPONENT_TYPE = {

	'5120': Float32Array,
	'5121': Uint8Array,
	'5122': Int16Array,
	'5123': Uint16Array,
	'5126': Float32Array

};

const AC_TYPE = {

	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16

};

const SEMANTIC_MAP = {

	'POSITION': 'position',
	'NORMAL': 'normal',
	'TEXCOORD_0': 'uv',
	'JOINT': 'jointIndex',
	'WEIGHT': 'weight',
	'indices': 'index'

};

class GLTF {

	constructor( gltf, bin ) {

		this._version = VERSION;
		this.gltf = gltf;
		// todo: currently support only one binary file
		this.bin = bin;

		this.nodes = null;
		this.geometries = null;
		this.skeletons = null;
		this.skinInstances = null;

	}

	_parseAnimation() {

		var skinningFrame = new SkinningFrame();

		Object.keys( this.gltf.animations ).forEach( animId => {

			var animInfo = this.gltf.animations[ animId ];

			animInfo.channels.forEach( channel => {

				var targetJointName = this.nodes[ channel.target.id ].name;
				var channelPath = channel.target.path;

				var accessor = this._getAccessor( animInfo.parameters[ channelPath ] );
				var typedArray = this._createTypedArrayFromAccessor( accessor );
				var animData = typedArray.data;

				skinningFrame.addJointFrames( targetJointName, channelPath, animData );

			} );

		} );

		console.log( 'SkinningFrame:', skinningFrame );
		this.skinningFrame = skinningFrame;

	}

	_linkSkinInstances() {

		if ( this.skeletons === null ) this._parseSkins();

		var skinInstances = {};

		Object.keys( this.gltf.nodes ).forEach( nodeId => {

			var nodeInfo = this.gltf.nodes[ nodeId ];

			// if node is a skin instance
			if ( nodeInfo.meshes && nodeInfo.skeletons && nodeInfo.skin ) {

				var skeleton = this.skeletons[ nodeInfo.skin ];
				// set root joints, todo: jointName ?
				nodeInfo.skeletons.forEach( jointName => {

					skeleton.root.push( this.nodes[ jointName ] );

				} );

				nodeInfo.meshes.forEach( meshId => {

					skinInstances[ meshId ] = skeleton;

				} );

				skeleton.computeJointMatrices();

			}

		} );

		this.skinInstances = skinInstances;

	}

	_parseSkins() {

		if ( this.nodes === null ) this._parseNodes();

		var skeletons = {};

		Object.keys( this.gltf.skins ).forEach( skinId => {

			var skinInfo = this.gltf.skins[ skinId ];
			var skeleton = new Skeleton( skinId );
			skeleton.bindShapeMatrix = skinInfo.bindShapeMatrix;

			// inverseBindMatrices
			var accessor = this._getAccessor( skinInfo.inverseBindMatrices );
			var typedArray = this._createTypedArrayFromAccessor( accessor );
			skeleton.inverseBindMatrices = typedArray.data;

			// joints
			skinInfo.jointNames.forEach( jointName => {

				// todo: nodeId may not be the same as jointName
				skeleton.addJoint( this.nodes[ jointName ] );

			} );

			skeletons[ skinId ] = skeleton;

		} );

		this.skeletons = skeletons;
		console.log( 'Skeletons:', skeletons );

	}

	_parseNodes() {

		var nodes = {};

		Object.keys( this.gltf.nodes ).forEach( nodeId => {

			var nodeInfo = this.gltf.nodes[ nodeId ];
			var node = new Node( nodeId );

			if ( nodeInfo.matrix ) {

				node.setMatrix( nodeInfo.matrix );

			} else {

				var scaling = nodeInfo.scale || [ 1, 1, 1 ];
				var rotation = nodeInfo.rotation || [ 0, 0, 0, 0.1 ];
				var translation = nodeInfo.translation || [ 0, 0, 0 ];
				node.setMatrixFromSRT( scaling, rotation, translation );

			}

			if ( nodeInfo.children ) {

				nodeInfo.children.forEach( childNodeId => {

					node.children[ childNodeId ] = null;

				} );

			}

			if ( nodeInfo.jointName ) {

				node.jointName = nodeInfo.jointName;

			}

			nodes[ nodeId ] = node;

		} );

		// link children
		Object.keys( nodes ).forEach( nodeId => {

			var node = nodes[ nodeId ];

			Object.keys( node.children ).forEach( childNodeId => {

				node.children[ childNodeId ] = nodes[ childNodeId ];

			} );

		} );

		this.nodes = nodes;
		console.log( 'Nodes:', nodes );

	}

	// return geometries constructed from gltf
	_parseMesh() {

		var geometries = {};

		Object.keys( this.gltf.meshes ).forEach( meshId => {

			// todo: currently support only one primitive ( draw calls )
			var primitive = this.gltf.meshes[ meshId ].primitives[ 0 ];
			var attributesDefinition = this._parseAttribute( primitive );

			var geometry = new BufferGeometry();

			attributesDefinition.forEach( attr => {

				geometry.addAttribute( attr.name, attr.data, attr.shape, attr.isDynamic );

			} );

			geometries[ meshId ] = geometry;

		} );

		this.geometries = geometries;
		return geometries;

	}

	_parseAttribute( primitive ) {

		var attributes = [];
		var attr;

		// special case if primitive have indices
		if ( primitive.indices !== undefined ) {

			attr = this._prepareAttribute( primitive, 'indices' );
			attributes.push( attr );

		}

		Object.keys( primitive.attributes ).forEach( semantic => {

			attr = this._prepareAttribute( primitive, semantic );
			attributes.push( attr );

		} );

		return attributes;

	}

	_prepareAttribute( primitive, semantic ) {

		// todo: if vertex morph target animation, attribute should be dynamic
		var attr = {

			name: null,
			data: null,
			shape: null,
			isDynamic: false

		};

		var accessor;

		if ( semantic === 'indices' ) {

			accessor = this._getAccessor( primitive[ semantic ] );

		} else {

			accessor = this._getAccessor( primitive.attributes[ semantic ] );

		}

		var typedArray = this._createTypedArrayFromAccessor( accessor );
		attr.shape = typedArray.shape;
		attr.data = typedArray.data;

		if ( SEMANTIC_MAP[ semantic ] ) {

			attr.name = SEMANTIC_MAP[ semantic ];

		} else {

			console.warn( 'GLTF parser: unknown attribute semantic.' );

		}

		return attr;

	}

	_createTypedArrayFromAccessor( accessor ) {

		var bufferView = this._getBufferView( accessor.bufferView );
		var byteOffset = accessor.byteOffset + bufferView.byteOffset;

		var shape = [ accessor.count, AC_TYPE[ accessor.type ] ];
		// create typed array from accessor componentType ( Float32Array, Uint8Array, Int16Array, Uint16Array, Float32Array )
		var data = new AC_COMPONENT_TYPE[ accessor.componentType ]( this.bin, byteOffset, shape[ 0 ] * shape[ 1 ] );

		return {

			data: data,
			shape: shape

		};

	}

	_getAccessor( id ) {

		return this.gltf.accessors[ id ];

	}

	_getBufferView( id ) {

		return this.gltf.bufferViews[ id ];

	}

}

module.exports = GLTF;
