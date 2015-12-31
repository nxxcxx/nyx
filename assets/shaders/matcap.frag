precision highp float;

uniform sampler2D uMatcap;

varying vec3 e;
varying vec3 n;

vec3 toLinear( vec3 v ) {

	return pow( v, vec3( 2.2 ) );

}

vec3 toGamma( vec3 v ) {

	return pow( v, vec3( 1.0 / 2.2 ) );

}

void main() {

	vec3 color = vec3( 1.0 );
	vec2 vN = n.xy * 0.5 + 0.5;
	color = texture2D( uMatcap, vN ).rgb;
	color = toLinear( color );

	// s-curve
	color = smoothstep( vec3( -0.05 ), vec3( 0.95 ), color );

	float fresnel = 1.0 - clamp( dot( -e, n ) * 2.5, 0.0, 1.0 );
	// color += vec3( 0.5, 0.3, 0.7 ) * fresnel;
	color += vec3( 0.2 ) * fresnel;

	color = toGamma( color );

	gl_FragColor = vec4( color, 1.0 );

}
