precision highp float;

uniform samplerCube uCubeMap;

varying vec3 n;

void main() {

	vec3 color = vec3( 0.0 );
	color += textureCube( uCubeMap, -n ).rgb;

	gl_FragColor = vec4( color, 1.0 );

}
