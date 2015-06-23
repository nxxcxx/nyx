'use strict';

var GLState = ( () => {

   var activeAttributes = new Uint8Array( 16 );
   var incomingAttributes = new Uint8Array( 16 );

   function enableAttributes( gl, attributes ) {

      // reset incomingAttributes
      for( let i = 0; i < incomingAttributes.length; i ++ ) {
         incomingAttributes[ i ] = 0;
      }

      // set and enable incomingAttributes
      Object.keys( attributes ).forEach( name => {

         var slot = attributes[ name ].location;
         if ( slot === -1 ) return;
         incomingAttributes[ slot ] = 1;
         activeAttributes[ slot ] = 1;
         gl.enableVertexAttribArray( slot );

      } );

      // disable inactive attributes
      for( let i = 0; i < incomingAttributes.length; i ++ ) {

         if ( activeAttributes[ i ] !== incomingAttributes[ i ] ) {

            gl.disableVertexAttribArray( i );
            activeAttributes[ i ] = 0;

         }

      }

   }

   return {

      enableAttributes

   };

} )();

module.exports = GLState;
