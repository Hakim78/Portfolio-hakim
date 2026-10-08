/**
 * Shaders de la bande de cartes.
 *
 * Carte : plan subdivisé déformé en z selon la position x monde
 *   z = −courbure·x²  (la bande s'éloigne sur les côtés)
 *     + amplitude·sin(k·x + phase)  (l'onde qui traverse la bande)
 * La normale est dérivée analytiquement pour l'éclairage (Blinn-Phong) :
 * quand l'onde passe, une bande claire balaie la carte.
 */

export const cardVertex = /* glsl */ `
  uniform float uCurv;
  uniform float uAmp;
  uniform float uWaveK;
  uniform float uPhase;
  uniform float uLift;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    float x = wp.x;
    float wave = uWaveK * x + uPhase;
    float z = -uCurv * x * x + uAmp * sin(wave) + uLift;
    float dzdx = -2.0 * uCurv * x + uAmp * uWaveK * cos(wave);
    wp.z += z;
    vNormal = normalize(vec3(-dzdx, 0.0, 1.0));
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const cardFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform float uOpacity;
  uniform float uHover;
  uniform vec3 uLightDir;
  uniform vec3 uCamPos;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec3 tex = uHasMap > 0.5 ? texture2D(uMap, vUv).rgb : vec3(0.07);

    vec3 n = normalize(vNormal);
    vec3 l = normalize(uLightDir);
    vec3 v = normalize(uCamPos - vWorldPos);
    vec3 h = normalize(l + v);
    float diff = 0.78 + 0.22 * max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 26.0) * 0.34;
    vec3 col = tex * diff + spec + uHover * 0.05;

    vec2 p = (vUv - 0.5) * uSize;
    float d = sdRoundBox(p, uSize * 0.5, uRadius);
    float alpha = 1.0 - smoothstep(-1.0, 1.0, d);

    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`

export const gridVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

export const gridFragment = /* glsl */ `
  precision highp float;

  uniform float uCell;
  uniform vec3 uColor;
  uniform float uFar;
  uniform vec3 uCamPos;
  uniform float uOpacity;

  varying vec3 vWorld;

  void main() {
    vec2 p = vWorld.xz / uCell;
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dist = distance(vWorld, uCamPos);
    float fade = 1.0 - smoothstep(uFar * 0.12, uFar, dist);
    gl_FragColor = vec4(uColor, line * fade * uOpacity);
  }
`
