precision highp float;

uniform sampler2D uMatcap;

varying vec3 e;
varying vec3 n;

void main() {

   vec3 color = vec3( 1.0 );

   vec3 r = reflect( e, n );
   float m = 2.0 * sqrt( pow( r.x, 2.0 ) + pow( r.y, 2.0 ) + pow( r.z + 1.0, 2.0 ) );
   vec2 vN = r.xy / m + 0.5;

   // vec2 vN = n.xy * 0.5 + 0.5;

   color = texture2D( uMatcap, vN ).rgb;
   // s-curve
   color = smoothstep( vec3( -0.1 ), vec3( 0.9 ), color );

   gl_FragColor = vec4( color, 1.0 );

}
