import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const BRAND = 'Prohostix';
const FONT = '"Inter","Segoe UI",Helvetica,Arial,sans-serif';
const G = '#169B68', G2 = '#3fd49a', TX = '#e9f0f2', MU = '#7e8a92';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (a, b, x) => clamp((x - a) / (b - a));
const sm = (a, b, x) => { const t = seg(a, b, x); return t * t * (3 - 2 * t); };
const ease2 = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function kf(p, k) {
  if (p <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    if (p <= k[i][0]) return lerp(k[i - 1][1], k[i][1], sm(k[i - 1][0], k[i][0], p));
  }
  return k[k.length - 1][1];
}
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };

/* ---------- logo (exact geometry from supplied 1080px artwork) ---------- */
function drawLogo(c, size, sweep) {
  const k = size / 1024 * 1.2;
  c.save();
  c.clearRect(0, 0, size, size);
  c.translate(size / 2, size / 2);
  c.scale(k, k);
  c.translate(-528, -550);
  c.fillStyle = '#ffffff';
  c.fillRect(292, 513, 472, 72);
  c.fillStyle = '#169B68';
  for (const [x, y] of [[528, 312], [528, 788], [292, 551], [764, 551]]) {
    c.beginPath(); c.arc(x, y, 114, 0, Math.PI * 2); c.fill();
  }
  c.restore();
  if (sweep >= 0) {
    c.save();
    c.globalCompositeOperation = 'source-atop';
    const x = lerp(-0.2, 1.2, sweep) * size;
    const g = c.createLinearGradient(x - size * 0.18, 0, x + size * 0.18, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.restore();
  }
}

/* ---------- renderer / scene ---------- */
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x000000, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const pm = new THREE.PMREMGenerator(renderer);
let envTex;
{
  const es = new THREE.Scene(); es.background = new THREE.Color(0x000000);
  const sb = (w, h, x, y, z, v) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(v, v, v), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
  sb(9, 2.2, 0, 10, 3, 14); sb(1.2, 12, -10, 3, 0, 12); sb(1.2, 12, 10, 3, 0, 12); sb(10, 1.2, 0, 3, -10, 10); sb(8, 0.8, 0, 1.5, 11, 5);
  envTex = pm.fromScene(es, 0.02).texture; scene.environment = envTex;
}
scene.environmentIntensity = 0;
const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);

const rimL = new THREE.DirectionalLight(0xdfe8ff, 0); rimL.position.set(-7, 6, -5);
const rimR = new THREE.DirectionalLight(0xdfe8ff, 0); rimR.position.set(7, 6, -5);
const key = new THREE.DirectionalLight(0xffffff, 0); key.position.set(0, 7, 7);
const front = new THREE.DirectionalLight(0xffffff, 0); front.position.set(0, 1, 9);
scene.add(rimL, rimR, key, front);

/* ---------- laptop ---------- */
const W = 3.2, D = 2.26, BH = 0.155, LT = 0.06;
function slab(w, d, h, r, bv) {
  const iw = w - 2 * bv, id = d - 2 * bv, ir = Math.max(r - bv, 0.01), x = -iw / 2, y = -id / 2, sh = new THREE.Shape();
  sh.moveTo(x + ir, y); sh.lineTo(x + iw - ir, y); sh.absarc(x + iw - ir, y + ir, ir, -Math.PI / 2, 0, false);
  sh.lineTo(x + iw, y + id - ir); sh.absarc(x + iw - ir, y + id - ir, ir, 0, Math.PI / 2, false);
  sh.lineTo(x + ir, y + id); sh.absarc(x + ir, y + id - ir, ir, Math.PI / 2, Math.PI, false);
  sh.lineTo(x, y + ir); sh.absarc(x + ir, y + ir, ir, Math.PI, Math.PI * 1.5, false);
  let g = new THREE.ExtrudeGeometry(sh, { depth: h - 2 * bv, bevelEnabled: true, bevelThickness: bv, bevelSize: bv, bevelSegments: 8, curveSegments: 32 });
  g.rotateX(-Math.PI / 2); g.deleteAttribute('uv'); g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-4); g.computeBoundingBox();
  const bb = g.boundingBox;
  g.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
  g.scale(w / (bb.max.x - bb.min.x), h / (bb.max.y - bb.min.y), d / (bb.max.z - bb.min.z));
  g.computeVertexNormals();
  return g;
}
const metal = new THREE.MeshPhysicalMaterial({ color: 0x222427, metalness: 1, roughness: 0.38, clearcoat: 0.15, clearcoatRoughness: 0.4 });
const deckMat = new THREE.MeshStandardMaterial({ color: 0x040405, metalness: 0.2, roughness: 0.75 });
const keyMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, metalness: 0.1, roughness: 0.5 });
const padMat = new THREE.MeshPhysicalMaterial({ color: 0x2c2e32, metalness: 1, roughness: 0.34, clearcoat: 0.3, clearcoatRoughness: 0.25 });

const laptop = new THREE.Group(); scene.add(laptop);
const TOP = BH / 2;
laptop.add(new THREE.Mesh(slab(W, D, BH, 0.15, 0.04), metal));

// keyboard well
function rrShape(w, d, r) {
  const sh = new THREE.Shape(), x = -w / 2, y = -d / 2;
  sh.moveTo(x + r, y); sh.lineTo(x + w - r, y); sh.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  sh.lineTo(x + w, y + d - r); sh.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
  sh.lineTo(x + r, y + d); sh.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
  sh.lineTo(x, y + r); sh.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false); return sh;
}
const well = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(2.98, 1.2, 0.05), 16), deckMat);
well.rotation.x = -Math.PI / 2; well.position.set(0, TOP + 0.0009, -0.43); laptop.add(well);

// keys
const U = 0.19, KX0 = -1.425;
const ROWS = [
  { z: -0.9125, h: 0.115, k: [['esc', 1.071], ...Array.from({ length: 12 }, (_, i) => ['F' + (i + 1), 1.071]), ['●', 1.071]] },
  { z: -0.75, h: 0.17, k: [...'`1234567890-='.split('').map(c => [c, 1]), ['delete', 2]] },
  { z: -0.56, h: 0.17, k: [['tab', 1.5], ...'QWERTYUIOP[]'.split('').map(c => [c, 1]), ['\\', 1.5]] },
  { z: -0.37, h: 0.17, k: [['caps', 1.75], ...`ASDFGHJKL;'`.split('').map(c => [c, 1]), ['return', 2.25]] },
  { z: -0.18, h: 0.17, k: [['shift', 2.25], ...'ZXCVBNM,./'.split('').map(c => [c, 1]), ['shift', 2.75]] },
  { z: 0.01, h: 0.17, k: [['fn', 1], ['ctrl', 1], ['opt', 1], ['cmd', 1.25], ['', 5.5], ['cmd', 1.25], ['opt', 1], ['◀', 1], ['▲▼', 1], ['▶', 1]] }
];
const keyList = [];
ROWS.forEach(r => { let x = KX0; r.k.forEach(([lab, w]) => {
  const kw = w * U - 0.02;
  if (lab === '▲▼') { keyList.push({ x: x + w * U / 2, z: r.z - 0.043, w: kw, h: 0.082, lab: '▲' }); keyList.push({ x: x + w * U / 2, z: r.z + 0.043, w: kw, h: 0.082, lab: '▼' }); }
  else keyList.push({ x: x + w * U / 2, z: r.z, w: kw, h: r.h - 0.0, lab });
  x += w * U; }); });
const keys = new THREE.InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 3, 0.14), keyMat, keyList.length);
{
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
  keyList.forEach((k, i) => { sc.set(k.w, 0.022, k.h); ps.set(k.x, TOP + 0.0009 + 0.011, k.z); m.compose(ps, q, sc); keys.setMatrixAt(i, m); });
}
laptop.add(keys);
// key legends
{
  const lc = mk(2400, 960), c = lc.getContext('2d'), PX = 800;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  keyList.forEach(k => {
    const cx = (k.x + 1.5) * PX, cy = (k.z + 1.0) * PX;
    const big = k.lab.length === 1;
    c.fillStyle = 'rgba(205,210,216,.88)';
    c.font = `${big ? 500 : 500} ${big ? 40 : k.lab.length > 3 ? 20 : 24}px ${FONT}`;
    if (k.lab.length > 1 && k.h < 0.12 && /^F\d|esc|●/.test(k.lab)) c.font = `500 20px ${FONT}`;
    c.fillText(k.lab, cx, cy + 1);
  });
  const t = new THREE.CanvasTexture(lc); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  const leg = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  leg.rotation.x = -Math.PI / 2; leg.position.set(0, TOP + 0.0009 + 0.0224, -0.4); laptop.add(leg);
}
// speaker grilles
{
  const gc = mk(128, 1024), c = gc.getContext('2d'); c.fillStyle = 'rgba(0,0,0,.92)';
  for (let y = 10; y < 1024; y += 14) for (let x = 10 + ((y / 14) % 2) * 7; x < 128; x += 14) { c.beginPath(); c.arc(x, y, 3.4, 0, 7); c.fill(); }
  const t = new THREE.CanvasTexture(gc); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  for (const sx of [-1, 1]) {
    const g = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.9), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
    g.rotation.x = -Math.PI / 2; g.position.set(sx * 1.535, TOP + 0.001, -0.46); laptop.add(g);
  }
}
// trackpad
const tp = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(1.34, 0.84, 0.03), { depth: 0.002, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.0012, bevelSegments: 3, curveSegments: 16 }), padMat);
tp.rotation.x = -Math.PI / 2; tp.position.set(0, TOP + 0.0004, 0.6); laptop.add(tp);
// hinge
const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 2.6, 32), new THREE.MeshStandardMaterial({ color: 0x070708, metalness: 1, roughness: 0.5 }));
hinge.rotation.z = Math.PI / 2; hinge.position.set(0, TOP + 0.012, -1.1); laptop.add(hinge);

const lid = new THREE.Group(); lid.position.set(0, TOP, -1.1); laptop.add(lid);
const shell = new THREE.Mesh(slab(W, D, LT, 0.15, 0.024), metal);
shell.position.set(0, LT / 2, D / 2 - 0.03); lid.add(shell);

const logoCv = mk(1024, 1024); const lctx = logoCv.getContext('2d');
const logoTex = new THREE.CanvasTexture(logoCv); logoTex.colorSpace = THREE.SRGBColorSpace; logoTex.anisotropy = 16;
const logoMat = new THREE.MeshStandardMaterial({
  map: logoTex, emissiveMap: logoTex, emissive: 0xffffff, emissiveIntensity: 1,
  transparent: true, metalness: 0.15, roughness: 0.45, polygonOffset: true, polygonOffsetFactor: -2
});
const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), logoMat);
logo.rotation.x = -Math.PI / 2; logo.position.set(0, LT + 0.0008, D / 2 - 0.03); lid.add(logo);

const SW = 1600, SH = 1121;
const scCv = mk(SW, SH); const sctx = scCv.getContext('2d');
const scTex = new THREE.CanvasTexture(scCv); scTex.colorSpace = THREE.SRGBColorSpace; scTex.anisotropy = 16;
const scMat = new THREE.MeshBasicMaterial({ map: scTex, transparent: true });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 2.2), scMat);
screen.rotation.x = Math.PI / 2; screen.position.set(0, -0.0006, D / 2 - 0.03); lid.add(screen);
const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 2.2), new THREE.MeshStandardMaterial({
  color: 0x000000, metalness: 0, roughness: 0.06, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, envMap: envTex, envMapIntensity: 0.18 }));
glass.rotation.x = Math.PI / 2; glass.position.set(0, -0.0012, D / 2 - 0.03); lid.add(glass);
const screenLight = new THREE.PointLight(0xdcefe8, 0, 7, 2); screenLight.position.set(0, -0.7, D / 2 - 0.03); lid.add(screenLight);
const screenMarker = new THREE.Object3D(); screenMarker.position.set(0, -0.05, D / 2 - 0.03); lid.add(screenMarker);

/* ---------- UI drawing helpers ---------- */
function kpi(c, x, y, w, h, label, val, delta) {
  c.fillStyle = '#12181c'; rr(c, x, y, w, h, 10); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 1.5; c.stroke();
  c.fillStyle = MU; c.font = `500 ${h * 0.2}px ${FONT}`; c.textAlign = 'left'; c.fillText(label, x + w * 0.07, y + h * 0.3);
  c.fillStyle = TX; c.font = `700 ${h * 0.38}px ${FONT}`; c.fillText(val, x + w * 0.07, y + h * 0.7);
  c.fillStyle = G2; c.font = `600 ${h * 0.18}px ${FONT}`; c.fillText(delta, x + w * 0.07, y + h * 0.91);
}
function line(c, x, y, w, h, seed, col = G2) {
  c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 1;
  for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(x, y + h * i / 3); c.lineTo(x + w, y + h * i / 3); c.stroke(); }
  const pts = []; for (let i = 0; i < 12; i++) pts.push(0.25 + 0.55 * (i / 11) + (hsh(seed + i) - 0.5) * 0.28);
  c.beginPath();
  pts.forEach((v, i) => { const px = x + w * i / 11, py = y + h * (1 - clamp(v, 0.05, 0.98)); i ? c.lineTo(px, py) : c.moveTo(px, py); });
  const grad = c.createLinearGradient(0, y, 0, y + h); grad.addColorStop(0, 'rgba(63,212,154,.35)'); grad.addColorStop(1, 'rgba(63,212,154,0)');
  c.strokeStyle = col; c.lineWidth = 3; c.stroke();
  c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); c.fillStyle = grad; c.fill();
}
function bars(c, x, y, w, h, seed, n = 9) {
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const v = 0.25 + 0.7 * hsh(seed + i * 3);
    c.fillStyle = i % 3 === 2 ? G2 : G; rr(c, x + i * bw + bw * 0.15, y + h * (1 - v), bw * 0.7, h * v, 4); c.fill();
  }
}
function donut(c, x, y, r, parts) {
  let a = -Math.PI / 2; const cols = [G, G2, '#9fe6c8', '#2a3a35'];
  parts.forEach((v, i) => { c.beginPath(); c.arc(x, y, r, a, a + v * Math.PI * 2); c.strokeStyle = cols[i % 4]; c.lineWidth = r * 0.28; c.stroke(); a += v * Math.PI * 2 + 0.04; });
}
function pill(c, x, y, w, h, col, txt) {
  c.fillStyle = col; rr(c, x, y, w, h, h / 2); c.fill();
  c.fillStyle = '#04120c'; c.font = `700 ${h * 0.55}px ${FONT}`; c.textAlign = 'center'; c.fillText(txt, x + w / 2, y + h * 0.72); c.textAlign = 'left';
}
function bar(c, x, y, w, h, col, v) { c.fillStyle = 'rgba(255,255,255,.07)'; rr(c, x, y, w, h, h / 2); c.fill(); c.fillStyle = col; rr(c, x, y, w * v, h, h / 2); c.fill(); }
function txt(c, s, x, y, size, col = TX, wgt = 600) { c.fillStyle = col; c.font = `${wgt} ${size}px ${FONT}`; c.textAlign = 'left'; c.fillText(s, x, y); }

/* ---------- screen dashboard (a = assembly 0..1) ---------- */
function drawDash(c, x, y, w, h, a) {
  const R = i => sm(i * 0.07, i * 0.07 + 0.28, a), up = (i, fn) => { const r = R(i); c.save(); c.globalAlpha = r; c.translate(0, (1 - r) * 22); fn(); c.restore(); };
  const acc = G2, SB = 250, cx = x + SB + 24, cw = w - SB - 48;
  c.fillStyle = '#080c0f'; c.fillRect(x, y, w, h);
  up(0, () => {
    c.fillStyle = '#0c1115'; c.fillRect(x, y, SB, h); c.strokeStyle = LN; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + SB, y); c.lineTo(x + SB, y + h); c.stroke();
    c.drawImage(logoSmall, x + 22, y + 24, 56, 56); txt(c, 'Prohostix', x + 92, y + 63, 30, TX, 800);
    ['Overview', 'Customers', 'Sales', 'Projects', 'Analytics', 'Messages', 'Automations', 'Settings'].forEach((t, i) => {
      const yy = y + 118 + i * 62;
      if (i === 0) { c.fillStyle = 'rgba(22,155,104,.2)'; rr(c, x + 14, yy - 6, SB - 28, 52, 12); c.fill(); }
      c.fillStyle = i === 0 ? acc : '#47545b'; rr(c, x + 32, yy + 8, 22, 22, 6); c.fill();
      txt(c, t, x + 72, yy + 31, 25, i === 0 ? TX : '#8b98a0', i === 0 ? 700 : 500);
    });
    card(c, x + 14, y + h - 100, SB - 28, 80, 14); avatar(c, x + 52, y + h - 60, 22, 0); txt(c, 'Aarav N.', x + 86, y + h - 62, 22, TX, 700); txt(c, 'Admin', x + 86, y + h - 36, 18, MU, 500);
  });
  up(1, () => {
    txt(c, 'Business Overview', cx, y + 58, 42, TX, 800); txt(c, 'All products  ·  November 2026', cx, y + 90, 22, MU, 500);
    card(c, cx + cw - 420, y + 26, 250, 56, 28); txt(c, 'This month  ▾', cx + cw - 396, y + 62, 23, TX, 600);
    card(c, cx + cw - 156, y + 26, 156, 56, 28); txt(c, 'Export', cx + cw - 112, y + 62, 23, acc, 700);
  });
  const kw = (cw - 3 * 16) / 4;
  [['Revenue', '₹12.4L', '▲ 18.2%'], ['Active leads', '1,248', '▲ 9.6%'], ['Open projects', '37', '▲ 4 new'], ['Conversion', '24.8%', '▲ 2.1%']].forEach((k, i) => up(2 + i * 0.5, () => {
    const kx = cx + i * (kw + 16); card(c, kx, y + 120, kw, 150);
    txt(c, k[0], kx + 20, y + 158, 21, MU, 600); txt(c, k[1], kx + 20, y + 214, 48, TX, 800); txt(c, k[2], kx + 20, y + 250, 21, acc, 700); spark(c, kx + kw - 110, y + 196, 88, 48, i * 5 + 2, acc);
  }));
  const cwL = 780, cwR = cw - cwL - 16, r2 = y + 290;
  up(4.5, () => {
    card(c, cx, r2, cwL, 330); txt(c, 'Revenue trend', cx + 24, r2 + 48, 27, TX, 700);
    c.fillStyle = acc; c.beginPath(); c.arc(cx + cwL - 230, r2 + 40, 6, 0, 7); c.fill(); txt(c, 'This year', cx + cwL - 216, r2 + 47, 19, MU, 500);
    c.fillStyle = '#47545b'; c.beginPath(); c.arc(cx + cwL - 120, r2 + 40, 6, 0, 7); c.fill(); txt(c, 'Last year', cx + cwL - 106, r2 + 47, 19, MU, 500);
    ['₹4L', '₹8L', '₹12L'].forEach((t, i) => txt(c, t, cx + 20, r2 + 242 - i * 62 + 6, 17, MU, 500));
    line(c, cx + 74, r2 + 74, cwL - 100, 190, 7); ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].forEach((m, i) => txt(c, m, cx + 66 + (cwL - 100) * i / 5, r2 + 306, 18, MU, 500));
  });
  up(5.2, () => {
    card(c, cx + cwL + 16, r2, cwR, 330); txt(c, 'Lead sources', cx + cwL + 40, r2 + 48, 27, TX, 700);
    donut(c, cx + cwL + 16 + 110, r2 + 190, 70, [0.42, 0.28, 0.2, 0.1]); txt(c, '1,248', cx + cwL + 16 + 76, r2 + 200, 28, TX, 800);
    [['Website', '42%'], ['Referral', '28%'], ['Ads', '20%'], ['Other', '10%']].forEach((t, i) => { c.fillStyle = [G, G2, '#9fe6c8', '#2a3a35'][i]; c.fillRect(cx + cwL + 16 + 220, r2 + 122 + i * 46, 14, 14); txt(c, t[0], cx + cwL + 16 + 244, r2 + 136 + i * 46, 21, '#b9c3c9', 500); txt(c, t[1], cx + cwL + 16 + 340, r2 + 136 + i * 46, 21, TX, 700); });
  });
  const r3 = y + 636;
  up(6, () => {
    card(c, cx, r3, cwL, 360); txt(c, 'Recent activity', cx + 24, r3 + 48, 27, TX, 700);
    [['Aarav Nair', 'Proposal sent', '₹58,000', 'Won'], ['Meera Menon', 'Demo booked', '₹24,000', 'New'], ['Rohit Kumar', 'Invoice paid', '₹84,000', 'Paid']].forEach((r, i) => {
      const yy = r3 + 72 + i * 92; c.strokeStyle = LN; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx + 18, yy); c.lineTo(cx + cwL - 18, yy); c.stroke();
      avatar(c, cx + 56, yy + 46, 26, i); txt(c, r[0], cx + 100, yy + 42, 25, TX, 700); txt(c, r[1], cx + 100, yy + 72, 20, MU, 500);
      txt(c, r[2], cx + 480, yy + 56, 25, TX, 700); pill(c, cx + cwL - 150, yy + 26, 120, 40, [acc, '#f2c14e', '#9fe6c8'][i], r[3]);
    });
  });
  up(6.7, () => {
    card(c, cx + cwL + 16, r3, cwR, 360); txt(c, 'Sales pipeline', cx + cwL + 40, r3 + 48, 27, TX, 700);
    [['Leads', 1248, 1], ['Qualified', 642, 0.72], ['Proposal', 318, 0.5], ['Won', 121, 0.3]].forEach((r, i) => {
      const yy = r3 + 92 + i * 66; txt(c, r[0], cx + cwL + 40, yy + 20, 21, MU, 600); bar(c, cx + cwL + 150, yy + 2, cwR - 270, 22, i === 3 ? acc : G, r[2]); txt(c, String(r[1]), cx + cwL + cwR - 100, yy + 22, 22, TX, 800);
    });
  });
}

/* ---------- screen timeline ---------- */
const logoSmall = mk(512, 512); drawLogo(logoSmall.getContext('2d'), 512, -1);
function glitch(c, x, y, w, h, u, wins) {
  for (const [a, b] of wins) {
    if (u < a || u > b) continue;
    const f = Math.floor(u * 500);
    for (let i = 0; i < 6; i++) {
      const sy = y + hsh(f + i * 7) * h, sh = 6 + hsh(f + i * 13) * 40, off = (hsh(f + i * 3) - 0.5) * 70;
      c.drawImage(scCv, x, sy, w, sh, x + off, sy, w, sh);
    }
  }
}
/* ---------- product pages (scrolling UIs) ---------- */
const K = 1.35, PWID = 1540 / K, PHGT = 2300, CARD = '#11171b', LN = 'rgba(255,255,255,.08)';
const NM = ['Aarav Nair', 'Meera Menon', 'Rohit Kumar', 'Sana Fathima', 'Vikram Das', 'Anjali Rao', 'Nikhil Raj', 'Fathima K'];
const AVC = ['#3fd49a', '#f2c14e', '#ff7a59', '#4cc9f0', '#9fe6c8', '#e0b84c'];
function avatar(c, x, y, r, i) { c.fillStyle = AVC[i % AVC.length]; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = '#06130e'; c.font = `800 ${r * 0.95}px ${FONT}`; c.textAlign = 'center'; c.fillText(NM[i % NM.length][0], x, y + r * 0.34); c.textAlign = 'left'; }
function card(c, x, y, w, h, r = 16) { c.fillStyle = CARD; rr(c, x, y, w, h, r); c.fill(); c.strokeStyle = LN; c.lineWidth = 1.5; c.stroke(); }
function secTitle(c, t, y, acc) { c.fillStyle = acc; rr(c, 30, y - 30, 7, 38, 3); c.fill(); txt(c, t, 52, y, 38, TX, 700); return y + 36; }
function spark(c, x, y, w, h, seed, col) {
  c.beginPath(); for (let i = 0; i < 10; i++) { const v = 0.2 + 0.7 * (i / 9) + (hsh(seed + i) - 0.5) * 0.35, px = x + w * i / 9, py = y + h * (1 - clamp(v, 0.05, 1)); i ? c.lineTo(px, py) : c.moveTo(px, py); }
  c.strokeStyle = col; c.lineWidth = 3; c.stroke();
}
function tiles(c, y, items, acc) {
  const n = items.length, g = 14, w = (PWID - 60 - (n - 1) * g) / n;
  items.forEach((it, i) => { const x = 30 + i * (w + g); card(c, x, y, w, 150);
    txt(c, it[0], x + 18, y + 38, 20, MU, 600); txt(c, it[1], x + 18, y + 92, 46, TX, 800); txt(c, it[2], x + 18, y + 130, 19, acc, 700); });
  return y + 180;
}
function table(c, y, cols, rows, acc, ws) {
  const x0 = 30, w = PWID - 60, rh = 74; card(c, x0, y, w, 78 + rows.length * rh);
  let x = x0 + 24; cols.forEach((h, i) => { txt(c, h.toUpperCase(), x, y + 48, 19, MU, 700); x += ws[i] * (w - 48); });
  rows.forEach((r, j) => {
    const yy = y + 78 + j * rh; c.strokeStyle = LN; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0 + 16, yy); c.lineTo(x0 + w - 16, yy); c.stroke();
    let xx = x0 + 24;
    r.forEach((v, i) => {
      if (cols[i] === 'Status') pill(c, xx, yy + 16, 150, 40, [acc, '#f2c14e', '#9fe6c8'][j % 3], v);
      else { if (i === 0) { avatar(c, xx + 18, yy + 37, 18, j + 1); txt(c, v, xx + 48, yy + 46, 26, TX, 700); } else txt(c, v, xx, yy + 46, 26, '#b9c3c9', 500); }
      xx += ws[i] * (w - 48);
    });
  });
  return y + 78 + rows.length * rh + 40;
}
function grid(c, y, items, acc) {
  const cols = 2, g = 20, w = (PWID - 60 - (cols - 1) * g) / cols, h = 270;
  items.forEach((it, i) => {
    const x = 30 + (i % cols) * (w + g), yy = y + Math.floor(i / cols) * (h + g);
    card(c, x, yy, w, h);
    const gr = c.createLinearGradient(x, yy, x + w, yy + 130); gr.addColorStop(0, acc); gr.addColorStop(1, '#0b1f1a');
    c.fillStyle = gr; rr(c, x + 12, yy + 12, w - 24, 120, 12); c.fill();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.font = `800 90px ${FONT}`; c.fillText(it[0][0], x + w - 100, yy + 112);
    c.fillStyle = 'rgba(0,0,0,.35)'; rr(c, x + 24, yy + 24, 110, 32, 16); c.fill(); txt(c, it[3] || 'Popular', x + 38, yy + 47, 18, '#fff', 700);
    txt(c, it[0], x + 24, yy + 172, 32, TX, 800); txt(c, it[1], x + 24, yy + 206, 22, MU, 500); bar(c, x + 24, yy + 228, w - 90, 10, acc, it[2]); txt(c, Math.round(it[2] * 100) + '%', x + w - 56, yy + 240, 20, TX, 700);
  });
  return y + Math.ceil(items.length / cols) * (h + g) + 10;
}
function kanban(c, y, cols, acc, data) {
  const g = 14, w = (PWID - 60 - (cols.length - 1) * g) / cols.length, ch = 470;
  cols.forEach((h, i) => {
    const x = 30 + i * (w + g); card(c, x, y, w, ch); txt(c, h, x + 16, y + 44, 25, TX, 700); pill(c, x + w - 62, y + 18, 46, 34, acc, String(data[i].length + 4));
    data[i].forEach((d, j) => { const yy = y + 72 + j * 130; c.fillStyle = '#182126'; rr(c, x + 10, yy, w - 20, 118, 12); c.fill();
      avatar(c, x + 40, yy + 36, 20, i + j); txt(c, d[0], x + 70, yy + 36, 23, TX, 700); txt(c, d[1], x + 70, yy + 64, 18, MU, 500);
      c.fillStyle = acc; c.font = `800 24px ${FONT}`; c.fillText(d[2], x + 20, yy + 100); });
  });
  return y + ch + 40;
}
function inbox(c, y, rows, acc) {
  card(c, 30, y, PWID - 60, rows.length * 112 + 16);
  rows.forEach((r, i) => { const yy = y + 12 + i * 112;
    avatar(c, 84, yy + 50, 32, i); txt(c, r[0], 134, yy + 44, 29, TX, 700); txt(c, r[1], 134, yy + 80, 23, '#9fabb2', 500);
    pill(c, PWID - 210, yy + 16, 150, 38, acc, r[2]); txt(c, r[3], PWID - 200, yy + 84, 20, MU, 500);
    if (i) { c.strokeStyle = LN; c.beginPath(); c.moveTo(56, yy - 4); c.lineTo(PWID - 56, yy - 4); c.stroke(); } });
  return y + rows.length * 112 + 56;
}
function chartRow(c, y, acc, t1 = 'Performance', t2 = 'By category') {
  const w1 = (PWID - 60) * 0.58, w2 = PWID - 60 - w1 - 16;
  card(c, 30, y, w1, 400); txt(c, t1, 52, y + 50, 28, TX, 700); line(c, 70, y + 80, w1 - 64, 250, y, acc);
  ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].forEach((m, i) => txt(c, m, 70 + (w1 - 64) * i / 5 - 12, y + 372, 19, MU, 500));
  card(c, 30 + w1 + 16, y, w2, 400); txt(c, t2, 52 + w1 + 16, y + 50, 28, TX, 700); bars(c, 52 + w1 + 16, y + 80, w2 - 44, 250, y + 5, 6);
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach((m, i) => txt(c, m, 52 + w1 + 16 + (w2 - 44) * (i + 0.5) / 6 - 6, y + 372, 19, MU, 500));
  return y + 450;
}
function modules(c, y, names, acc) {
  const cols = 2, g = 16, w = (PWID - 60 - g) / cols, h = 110;
  names.forEach((n, i) => { const x = 30 + (i % cols) * (w + g), yy = y + Math.floor(i / cols) * (h + g); card(c, x, yy, w, h);
    c.fillStyle = acc; rr(c, x + 20, yy + 22, 66, 66, 16); c.fill(); c.fillStyle = '#06130e'; c.font = `800 38px ${FONT}`; c.textAlign = 'center'; c.fillText(n[0], x + 53, yy + 66); c.textAlign = 'left';
    txt(c, n, x + 106, yy + 54, 30, TX, 700); txt(c, (12 + i * 7) + ' active items', x + 106, yy + 86, 20, MU, 500); });
  return y + Math.ceil(names.length / cols) * (h + g) + 30;
}
function chatBlock(c, y, msgs, acc) {
  card(c, 30, y, PWID - 60, msgs.length * 124 + 30);
  msgs.forEach((m, i) => { const yy = y + 20 + i * 124, w = 640, x = m[1] ? PWID - 60 - w : 50;
    c.fillStyle = m[1] ? '#0d5b3f' : '#1c262b'; rr(c, x, yy, w, 104, 20); c.fill();
    txt(c, m[0], x + 24, yy + 46, 25, TX, 600); txt(c, m[2], x + w - 96, yy + 90, 18, '#9fb0b6', 500); if (m[1]) txt(c, '✓✓', x + w - 54, yy + 90, 18, '#53bdeb', 700); });
  return y + msgs.length * 124 + 70;
}
function wrap(c, t, x, y, maxw, size, col, lh, wgt = 800) {
  c.fillStyle = col; c.font = `${wgt} ${size}px ${FONT}`; let line = '', yy = y;
  t.split(' ').forEach(w => { const test = line + w + ' '; if (c.measureText(test).width > maxw && line) { c.fillText(line, x, yy); line = w + ' '; yy += lh; } else line = test; });
  c.fillText(line, x, yy); return yy;
}
const ALL_PRODUCTS = [
  ['Pype CRM', 'Every lead. Every chat. One pipeline.', '#3fd49a', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['New leads', '248', '▲ 14%'], ['Reply rate', '91%', '▲ 6%'], ['Meetings', '36', '▲ 9'], ['Won', '₹4.8L', '▲ 18%']], a);
    y = secTitle(c, 'Unified inbox', y + 20, a) + 14;
    return inbox(c, y, [['Aarav Nair', 'Interested in the course. Can we talk today?', 'WhatsApp', '2 min ago'], ['Meera Menon', 'Please share the fee details', 'Instagram', '14 min ago']], a); }],
  ['SkillDad', 'Learn. Practise. Get hired.', '#f2a93b', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Learners', '12.4K', '▲ 11%'], ['Live now', '18', 'Classes'], ['Completion', '78%', '▲ 4%'], ['Enrolled', '1,206', '▲ 22%']], a);
    y = secTitle(c, 'Live classes today', y + 20, a) + 14;
    return table(c, y, ['Class', 'Mentor', 'Time', 'Status'], [['SEO Basics', 'Mentor A', '10:00', 'Live now'], ['Excel for Work', 'Mentor B', '12:30', 'Starting']], a, [0.34, 0.24, 0.14, 0.28]); }],
  ['Collabo', 'A marketplace where sellers fulfil their own orders.', '#ff7a59', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Orders', '3,416', '▲ 7%'], ['Vendors', '184', '▲ 12'], ['GMV', '₹18.2L', '▲ 15%'], ['Returns', '2.1%', '▼ 0.4%']], a);
    y = secTitle(c, 'Recent orders', y + 20, a) + 14;
    return table(c, y, ['Order', 'Vendor', 'Amount', 'Status'], [['#10482', 'Vendor A', '₹1,299', 'Shipped'], ['#10481', 'Vendor B', '₹499', 'Packed']], a, [0.26, 0.28, 0.2, 0.26]); }],
  ['Pype ERM', 'Run admissions, fees and departments together.', '#4cc9f0', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Students', '4,820', '▲ 5%'], ['Departments', '14', 'Active'], ['Fees', '₹1.2Cr', '▲ 9%'], ['Attendance', '93%', '▲ 2%']], a);
    y = secTitle(c, 'Latest admissions', y + 20, a) + 14;
    return table(c, y, ['Applicant', 'Programme', 'Date', 'Status'], [['Applicant 1', 'B.Com', '04 Nov', 'Approved'], ['Applicant 2', 'MBA', '05 Nov', 'In review']], a, [0.32, 0.22, 0.2, 0.26]); }],
  ['Pype ERP', 'Finance, stock and people in one system.', '#9fe6c8', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Revenue', '₹42.6L', '▲ 12%'], ['Invoices', '38', 'Open'], ['Stock', '₹18.9L', '▲ 3%'], ['Team', '72', '▲ 4']], a);
    y = secTitle(c, 'Invoices', y + 20, a) + 14;
    return table(c, y, ['Invoice', 'Client', 'Amount', 'Status'], [['INV-2041', 'Client A', '₹84,000', 'Paid'], ['INV-2042', 'Client B', '₹1.12L', 'Pending']], a, [0.28, 0.24, 0.22, 0.26]); }],
  ['Pype LMS', 'Courses, assignments and progress in one place.', '#7bd88f', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Learners', '2,940', '▲ 8%'], ['Courses', '36', '4 new'], ['Due', '18', 'Assignments'], ['Avg score', '82%', '▲ 3%']], a);
    y = secTitle(c, 'Assignments due', y + 20, a) + 14;
    return table(c, y, ['Assignment', 'Course', 'Due', 'Status'], [['Case study', 'Business', 'Today', 'Pending'], ['Quiz 3', 'Python', 'Tomorrow', 'Open']], a, [0.3, 0.28, 0.18, 0.24]); }],
  ['Pype UMS', 'One platform for the whole university.', '#e0b84c', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Applications', '6,240', '▲ 16%'], ['Enrolled', '4,102', '▲ 7%'], ['Exams', '38', 'This month'], ['Results', '92%', '▲ 5%']], a);
    y = secTitle(c, 'Exam schedule', y + 20, a) + 14;
    return table(c, y, ['Paper', 'Programme', 'Date', 'Status'], [['Paper 101', 'B.Com Sem 3', '18 Nov', 'Scheduled'], ['Paper 204', 'MBA Sem 1', '19 Nov', 'Scheduled']], a, [0.24, 0.32, 0.18, 0.26]); }],
  ['MOM', 'Meetings and deadlines, managed on WhatsApp.', '#25d366', [], (c, a) => { let y = 170;
    y = tiles(c, y, [['Meetings', '6', 'Today'], ['Actions', '41', '▲ 9 new'], ['Overdue', '3', '▼ 2'], ['On time', '94%', '▲ 6%']], a);
    y = secTitle(c, 'On WhatsApp', y + 20, a) + 14;
    return chatBlock(c, y, [['Reminder: Review meeting at 4:00 PM', 0, '15:30'], ['Joining. Notes will follow.', 1, '15:32']], a); }]
];
const PRODUCTS = [0, 1, 2, 7].map(i => ALL_PRODUCTS[i]); // screens shown one by one
const pageCache = new Map();
function getPage(i) {
  if (pageCache.has(i)) return pageCache.get(i);
  const cv = mk(1540, PHGT), c = cv.getContext('2d'), P = PRODUCTS[i];
  c.fillStyle = '#090d10'; c.fillRect(0, 0, 1540, PHGT);
  c.scale(K, K);
  wrap(c, P[1], 30, 96, PWID - 60, 40, TX, 46);
  const end = P[4](c, P[2]) * K;
  const o = { cv, end };
  pageCache.set(i, o);
  if (pageCache.size > 2) pageCache.delete(pageCache.keys().next().value);
  return o;
}
function glitch2(c, x, y, w, h, seed) {
  for (let i = 0; i < 7; i++) {
    const sy = y + hsh(seed + i * 7) * h, sh = 8 + hsh(seed + i * 13) * 50, off = (hsh(seed + i * 3) - 0.5) * 90;
    c.drawImage(scCv, x, sy, w, sh, x + off, sy, w, sh);
  }
}
function drawEco(c, x, y, w, h, a) {
  c.fillStyle = '#080c0f'; c.fillRect(x, y, w, h);
  const R = i => sm(i * 0.07, i * 0.07 + 0.3, a);
  c.save(); c.globalAlpha = R(0);
  c.drawImage(logoSmall, x + w / 2 - 85, y + 40, 170, 170);
  c.textAlign = 'center'; c.fillStyle = TX; c.font = `800 78px ${FONT}`; c.fillText('Prohostix', x + w / 2, y + 290);
  c.fillStyle = MU; c.font = `500 32px ${FONT}`; c.fillText('One ecosystem of business software', x + w / 2, y + 340); c.textAlign = 'left'; c.restore();
  const cols = 4, g = 26, tw = (w - 80 - (cols - 1) * g) / cols, th = 250, d = ['Leads and chats', 'Learning platform', 'Seller marketplace', 'Enterprise resources', 'Finance, stock, HR', 'Courses and progress', 'Campus management', 'Meetings on WhatsApp'];
  ALL_PRODUCTS.forEach((P, i) => {
    const r = R(1 + i * 0.7); c.save(); c.globalAlpha = r; c.translate(0, (1 - r) * 30);
    const tx = x + 40 + (i % cols) * (tw + g), ty = y + 400 + Math.floor(i / cols) * (th + g);
    card(c, tx, ty, tw, th); c.fillStyle = P[2]; rr(c, tx + 28, ty + 32, 60, 60, 16); c.fill(); c.fillStyle = 'rgba(0,0,0,.35)'; rr(c, tx + 44, ty + 48, 28, 28, 7); c.fill();
    txt(c, P[0], tx + 28, ty + 160, 40, TX, 800); txt(c, d[i], tx + 28, ty + 204, 25, MU, 500); c.restore();
  });
}
const T_LOGO = [0.55, 0.605], T_BOOT = [0.605, 0.645], T_PROD = [0.645, 0.90], T_END = [0.90, 0.97];
function drawScreen(p) {
  const c = sctx, sx = 30, sy = 30, sw = SW - 60, sh = SH - 30 - 74;
  c.clearRect(0, 0, SW, SH); c.fillStyle = '#000'; rr(c, 0, 0, SW, SH, 34); c.fill();
  c.fillStyle = '#9a9ea3'; c.font = `600 27px ${FONT}`; c.textAlign = 'center';
  if ('letterSpacing' in c) c.letterSpacing = '10px';
  c.fillText(BRAND.toUpperCase(), SW / 2 + 5, SH - 28);
  if ('letterSpacing' in c) c.letterSpacing = '0px';
  c.textAlign = 'left';
  c.save(); rr(c, sx, sy, sw, sh, 14); c.clip();
  const g = c.createRadialGradient(SW / 2, SH / 2, 20, SW / 2, SH / 2, 900);
  g.addColorStop(0, '#0d1512'); g.addColorStop(1, '#030505');
  c.fillStyle = g; c.fillRect(sx, sy, sw, sh);
  if (p >= T_LOGO[0]) {
    const lu = seg(T_LOGO[0], T_LOGO[1], p), la = sm(0, 0.35, lu) * (1 - sm(0.7, 1, lu));
    if (la > 0) { c.globalAlpha = la; const s = 360 + 30 * lu; c.drawImage(logoSmall, SW / 2 - s / 2, SH / 2 - s / 2 - 40, s, s); c.globalAlpha = 1; }
    const bu = seg(T_BOOT[0], T_BOOT[1], p), ba = sm(0, 0.2, bu) * (1 - sm(0.8, 1, bu));
    if (ba > 0) { c.globalAlpha = ba; c.drawImage(logoSmall, SW / 2 - 70, SH / 2 - 150, 140, 140);
      txt(c, 'Starting Prohostix workspace', SW / 2 - 200, SH / 2 + 50, 26, MU, 500); bar(c, SW / 2 - 220, SH / 2 + 80, 440, 8, G2, bu); c.globalAlpha = 1; }
    if (p >= T_PROD[0] && p < T_END[0]) {
      const da = seg(T_PROD[0], T_PROD[0] + 0.14, p);
      drawDash(c, sx, sy, sw, sh, da);
      if (da < 0.1) { c.fillStyle = `rgba(160,255,215,${0.16 * (1 - da / 0.1)})`; c.fillRect(sx, sy, sw, sh); glitch2(c, sx, sy, sw, sh, Math.floor(p * 700)); }
    }
    if (p >= T_END[0]) {
      const ou = seg(T_END[0], T_END[1], p); c.globalAlpha = sm(0, 0.15, ou); drawEco(c, sx, sy, sw, sh, ou); c.globalAlpha = 1;
      if (ou < 0.1) glitch2(c, sx, sy, sw, sh, Math.floor(p * 700));
    }
  }
  c.restore();
  c.fillStyle = '#000'; c.beginPath(); c.roundRect(SW / 2 - 130, 0, 260, 50, [0, 0, 18, 18]); c.fill();
  c.fillStyle = '#0c1014'; c.beginPath(); c.arc(SW / 2, 22, 6, 0, 7); c.fill();
  scTex.needsUpdate = true;
}

/* ---------- floating panels ---------- */
const PW = 800, PH = 520;
function panelBase(title) {
  const cv = mk(PW, PH), c = cv.getContext('2d');
  c.fillStyle = 'rgba(12,17,20,.80)'; rr(c, 6, 6, PW - 12, PH - 12, 26); c.fill();
  const g = c.createLinearGradient(0, 0, PW, PH);
  g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(0.35, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(63,212,154,.06)');
  c.fillStyle = g; rr(c, 6, 6, PW - 12, PH - 12, 26); c.fill();
  c.strokeStyle = 'rgba(200,210,215,.55)'; c.lineWidth = 3; rr(c, 6, 6, PW - 12, PH - 12, 26); c.stroke();
  c.fillStyle = G; c.beginPath(); c.arc(46, 52, 10, 0, 7); c.fill();
  txt(c, title, 70, 62, 30, TX, 700);
  c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 2; c.beginPath(); c.moveTo(30, 88); c.lineTo(PW - 30, 88); c.stroke();
  return [cv, c];
}
const PANELS = [
  ['Customer Relationship', c => {
    ['Aarav Nair', 'Meera Menon', 'Rohit Kumar', 'Sana Fathima', 'Vikram Das'].forEach((n, i) => {
      const y = 112 + i * 76; c.fillStyle = '#16201f'; rr(c, 30, y, PW - 60, 62, 12); c.fill();
      c.fillStyle = [G, G2, '#9fe6c8', G, G2][i]; c.beginPath(); c.arc(68, y + 31, 20, 0, 7); c.fill();
      txt(c, n, 106, y + 28, 24); txt(c, 'Last contact · ' + (i + 1) + 'd ago', 106, y + 52, 17, MU, 500);
      pill(c, PW - 190, y + 16, 140, 30, i % 2 ? '#9fe6c8' : G2, ['Qualified', 'New', 'Won', 'Follow-up', 'Qualified'][i]);
    });
  }],
  ['Analytics & Reports', c => {
    kpi(c, 30, 108, 230, 100, 'Visitors', '48.2K', '▲ 12%'); kpi(c, 285, 108, 230, 100, 'Orders', '3,416', '▲ 7%'); kpi(c, 540, 108, 230, 100, 'Growth', '+21%', '▲ 3%');
    c.fillStyle = '#10161a'; rr(c, 30, 228, 480, 262, 14); c.fill(); line(c, 50, 248, 440, 222, 11);
    c.fillStyle = '#10161a'; rr(c, 530, 228, 240, 262, 14); c.fill(); bars(c, 548, 260, 204, 200, 5, 6);
  }],
  ['Sales & Lead Pipeline', c => {
    [['Leads', '1,248', 1], ['Qualified', '642', 0.78], ['Proposal', '318', 0.56], ['Negotiation', '176', 0.38], ['Won', '121', 0.24]].forEach((s, i) => {
      const y = 114 + i * 76; txt(c, s[0], 34, y + 34, 22, MU, 500);
      c.fillStyle = i === 4 ? G2 : G; rr(c, 200, y + 6, 520 * s[2], 44, 10); c.fill();
      txt(c, s[1], 214, y + 38, 24, '#04120c', 800);
    });
  }],
  ['Workflow & Tasks', c => {
    ['To do', 'In progress', 'Done'].forEach((h, i) => {
      const x = 30 + i * 252; c.fillStyle = '#10161a'; rr(c, x, 108, 236, 382, 14); c.fill(); txt(c, h, x + 18, 142, 22, MU, 600);
      for (let j = 0; j < 3 - (i === 1 ? 1 : 0) + (i === 2 ? 0 : 0); j++) {
        const y = 162 + j * 104; c.fillStyle = '#18211f'; rr(c, x + 14, y, 208, 90, 10); c.fill();
        bar(c, x + 28, y + 22, 150, 9, [G, G2, '#9fe6c8'][(i + j) % 3], 1); bar(c, x + 28, y + 44, 110, 8, 'rgba(255,255,255,.2)', 1);
        c.fillStyle = [G, G2, '#9fe6c8'][(i + j) % 3]; c.beginPath(); c.arc(x + 200, y + 68, 11, 0, 7); c.fill();
      }
    });
  }],
  ['Business Management', c => {
    kpi(c, 30, 108, 175, 96, 'Revenue', '₹12.4L', '▲ 18%'); kpi(c, 218, 108, 175, 96, 'Invoices', '284', '▲ 6%'); kpi(c, 406, 108, 175, 96, 'Clients', '96', '▲ 5'); kpi(c, 594, 108, 176, 96, 'Staff', '42', '—');
    ['Project Atlas', 'Retail Suite', 'Learning Portal', 'Member App'].forEach((n, i) => {
      const y = 228 + i * 66; c.fillStyle = i % 2 ? '#10161a' : '#141b1f'; rr(c, 30, y, PW - 60, 56, 10); c.fill();
      txt(c, n, 52, y + 36, 22); bar(c, 400, y + 24, 220, 10, G2, [0.9, 0.62, 0.78, 0.4][i]); txt(c, ['90%', '62%', '78%', '40%'][i], 650, y + 36, 20, MU, 600);
    });
  }],
  ['Team Collaboration', c => {
    const msg = (x, y, w, s, me) => { c.fillStyle = me ? G : '#1a2427'; rr(c, x, y, w, 62, 18); c.fill(); txt(c, s, x + 20, y + 39, 21, me ? '#03130c' : TX, 500); };
    msg(34, 112, 440, 'Proposal shared with the client', 0); msg(300, 192, 440, 'Great — approved on our side', 1);
    msg(34, 272, 400, 'Scheduling the kickoff call', 0); msg(360, 352, 380, 'Done. Invite sent to everyone', 1);
    c.fillStyle = '#10161a'; rr(c, 30, 438, PW - 60, 52, 26); c.fill(); txt(c, 'Write a message…', 56, 472, 20, MU, 500);
  }],
  ['Web & Digital Products', c => {
    c.fillStyle = '#10161a'; rr(c, 30, 106, PW - 60, 384, 14); c.fill();
    c.fillStyle = '#18211f'; rr(c, 30, 106, PW - 60, 40, [14, 14, 0, 0]); c.fill();
    ['#3a464d', '#3a464d', '#3a464d'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(54 + i * 24, 126, 7, 0, 7); c.fill(); });
    c.fillStyle = G; rr(c, 60, 170, 380, 34, 8); c.fill(); bar(c, 60, 226, 320, 12, 'rgba(255,255,255,.25)', 1); bar(c, 60, 252, 250, 12, 'rgba(255,255,255,.15)', 1);
    pill(c, 60, 296, 160, 44, G2, 'Get started');
    c.fillStyle = '#18211f'; rr(c, 480, 170, 262, 296, 14); c.fill(); c.fillStyle = G2; rr(c, 500, 190, 222, 120, 10); c.fill(); bar(c, 500, 332, 180, 10, 'rgba(255,255,255,.25)', 1); bar(c, 500, 356, 130, 10, 'rgba(255,255,255,.15)', 1);
    [60, 150, 240].forEach((x, i) => { c.fillStyle = '#18211f'; rr(c, x, 370, 80, 80, 10); c.fill(); c.fillStyle = [G, G2, '#9fe6c8'][i]; c.beginPath(); c.arc(x + 40, y0(i), 14, 0, 7); c.fill(); });
    function y0() { return 410; }
  }],
  ['Business Automation', c => {
    const n = (x, y, s, col) => { c.fillStyle = '#16201f'; rr(c, x, y, 170, 70, 14); c.fill(); c.strokeStyle = col; c.lineWidth = 3; rr(c, x, y, 170, 70, 14); c.stroke(); txt(c, s, x + 18, y + 43, 21); };
    c.strokeStyle = 'rgba(63,212,154,.7)'; c.lineWidth = 3;
    [[200, 180, 300, 180], [470, 180, 540, 140], [470, 180, 540, 260], [200, 300, 300, 300], [470, 300, 540, 260], [200, 420, 300, 420], [470, 420, 540, 380]].forEach(l => { c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); });
    n(40, 146, 'New lead', G2); n(300, 146, 'Qualify', G); n(540, 106, 'Assign', G2); n(540, 226, 'Email', G); n(40, 266, 'New order', G2); n(300, 266, 'Invoice', G); n(40, 386, 'Support', G2); n(300, 386, 'Notify', G); n(540, 346, 'Report', G2);
  }]
];
const panels = PANELS.map(([title, fn], i) => {
  const [cv, c] = panelBase(title); fn(c);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45 * PH / PW), mat); mesh.visible = false; scene.add(mesh);
  return mesh;
});
// final layout [x, y, z, yaw]
const TARGETS = [
  [-3.05, 2.1, 0.3, 0.22], [3.05, 2.1, 0.3, -0.22],
  [-3.4, 0.5, 0.9, 0.26], [3.4, 0.5, 0.9, -0.26],
  [-0.85, 3.05, -0.9, 0.08], [0.85, 3.05, -0.9, -0.08],
  [-2.25, 0.15, 1.4, 0.2], [2.25, 0.15, 1.4, -0.2]
];
let screenWorld = new THREE.Vector3();

/* ---------- pose ---------- */
let lastSweep = -2;
function setPose(p) {
  laptop.rotation.x = (Math.PI / 2) * (1 - ease2(seg(0.25, 0.40, p)));
  lid.rotation.x = -THREE.MathUtils.degToRad(108) * ease2(seg(0.40, 0.55, p));
  const lr = sm(0.09, 0.24, p);
  rimL.intensity = 2.2 * lr; rimR.intensity = 2.2 * lr; key.intensity = 0.9 * sm(0.14, 0.3, p); front.intensity = 0;
  scene.environmentIntensity = 1.0 * sm(0.12, 0.3, p);
  const glow = sm(0.44, 0.56, p);
  scMat.color.setScalar(0.12 + 0.88 * glow);
  screenLight.intensity = 0;
  // logo
  logoMat.opacity = 1;
  logoMat.emissiveIntensity = lerp(1.0, 0.22, sm(0.1, 0.3, p));
  const sw0 = p < 0.1 ? sm(0.02, 0.1, p) : -1;
  if (sw0 !== lastSweep) { drawLogo(lctx, 1024, sw0); logoTex.needsUpdate = true; lastSweep = sw0; }
  if (p > 0.39) drawScreen(p);
  // camera
  const e = THREE.MathUtils.degToRad(kf(p, [[0, 0], [0.25, 0], [0.40, 20], [0.7, 18], [1, 16]]));
  const d = kf(p, [[0, 3.8], [0.25, 6.4], [0.40, 8.0], [0.55, 7.2], [0.65, 6.2], [1, 5.5]]);
  const ly = kf(p, [[0, 0], [0.25, 0], [0.40, 0.4], [0.55, 0.8], [0.8, 1.05], [0.9, 1.1], [1, 0.88]]);
  camera.position.set(0, ly + d * Math.sin(e), d * Math.cos(e));
  camera.lookAt(0, ly, 0);
  // panels
  if (p > 0.66) {
    scene.updateMatrixWorld(true);
    screenMarker.getWorldPosition(screenWorld);
  }
  panels.forEach((m, i) => {
    m.visible = false; return;
    const t0 = 0.70 + i * 0.022, k = ease2(seg(t0, t0 + 0.085, p));
    m.visible = k > 0.001;
    if (!m.visible) return;
    const T = TARGETS[i];
    const settle = 1 - sm(0.9, 1.0, p);
    let x = lerp(screenWorld.x, T[0], k), y = lerp(screenWorld.y, T[1], k) + Math.sin(Math.PI * k) * 0.35, z = lerp(screenWorld.z + 0.1, T[2], k);
    y += Math.sin(p * 38 + i * 1.7) * 0.05 * settle * k;
    z += Math.cos(p * 31 + i) * 0.08 * settle * k;
    let op = k;
    const gw = seg(t0 + 0.045, t0 + 0.085, p);
    if (gw > 0 && gw < 1) { const f = Math.floor(p * 400) + i * 17; if (hsh(f) > 0.55) { x += (hsh(f + 1) - 0.5) * 0.22; op *= 0.55 + 0.45 * hsh(f + 2); } }
    m.position.set(x, y, z);
    m.rotation.y = T[3] * k; m.scale.setScalar(lerp(0.3, 1, k)); m.material.opacity = op * 0.97;
  });
}

/* ---------- sizing + scroll ---------- */
function resize() {
  const box = host ? canvas.parentElement : null;
  const w = box ? box.clientWidth : window.innerWidth, h = box ? box.clientHeight : window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w / h < 16 / 9 ? 34 * (16 / 9) / (w / h) : 34; // keep 16:9 framing on narrow screens
  camera.updateProjectionMatrix();
  dirty = true;
}
let target = 0, cur = 0, dirty = true;
const hash = /p=([0-9.]+)/.exec(location.hash);
let forced = hash ? parseFloat(hash[1]) : null;
const host = canvas.closest('[data-px-hero]');
function readScroll() {
  if (host) {
    const r = host.getBoundingClientRect(), max = r.height - window.innerHeight;
    target = max > 0 ? clamp(-r.top / max) : 0; return;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  target = max > 0 ? clamp(window.scrollY / max) : 0;
}
window.addEventListener('scroll', readScroll, { passive: true });
window.addEventListener('resize', resize);
window.__setP = v => { forced = v; cur = target = v; dirty = true; frame(true); };
function frame(force) {
  if (forced !== null && !force) { cur = target = forced; }
  else if (!force) cur += (target - cur) * 0.14;
  if (Math.abs(target - cur) < 0.0002) cur = target;
  if (dirty || force || cur !== lastP) {
    setPose(cur); renderer.render(scene, camera); lastP = cur; dirty = false;
  }
}
let lastP = -1;
function loop() { frame(false); requestAnimationFrame(loop); }
resize(); readScroll(); if (forced !== null) cur = target = forced;
setPose(cur); renderer.render(scene, camera);
window.__ready = true;
loop();
{
  const ld = document.getElementById('px-loader');
  if (ld) { requestAnimationFrame(() => requestAnimationFrame(() => { ld.style.opacity = '0'; setTimeout(() => ld.remove(), 700); })); }
}
