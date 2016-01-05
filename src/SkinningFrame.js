'use strict';

class SkinningFrame {

	constructor() {

		this.targetJoints = {};

	}

	addJointFrames( joint, channelPath, animData ) {

		if ( this.targetJoints[ joint ] === undefined ) {

			this.targetJoints[ joint ] = {};

		}

		this.targetJoints[ joint ][ channelPath ] = animData;

	}

	getFrames( joint, channelPath, frameNo ) {

		var frames = null;
		var dat = this.targetJoints[ joint ][ channelPath ];
		var [ o1, o2 ] = [ 3 * frameNo, 4 * frameNo ];

		switch( channelPath ) {

			case 'rotation':
				frames = [ dat[ o2 + 0 ], dat[ o2 + 1 ], dat[ o2 + 2 ], dat[ o2 + 3 ] ];
				break;

			case 'translation':
				frames = [ dat[ o1 + 0 ], dat[ o1 + 1 ], dat[ o1 + 2 ] ];
				break;

			case 'scale':
				frames = [ dat[ o1 + 0 ], dat[ o1 + 1 ], dat[ o1 + 2 ] ];
				break;

			default:
				console.warn( 'unknown channel path' );

		}

		return frames;

	}

}

module.exports = SkinningFrame;
