'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Tuned from the GetLayers Fine Grain look: a warm, low-contrast leather field.
const fragmentShader = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uResolution;
uniform float uTime;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0);
  float field = noise(p * 1.65 + vec2(sin(uTime) * .018, cos(uTime) * .012));
  float slope = clamp((uv.x * .62 + (1.0 - uv.y) * .38) + (field - .5) * .18, 0., 1.);
  vec3 c0 = vec3(.0196), c1 = vec3(.0627, .0431, .0471), c2 = vec3(.2078, .0863, .098), c3 = vec3(.4196, .1451, .1882);
  vec3 color = mix(c0, c1, smoothstep(.00, .30, slope));
  color = mix(color, c2, smoothstep(.32, .67, slope));
  color = mix(color, c3, smoothstep(.70, 1., slope));
  float grain = hash(gl_FragCoord.xy + floor(uTime * 24.0)) - .5;
  outColor = vec4(color + grain * .055, 1.0);
}`;

export default function LeatherGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const compile = (type: number, source: string) => { const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader)); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPos'); const resolution = gl.getUniformLocation(program, 'uResolution'); const time = gl.getUniformLocation(program, 'uTime');
    let frame = 0; let started = performance.now();
    const resize = () => { const dpr = Math.min(window.devicePixelRatio, 2); const width = Math.min(window.innerWidth * dpr, 1600); const height = Math.min(window.innerHeight * dpr, 1600); if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; } };
    const render = (now: number) => { resize(); gl.viewport(0, 0, canvas.width, canvas.height); gl.useProgram(program); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0); gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform1f(time, ((now - started) / 1000) % 6.2832); gl.drawArrays(gl.TRIANGLES, 0, 3); frame = requestAnimationFrame(render); };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />;
}
