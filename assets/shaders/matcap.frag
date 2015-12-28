precision highp float;

uniform sampler2D uMatcap;

varying vec3 e;
varying vec3 n;

void main() {

	vec3 color = vec3( 1.0 );
	vec2 vN = n.xy * 0.5 + 0.5;
	color = texture2D( uMatcap, vN ).rgb;

	// s-curve
	color = smoothstep( vec3( - 0.1 ), vec3( 0.9 ), color );

	float fakeFresnelFactor = clamp( dot( -e, n ) * 3.0, 0.0, 1.0 );
	color *= fakeFresnelFactor;

	gl_FragColor = vec4( color, 1.0 );

}
