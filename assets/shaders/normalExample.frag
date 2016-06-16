precision highp float;

varying vec3 vNormal;

void main() {

	vec3 color = vec3( 1.0 );
	color = vNormal * 0.5 + 0.5;

	// vec3 lumCoef = vec3( 0.299, 0.587, 0.114 );
	// color = vec3( dot( color, lumCoef ) );

	gl_FragColor = vec4( color, 1.0 );

}
