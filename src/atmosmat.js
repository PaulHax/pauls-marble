import * as THREE from 'three'
export function makeAtmosMat(){
	var vertexShader	= [
		'varying vec3	vVertexWorldPosition;',
		'varying vec3	vVertexNormal;',
		'varying vec3	vNormal;',

		'void main(){',
		'	vNormal	= normal;',
		'	vVertexNormal	= normalize(normalMatrix * normal);',

		'	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;',

		'	// set gl_Position',
		'	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}',

		].join('\n')
	var fragmentShader	= [
    'uniform vec3 pointLightPosition;',
		'uniform vec3	glowColor;',
		'uniform float	coeficient;',
		'uniform float	power;',

		'varying vec3	vNormal;',
		'varying vec3	vVertexNormal;',
		'varying vec3	vVertexWorldPosition;',

		'void main(){',
		'	vec3 light = pointLightPosition - vVertexWorldPosition;',
		'	light = normalize(light);',
		'	float lightAngle = max(0.0, dot(vNormal, light) + .5);',
		'	float adjustedLightAngle = min(0.6, lightAngle) / 0.6;',
		'	vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
		'	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
		'	viewCameraToVertex = normalize(viewCameraToVertex);',
		'	float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power) * min(asin(adjustedLightAngle), 1.0);',
		'	gl_FragColor = vec4(glowColor, intensity);',
		'}',
	].join('\n')

	// create custom material from the shader code above
	//   that is within specially labeled script tags
	var material	= new THREE.ShaderMaterial({
		uniforms: { 
			coeficient	: {
				type	: "f", 
				value	: 1.0
			},
			power		: {
				type	: "f",
				value	: 2
			},
			glowColor	: {
				type	: "c",
				value	: new THREE.Color('pink')
      },
      pointLightPosition: {
        type: "v3", 
        value: sunLight.position
      },
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		//blending	: THREE.AdditiveBlending,
		transparent	: true,
		depthWrite	: false,
	});
	return material
}