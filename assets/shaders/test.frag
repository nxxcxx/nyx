precision highp float;

uniform sampler2D uMatcap;
uniform vec3 camera;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {

	vec3 color = vec3( 0.0 );

	vec3 l = normalize( vec3( 1.0, 1.0, 1.0 ) );
	vec3 e = normalize( camera - vPosition );
	vec3 h = normalize( e + l );
	vec3 n = normalize( vNormal );

	float i = dot( n, l );

	float s = pow( max( 0.0, dot( reflect( -l, n ), e ) ), 10.0 );

	color += i * 0.8;
	color += s * 0.3;

	color = smoothstep( vec3( -0.1, -0.2, -0.4 ), vec3( 0.95, 0.9, 1.15 ), color );

	gl_FragColor = vec4( color, 1.0 );

}
