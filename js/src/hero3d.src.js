// Hero 3D scene — source. Bundled + minified to ../hero3d.js by esbuild (tree-shaken Three.js).
// Design goals: subtle, lightweight, never competes with the text.
// Elements: ambient particles, a receding depth grid, and a 12-star EU ring that frames the portrait.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, BufferGeometry, Float32BufferAttribute,
  Points, PointsMaterial, CanvasTexture, AdditiveBlending, GridHelper,
  Shape, ShapeGeometry, MeshBasicMaterial, Mesh, DoubleSide, Color,
} from 'three';

const canvas = document.getElementById('hero-canvas');
if (canvas) init(canvas);

function init(canvas) {
  const hero = canvas.parentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 768px)').matches;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'low-power' });
  } catch (e) {
    canvas.remove(); // no WebGL — the page simply keeps its CSS glow background
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const world = new Group();
  scene.add(world);

  // The star ring lives in its own scene with a FIXED camera, so it never reacts to the mouse.
  const ringScene = new Scene();
  const ringCamera = new PerspectiveCamera(55, 1, 0.1, 100);
  ringCamera.position.set(0, 0, 7);
  renderer.autoClear = false;

  // --- soft round sprite for particles
  const sprite = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();

  // --- ambient particles (blue-white, with a few warm gold flecks)
  const COUNT = small ? 180 : 520;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const blue = new Color('#8fb0ff');
  const white = new Color('#dfe7ff');
  const gold = new Color('#f5a623');
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    const r = Math.random();
    const c = r < 0.06 ? gold : r < 0.55 ? blue : white;
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const pg = new BufferGeometry();
  pg.setAttribute('position', new Float32BufferAttribute(pos, 3));
  pg.setAttribute('color', new Float32BufferAttribute(col, 3));
  const particles = new Points(pg, new PointsMaterial({
    size: small ? 0.11 : 0.09, map: sprite, vertexColors: true, transparent: true,
    opacity: 0.75, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true,
  }));
  world.add(particles);

  // --- depth grid receding into the distance
  const grid = new GridHelper(46, 46, 0x4d7cff, 0x4d7cff);
  grid.position.set(0, -4.2, -6);
  grid.material.transparent = true;
  grid.material.opacity = 0.13;
  grid.material.depthWrite = false;
  world.add(grid);

  // --- EU star ring: 12 gold stars (no ring line) arranged around the circular portrait
  const starShape = new Shape();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? 0.42 : 1;
    const x = Math.cos(ang) * rad, y = Math.sin(ang) * rad;
    if (i) starShape.lineTo(x, y); else starShape.moveTo(x, y);
  }
  starShape.closePath();
  const starGeo = new ShapeGeometry(starShape);
  const starMat = new MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.85, side: DoubleSide });
  const halo = new Group();   // faces the viewer, positioned over the portrait
  const orbit = new Group();  // rotates steadily in its own plane
  halo.add(orbit);
  const stars = [];
  for (let i = 0; i < 12; i++) {
    const m = new Mesh(starGeo, starMat);
    m.userData.a = (i / 12) * Math.PI * 2;
    m.position.set(Math.cos(m.userData.a), Math.sin(m.userData.a), 0);
    m.scale.setScalar(0.085);
    orbit.add(m);
    stars.push(m);
  }
  ringScene.add(halo);

  // place + size the ring from the portrait's real on-screen box
  function layoutRing(w, h) {
    const frame = hero.querySelector('.hero-photo-frame');
    if (!frame) { halo.visible = false; return; }
    const hr = hero.getBoundingClientRect(), fr = frame.getBoundingClientRect();
    const worldPerPx = (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z) / h;
    const cx = fr.left + fr.width / 2 - hr.left;
    const cy = fr.top + fr.height / 2 - hr.top;
    const R = Math.max(fr.width, fr.height) * (small ? 0.66 : 0.64) * worldPerPx;
    halo.position.set((cx - w / 2) * worldPerPx, -(cy - h / 2) * worldPerPx, 0);
    halo.scale.setScalar(R);
    halo.visible = true;
  }

  // --- pointer parallax (smoothed)
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  let running = false, raf = 0, last = performance.now(), visible = true;
  function draw() {
    renderer.clear();
    renderer.render(scene, camera);
    renderer.render(ringScene, ringCamera);
  }

  // --- sizing (ResizeObserver — also fires once on mount)
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    ringCamera.aspect = w / h;
    ringCamera.updateProjectionMatrix();
    layoutRing(w, h);
    if (!running) draw();
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    cur.x += (target.x - cur.x) * Math.min(dt * 2.5, 1);
    cur.y += (target.y - cur.y) * Math.min(dt * 2.5, 1);
    camera.position.x = cur.x * 0.7;
    camera.position.y = -cur.y * 0.4;
    camera.lookAt(0, 0, 0);
    particles.rotation.y += dt * 0.012;
    particles.position.y = Math.sin(now * 0.00018) * 0.18;
    // steady circular orbit (~28 s per lap); each star counter-rotates so it stays upright
    orbit.rotation.z += dt * 0.22;
    for (const m of stars) m.rotation.z = -orbit.rotation.z;
    draw();
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || reduced || !visible || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); }

  new ResizeObserver(resize).observe(hero);
  resize();
  draw();
  const reveal = () => canvas.classList.add('is-ready');
  requestAnimationFrame(reveal);
  setTimeout(reveal, 120); // rAF is throttled in background tabs — never leave the canvas invisible

  // only animate while the hero is on screen and the tab is visible
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  start();
}
