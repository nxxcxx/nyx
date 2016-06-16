precision highp float;

uniform vec3 camera;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vNormal;

void main() {

	vec3 color = texture2D( uTexture, vUv ).rgb;
	float l = dot( normalize( vec3( 1.0, 1.0, 1.0 ) ), vNormal );
	l = clamp( l, 0.1, 1.0 );
	color *= l;
	gl_FragColor = vec4( color, 1.0 );

}
