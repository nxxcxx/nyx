'use strict';

function loadImage( path, done ) {

	var img = new Image();
	img.onload = () => done( img );
	img.src = path;

}


module.exports = {

	loadImage

};
