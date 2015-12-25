'use strict';


function OrbitCtrl( canvas, camera ) {

	var MOUSE = vec2.new();
	var PREV_MOUSE = vec2.new();
	var MOUSE_HOLD = false;
	var CAM_ANGLE = vec2.new( Math.PI * 0.5, 0 );
	var TMP_CAM_ANGLE = vec2.new();
	var DELTA = vec2.new();
	var CAM_DIST = 5.0;
	var GAIN = 0.01;
	var CLAMP_EPS = 0.01;

	ctrlCamera();

	function ctrlCamera() {

		// control camera using spherical coordinate
		var theta = CAM_ANGLE[ 0 ];
		var phi = CAM_ANGLE[ 1 ];

		var t = CAM_DIST * Math.cos( phi );
		var y = CAM_DIST * Math.sin( phi );

		var x = t * Math.cos( theta );
		var z = t * Math.sin( theta );

		vec3.set( camera.position, x, y, z );
		vec3.set( camera.lookAt, 0.0, 0.0, 0.0 );
		vec3.set( camera.upVector, 0.0, 1.0, 0.0 );
		camera.updateViewMatrix();

	}

	canvas.addEventListener( 'mousemove', event => {

		vec2.set( MOUSE, event.x, event.y );

		if ( MOUSE_HOLD ) {

			DELTA[ 0 ] = GAIN * ( MOUSE[ 0 ] - PREV_MOUSE[ 0 ] );
			DELTA[ 1 ] = GAIN * ( MOUSE[ 1 ] - PREV_MOUSE[ 1 ] );

			CAM_ANGLE[ 0 ] = TMP_CAM_ANGLE[ 0 ] + DELTA[ 0 ];
			CAM_ANGLE[ 1 ] = TMP_CAM_ANGLE[ 1 ] + DELTA[ 1 ];
			CAM_ANGLE[ 1 ] = clamp( CAM_ANGLE[ 1 ], - Math.PI * 0.5 + CLAMP_EPS , Math.PI * 0.5 - CLAMP_EPS );

			ctrlCamera();

		}

	} );

	canvas.addEventListener( 'mousedown', event => {

		MOUSE_HOLD = true;
		vec2.set( PREV_MOUSE, event.x, event.y );
		vec2.copy( TMP_CAM_ANGLE, CAM_ANGLE );

	} );


	canvas.addEventListener( 'mouseup', event => {

		MOUSE_HOLD = false;

	} );

	canvas.addEventListener( 'mousewheel', event => {

		var dt = event.wheelDelta;
		CAM_DIST -= dt * 0.005;
		CAM_DIST = clamp( CAM_DIST, 1, 50 );
		ctrlCamera();

	} );

	function clamp( x, min, max ) {
	  return Math.min( Math.max( x, min ), max );
	}

}

module.exports = OrbitCtrl;
