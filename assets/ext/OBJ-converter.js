'use strict';

var fs = require( 'fs' );
var argv = require( 'minimist' )( process.argv.slice( 2 ), {
   string: [ 'file' ]
} );

var data = fs.readFileSync( argv.file, { encoding: 'utf8' } );

var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
var face_pattern = /f( +-?\d+)( +-?\d+)( +-?\d+)/;

var geom = {
   vertices: [],
   faces: []
};

function parseFaceIndex( idx ) {
   return parseInt( idx ) - 1;
}

data.split( '\n' ).forEach( line => {

   if ( line.length === 0 || line.charAt( 0 ) === '#' )
      return;

   var res;

   if ( ( res = vertex_pattern.exec( line ) ) !== null ) {

      res.slice( 1 ).forEach( v => geom.vertices.push( parseFloat( v ) ) );

   } else if ( ( res = face_pattern.exec( line ) ) !== null ) {

      res.slice( 1 ).forEach( f => geom.faces.push( parseFaceIndex( f ) ) );

   }

} );


fs.writeFileSync( argv.file.split( '.' )[ 0 ] + '.json', JSON.stringify( geom ) );
