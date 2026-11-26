/* Vector scenes of Budapest landmarks. viewBox 1600x900, so they stay razor-sharp at 4K / 8K.
   Colours come from CSS variables so the whole site can switch Golden hour <-> Night. */
(function () {
  function rng(seed) { let a = 0; for (const c of seed) a = (a * 31 + c.charCodeAt(0)) >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function frame(id, body, o) {
    o = Object.assign({ hz: 640, orbX: 1250, orbY: 190, label: 'Budapest', refl: true, water: 'river', hills: true }, o);
    const r = rng(id), hz = o.hz;
    let stars = '';
    for (let i = 0; i < 90; i++) stars += `<circle cx="${(r() * 1600) | 0}" cy="${(r() * hz * .75) | 0}" r="${(r() * 1.6 + .4).toFixed(1)}" style="animation-delay:${(r() * 4).toFixed(1)}s"/>`;
    let shim = '';
    for (let i = 0; i < 38; i++) { const y = hz + 14 + r() * (900 - hz - 20), x = r() * 1500, w = 40 + r() * 180;
      shim += `<rect x="${x | 0}" y="${y | 0}" width="${w | 0}" height="${(1.5 + r() * 2).toFixed(1)}" rx="2" style="animation-delay:${(r() * 6).toFixed(1)}s"/>`; }
    const water = o.water === 'pool'
      ? `<rect x="0" y="${hz}" width="1600" height="${900 - hz}" style="fill:var(--pool)"/>`
      : `<rect x="0" y="${hz}" width="1600" height="${900 - hz}" fill="url(#${id}w)"/>`;
    const hills = o.hills ? `<path d="M0 ${hz} L0 ${hz - 70} Q300 ${hz - 140} 560 ${hz - 60} T1100 ${hz - 90} T1600 ${hz - 50} L1600 ${hz}Z" style="fill:var(--far)"/>` : '';
    return `<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${o.label}" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset=".55" style="stop-color:var(--sky2)"/><stop offset="1" style="stop-color:var(--sky3)"/></linearGradient>
<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--water1)"/><stop offset="1" style="stop-color:var(--water2)"/></linearGradient>
<radialGradient id="${id}o"><stop offset="0" style="stop-color:var(--orb);stop-opacity:.95"/><stop offset=".25" style="stop-color:var(--orb);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--orb);stop-opacity:0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#${id}s)"/>
<g class="stars" style="fill:#fff;opacity:var(--stars)">${stars}</g>
<circle cx="${o.orbX}" cy="${o.orbY}" r="260" fill="url(#${id}o)"/><circle cx="${o.orbX}" cy="${o.orbY}" r="44" style="fill:var(--orb)"/>
${hills}
<g id="${id}b">${body}</g>
${water}
${o.refl ? `<g opacity=".26" style="mix-blend-mode:normal"><use href="#${id}b" transform="translate(0 ${2 * hz}) scale(1 -1)"/></g><rect x="0" y="${hz}" width="1600" height="${900 - hz}" fill="url(#${id}w)" opacity=".55"/>` : ''}
<g class="shimmer" style="fill:var(--shimmer)">${shim}</g>
</svg>`;
  }

  const win = (x, y, w = 12, h = 26) => `<path d="M${x} ${y + h}v-${h - w / 2}q${w / 2} -${w} ${w} 0v${h - w / 2}z" style="fill:var(--win)"/>`;
  const rows = (x0, x1, step, y, skip, h) => { let s = ''; for (let x = x0; x < x1; x += step) if (!skip || !skip(x)) s += win(x, y, 12, h || 26); return s; };
  const spire = (x, y, w, h, c = 'roof') => `<polygon points="${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}" style="fill:var(--${c})"/>`;
  const stone = 'style="fill:var(--stone)"', stone2 = 'style="fill:var(--stone2)"', roof = 'style="fill:var(--roof)"';

  const S = {};

  S.parliament = id => frame(id, `
<rect x="260" y="520" width="1080" height="120" ${stone}/><rect x="260" y="608" width="1080" height="32" ${stone2}/>
${[260, 1240].map(x => `<rect x="${x}" y="455" width="100" height="185" ${stone}/>${spire(x + 50, 455, 112, 105)}<rect x="${x + 48}" y="330" width="4" height="30" ${stone2}/>`).join('')}
${[420, 520, 1080, 1180].map(x => `<rect x="${x}" y="470" width="60" height="50" ${stone}/>${spire(x + 30, 470, 70, 70)}`).join('')}
${rows(280, 1330, 32, 545, x => x > 690 && x < 900)}${rows(280, 1330, 32, 584, x => x > 690 && x < 900, 24)}
${(() => { let s = ''; for (let x = 372; x < 1230; x += 38) if (x < 680 || x > 910) s += `<polygon points="${x},520 ${x + 8},486 ${x + 16},520" ${stone2}/>`; return s; })()}
${[660, 940].map(x => `<rect x="${x - 16}" y="430" width="32" height="90" ${stone}/>${spire(x, 430, 40, 90)}`).join('')}
${[620, 980].map(x => `<rect x="${x - 11}" y="468" width="22" height="52" ${stone}/>${spire(x, 468, 28, 62)}`).join('')}
<rect x="726" y="395" width="148" height="125" ${stone}/>${rows(738, 866, 24, 410, null, 34)}${rows(738, 866, 24, 460, null, 34)}
<path d="M722 398C722 330 765 275 800 232C835 275 878 330 878 398Z" ${roof}/>
${[-50, -25, 0, 25, 50].map(d => `<path d="M${800 + d * .15} 232Q${800 + d} 320 ${800 + d * 1.35} 398" fill="none" style="stroke:var(--stone2)" stroke-width="2" opacity=".5"/>`).join('')}
<rect x="792" y="190" width="16" height="48" ${stone}/>${spire(800, 192, 22, 88, 'roof')}<rect x="798" y="95" width="4" height="22" ${stone2}/>
<path d="M740 640q60 -40 120 0z" ${stone2}/>`,
    { label: 'The Hungarian Parliament Building on the Danube', orbX: 1330, orbY: 230 });

  S.chain = id => {
    let hangers = '';
    const q = (p0, p1, p2, t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
    [[[0, 570], [230, 420], [470, 392]], [[470, 392], [800, 640], [1130, 392]], [[1130, 392], [1370, 420], [1600, 570]]].forEach(c => {
      for (let t = 0.02; t < 1; t += 0.035) { const [x, y] = q(...c, t); hangers += `<line x1="${x | 0}" y1="${y | 0}" x2="${x | 0}" y2="${y < 590 ? 588 : y}" />`; } });
    return frame(id, `
<path d="M1000 640L1000 470Q1180 420 1300 360L1420 330L1600 380V640Z" style="fill:var(--far2)"/>
<rect x="1190" y="300" width="300" height="70" ${stone2} opacity=".9"/><path d="M1260 300q50 -80 100 0z" ${roof}/>${rows(1200, 1480, 30, 318, null, 24)}
<path d="M0 640V560L200 520L340 560V640Z" style="fill:var(--far2)"/>
${[470, 1130].map(x => `
<rect x="${x - 38}" y="372" width="76" height="268" ${stone}/><rect x="${x - 46}" y="356" width="92" height="22" ${stone2}/>
<path d="M${x - 20} 640V540q20 -40 40 0V640Z" style="fill:var(--arch)"/><path d="M${x - 14} 470q14 -30 28 0v30h-28z" style="fill:var(--arch)"/>
<rect x="${x - 30}" y="326" width="60" height="32" ${stone}/>${spire(x, 326, 66, 50, 'roof')}`).join('')}
<rect x="0" y="588" width="1600" height="16" ${stone2}/><rect x="0" y="604" width="1600" height="6" style="fill:var(--arch)"/>
<g style="stroke:var(--chain)" fill="none" stroke-width="7"><path d="M0 570Q230 420 470 392Q800 640 1130 392Q1370 420 1600 570"/></g>
<g style="stroke:var(--chain)" stroke-width="2" opacity=".85">${hangers}</g>
${Array.from({ length: 26 }, (_, i) => `<circle cx="${30 + i * 62}" cy="${i % 2 ? 584 : 582}" r="4" style="fill:var(--win)"/>`).join('')}`,
      { label: 'The Széchenyi Chain Bridge', orbX: 260, orbY: 200, hz: 650 });
  };

  S.bastion = id => {
    const towers = [[330, 480, 62, 120], [440, 440, 70, 140], [560, 400, 84, 170], [700, 430, 70, 140], [810, 470, 62, 120], [900, 505, 54, 100], [980, 530, 46, 80]];
    return frame(id, `
<path d="M0 640V470Q300 380 700 410T1600 360V640Z" style="fill:var(--land)"/>
<g transform="translate(-130 0)"><rect x="250" y="500" width="780" height="140" ${stone}/><rect x="250" y="590" width="780" height="50" ${stone2}/>
${Array.from({ length: 20 }, (_, i) => win(270 + i * 38, 530, 14, 44)).join('')}
${towers.map(([x, y, w, h]) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${520 - y + 80}" ${stone}/><polygon points="${x - w / 2 - 6},${y} ${x},${y - h * .7} ${x + w / 2 + 6},${y}" style="fill:var(--stone)"/><path d="M${x - w / 2 - 6} ${y}L${x} ${y - h * .7}" style="stroke:var(--stone2)" stroke-width="3" fill="none"/>${win(x - 7, y + 18, 14, 38)}`).join('')}
<g><rect x="1130" y="400" width="130" height="240" ${stone}/>${rows(1142, 1250, 26, 450, null, 40)}
<polygon points="1115,400 1195,360 1275,400" style="fill:var(--roof)"/>
<rect x="1175" y="230" width="40" height="170" ${stone}/>
${Array.from({ length: 9 }, (_, i) => `<polygon points="${1150 + i * 14},${396 - i * 3} ${1157 + i * 14},${376 - i * 3} ${1164 + i * 14},${396 - i * 3}" ${i % 2 ? roof : stone2}/>`).join('')}
${Array.from({ length: 12 }, (_, i) => `<rect x="${1171 + (i % 2) * 24}" y="${232 + i * 14}" width="22" height="10" style="fill:${i % 2 ? 'var(--roof)' : 'var(--accent)'}"/>`).join('')}
${spire(1195, 232, 50, 140, 'roof')}<rect x="1193" y="64" width="4" height="26" ${stone2}/></g>
${Array.from({ length: 16 }, (_, i) => `<circle cx="${290 + i * 46}" cy="${505}" r="3" style="fill:var(--win)"/>`).join('')}</g>`,
      { label: "Fisherman's Bastion and Matthias Church", orbX: 480, orbY: 180, refl: false, hills: false, hz: 640 });
  };

  S.castle = id => `${frame(id, `
<path d="M0 640V500Q200 470 420 420Q700 330 1000 360T1600 400V640Z" style="fill:var(--land)"/>
<rect x="330" y="350" width="940" height="110" ${stone}/><rect x="330" y="432" width="940" height="28" ${stone2}/>
${rows(350, 1260, 30, 372, x => x > 700 && x < 900, 30)}
${[330, 1230].map(x => `<rect x="${x}" y="315" width="70" height="145" ${stone}/>${spire(x + 35, 315, 80, 70)}`).join('')}
<rect x="700" y="290" width="200" height="90" ${stone}/>${rows(716, 890, 26, 308, null, 34)}
<path d="M695 292C695 215 760 175 800 150C840 175 905 215 905 292Z" style="fill:var(--dome)"/>
<rect x="790" y="110" width="20" height="45" ${stone}/>${spire(800, 114, 24, 50, 'dome')}
<path d="M360 460V640H1240V460" ${stone2} opacity=".7"/>
${Array.from({ length: 40 }, (_, i) => `<path d="M${380 + i * 21} 640q0 -40 8 -52t8 52z" style="fill:var(--land2)"/>`).join('')}`,
    { label: 'Buda Castle Palace on Castle Hill', orbX: 1380, orbY: 170, hz: 660 })}`;

  S.basilica = id => frame(id, `
<rect x="500" y="460" width="600" height="180" ${stone}/><rect x="500" y="600" width="600" height="40" ${stone2}/>
${[500, 1000].map(x => `<rect x="${x}" y="360" width="100" height="280" ${stone}/>${rows(x + 22, x + 90, 34, 400, null, 40)}${rows(x + 22, x + 90, 34, 500, null, 44)}<path d="M${x - 4} 362Q${x + 50} 300 ${x + 104} 362Z" style="fill:var(--dome)"/>${spire(x + 50, 322, 14, 40, 'dome')}`).join('')}
<polygon points="620,470 800,395 980,470" ${stone}/><polygon points="650,466 800,412 950,466" ${stone2} opacity=".5"/>
${Array.from({ length: 8 }, (_, i) => `<rect x="${628 + i * 46}" y="470" width="12" height="170" ${stone2}/>`).join('')}
<rect x="690" y="330" width="220" height="80" ${stone}/>${rows(710, 900, 32, 342, null, 52)}
<path d="M680 335C680 240 740 190 800 165C860 190 920 240 920 335Z" style="fill:var(--dome)"/>
${[-60, -30, 0, 30, 60].map(d => `<path d="M${800 + d * .2} 170Q${800 + d * 1.2} 250 ${800 + d * 1.5} 335" fill="none" style="stroke:var(--stone2)" stroke-width="2" opacity=".35"/>`).join('')}
<rect x="794" y="112" width="12" height="60" ${stone}/><rect x="780" y="128" width="40" height="5" ${stone}/>
${[300, 1300].map(x => `<rect x="${x}" y="470" width="5" height="170" style="fill:var(--arch)"/><circle cx="${x + 2}" cy="466" r="9" style="fill:var(--win)"/>`).join('')}`,
    { label: "St. Stephen's Basilica", orbX: 1330, orbY: 200, refl: false, hz: 640 });

  S.szechenyi = id => frame(id, `
<rect x="170" y="400" width="1260" height="170" style="fill:var(--bath)"/><rect x="170" y="540" width="1260" height="30" style="fill:var(--bath2)"/>
${Array.from({ length: 32 }, (_, i) => win(200 + i * 39, 440, 16, 70)).join('')}
<rect x="640" y="300" width="320" height="120" style="fill:var(--bath)"/><path d="M630 305C630 220 710 180 800 150C890 180 970 220 970 305Z" style="fill:var(--dome)"/>
<rect x="790" y="100" width="20" height="55" style="fill:var(--bath)"/><circle cx="800" cy="95" r="12" style="fill:var(--bath)"/>
${[330, 1270].map(x => `<rect x="${x - 60}" y="330" width="120" height="100" style="fill:var(--bath)"/><path d="M${x - 70} 335C${x - 70} 270 ${x - 30} 250 ${x} 230C${x + 30} 250 ${x + 70} 270 ${x + 70} 335Z" style="fill:var(--dome)"/>`).join('')}
${Array.from({ length: 12 }, (_, i) => `<rect x="${196 + i * 107}" y="545" width="14" height="28" style="fill:var(--bath2)"/>`).join('')}
${(() => { const r = rng('swim'); let s = ''; for (let i = 0; i < 26; i++) { const x = 100 + r() * 1400, y = 640 + r() * 220; s += `<g transform="translate(${x | 0} ${y | 0})"><ellipse cx="0" cy="8" rx="18" ry="5" style="fill:var(--pool2)" opacity=".5"/><circle r="${6 + y / 120}" style="fill:${i % 3 ? '#e9c9a8' : '#c08a62'}"/></g>`; } return s; })()}`,
    { label: 'Széchenyi Thermal Bath', orbX: 1400, orbY: 150, water: 'pool', refl: true, hills: false, hz: 590 })
    .replace('</svg>', `<g class="steam">${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${120 + i * 180}" cy="${600 + (i % 3) * 20}" rx="150" ry="40" style="animation-delay:${i * -1.3}s"/>`).join('')}</g></svg>`);

  S.market = id => frame(id, `
<rect x="220" y="400" width="1160" height="240" style="fill:var(--brick)"/><rect x="220" y="400" width="1160" height="20" ${stone}/>
${Array.from({ length: 13 }, (_, i) => `<path d="M${250 + i * 88} 640V500q22 -60 44 0V640Z" style="fill:var(--arch)"/><rect x="${254 + i * 88}" y="520" width="36" height="6" style="fill:var(--win)"/>`).join('')}
<path d="M220 400L800 250L1380 400Z" style="fill:var(--roofpat)"/>
${Array.from({ length: 26 }, (_, i) => `<path d="M${240 + i * 44} 398l22 -${52 + (i % 2) * 6}l22 ${52 + (i % 2) * 6}z" style="fill:${['var(--accent)', 'var(--dome)', 'var(--win)'][i % 3]}" opacity=".7"/>`).join('')}
<rect x="640" y="300" width="320" height="340" style="fill:var(--brick)"/><polygon points="620,300 800,200 980,300" ${stone}/>
<path d="M690 640V380q110 -120 220 0V640Z" style="fill:var(--arch)"/><circle cx="800" cy="320" r="34" ${stone}/><circle cx="800" cy="320" r="26" style="fill:var(--win)"/>
<path d="M800 320V300M800 320H815" style="stroke:var(--arch)" stroke-width="3"/>
${[220, 1380].map(x => `<rect x="${x - 40}" y="310" width="80" height="330" style="fill:var(--brick)"/>${spire(x, 310, 90, 80, 'roofpat')}`).join('')}
<rect x="0" y="640" width="1600" height="260" style="fill:var(--street)"/>
${(() => { const r = rng('mk'); let s = ''; for (let i = 0; i < 28; i++) { const x = 60 + r() * 1480, y = 690 + r() * 160, k = .7 + y / 500; s += `<g transform="translate(${x | 0} ${y | 0}) scale(${k.toFixed(2)})"><ellipse cy="40" rx="16" ry="4" fill="#000" opacity=".25"/><rect x="-10" y="0" width="20" height="40" rx="8" style="fill:${['#c0392b', '#2d6a8a', '#d4a63a', '#4a7c59', '#8e5ea2'][i % 5]}"/><circle cy="-10" r="9" fill="#e7c3a0"/></g>`; } return s; })()}
${Array.from({ length: 14 }, (_, i) => `<circle cx="${100 + i * 105}" cy="${660 + Math.sin(i) * 6}" r="6" style="fill:var(--win)"/>`).join('')}`,
    { label: 'The Great Market Hall', orbX: 1300, orbY: 150, refl: false, hills: false, hz: 640 });

  S.ruin = id => {
    const r = rng('ruin'); let lights = '';
    for (let k = 0; k < 4; k++) { const y0 = 150 + k * 70; let d = `M0 ${y0}`; for (let x = 0; x < 1600; x += 400) d += `Q${x + 200} ${y0 + 90} ${x + 400} ${y0}`;
      lights += `<path d="${d}" fill="none" stroke="#2a2a33" stroke-width="2"/>`;
      for (let i = 0; i < 28; i++) { const t = (i + .5) / 28, x = t * 1600, seg = (x % 400) / 400, y = y0 + 90 * 2 * seg * (1 - seg) * 1; lights += `<circle cx="${x | 0}" cy="${y | 0}" r="${5 + (i % 3)}" fill="${['#ffcf70', '#ff7a59', '#6ee7d8', '#ff5fa2'][(i + k) % 4]}" class="bulb" style="animation-delay:${(r() * 3).toFixed(1)}s"/>`; } }
    return `<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A ruin bar courtyard strung with lights" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a14"/><stop offset="1" stop-color="#2a1630"/></linearGradient><filter id="${id}f"><feGaussianBlur stdDeviation="6"/></filter></defs>
<rect width="1600" height="900" fill="url(#${id}g)"/>
${Array.from({ length: 5 }, (_, i) => `<rect x="${i * 330 - 40}" y="${120 + (i % 2) * 40}" width="330" height="560" fill="${['#3a2a34', '#2d2b3d', '#40302b', '#2a3340', '#382c3f'][i]}"/>`).join('')}
${(() => { let s = ''; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 3; k++) { const lit = r() > .45; s += `<rect x="${i * 330 + k * 90 + 10}" y="${170 + j * 120}" width="50" height="76" fill="${lit ? ['#ffc96b', '#ff9f5a', '#7fe3d5'][(i + j + k) % 3] : '#14121c'}" opacity="${lit ? .9 : 1}"/>`; } return s; })()}
${lights}
<g filter="url(#${id}f)" opacity=".6"><circle cx="300" cy="700" r="130" fill="#ff5fa2"/><circle cx="800" cy="720" r="160" fill="#ffb347"/><circle cx="1300" cy="700" r="130" fill="#4fd1c5"/></g>
<rect y="660" width="1600" height="240" fill="#150f1c"/>
<rect x="640" y="400" width="320" height="170" rx="8" fill="#1d1630" stroke="#ff5fa2" stroke-width="5" class="bulb"/><text x="800" y="505" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="78" font-style="italic" fill="#ff5fa2" class="bulb">kert</text>
${(() => { let s = ''; for (let i = 0; i < 18; i++) { const x = 60 + r() * 1480, y = 700 + r() * 170, k = .8 + (y - 700) / 300; s += `<g transform="translate(${x | 0} ${y | 0}) scale(${k.toFixed(2)})"><ellipse cy="46" rx="18" ry="5" fill="#000" opacity=".4"/><rect x="-11" y="0" width="22" height="46" rx="9" fill="${['#d6455d', '#3da5d9', '#f2b134', '#73bfb8', '#a06cd5'][i % 5]}"/><circle cy="-11" r="10" fill="#e7c3a0"/></g>`; } return s; })()}
</svg>`;
  };

  S.heroes = id => frame(id, `
<rect x="0" y="600" width="1600" height="40" ${stone2}/>
<path d="M120 600V470Q120 420 180 420H560V600Z" ${stone}/><path d="M1040 600V420H1420Q1480 420 1480 470V600Z" ${stone}/>
${[120, 1040].map(x => Array.from({ length: 12 }, (_, i) => `<rect x="${x + 14 + i * 36}" y="480" width="14" height="120" ${stone2}/>`).join('')).join('')}
${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${190 + i * 70} 425)"><rect x="-8" y="-30" width="16" height="30" style="fill:var(--arch)"/><circle cy="-38" r="7" style="fill:var(--arch)"/></g><g transform="translate(${1090 + i * 70} 425)"><rect x="-8" y="-30" width="16" height="30" style="fill:var(--arch)"/><circle cy="-38" r="7" style="fill:var(--arch)"/></g>`).join('')}
<rect x="560" y="500" width="480" height="100" ${stone}/><rect x="760" y="130" width="80" height="400" ${stone}/><rect x="745" y="470" width="110" height="130" ${stone2}/>
${[640, 700, 900, 960].map((x, i) => `<g transform="translate(${x} 500)"><rect x="-10" y="-60" width="20" height="60" style="fill:var(--arch)"/><circle cy="-70" r="9" style="fill:var(--arch)"/></g>`).join('')}
<g transform="translate(800 120)" style="fill:var(--accent)"><rect x="-7" y="-60" width="14" height="60" rx="5"/><path d="M-6 -50Q-60 -90 -80 -60Q-50 -50 -6 -30ZM6 -50Q60 -90 80 -60Q50 -50 6 -30Z"/><circle cy="-70" r="9"/></g>
${Array.from({ length: 9 }, (_, i) => `<rect x="${150 + i * 170}" y="600" width="6" height="38" style="fill:var(--arch)"/>`).join('')}`,
    { label: "Heroes' Square and the Millennium Monument", orbX: 300, orbY: 220, refl: false, water: 'pool', hills: false, hz: 640 })
    .replace('<rect x="0" y="640" width="1600" height="260" style="fill:var(--pool)"/>', '<rect x="0" y="640" width="1600" height="260" style="fill:var(--street)"/>');

  S.gellert = id => frame(id, `
<g transform="translate(330 70)"><path d="M-300 640V360Q150 250 380 240Q620 250 760 420L860 640Z" style="fill:var(--land)"/>
<path d="M0 640V560Q200 470 420 470Q640 470 760 540L800 640Z" style="fill:var(--land2)"/>
<path d="M120 300H600L560 360H160Z" ${stone}/>${Array.from({ length: 12 }, (_, i) => `<rect x="${140 + i * 38}" y="286" width="22" height="16" ${stone}/>`).join('')}
<g style="fill:var(--accent)"><rect x="368" y="150" width="26" height="150" ${stone}/><g transform="translate(381 130)"><path d="M-14 22Q-18 0 -8 -12L0 -18L8 -12Q18 0 14 22Z"/><rect x="-3" y="-120" width="6" height="110" rx="2"/><path d="M-3 -118Q-40 -150 -48 -120Q-20 -112 -3 -96Z"/><circle cy="-22" r="8"/></g></g>
</g><g transform="translate(470 0)"><rect x="840" y="600" width="760" height="22" style="fill:var(--accent2)"/><rect x="840" y="622" width="760" height="8" ${stone2}/>
${[900, 1560].map(x => `<rect x="${x - 14}" y="400" width="28" height="240" style="fill:var(--accent2)"/><polygon points="${x - 22},400 ${x},350 ${x + 22},400" style="fill:var(--accent2)"/>`).join('')}
<path d="M900 400Q1230 360 1560 400" fill="none" style="stroke:var(--accent2)" stroke-width="8"/>
${Array.from({ length: 22 }, (_, i) => `<line x1="${925 + i * 29}" y1="${402 - Math.sin((i + 1) / 23 * Math.PI) * 16}" x2="${925 + i * 29}" y2="600" style="stroke:var(--accent2)" stroke-width="3"/>`).join('')}
<path d="M900 560L1230 410L1560 560M900 440L1230 590L1560 440" fill="none" style="stroke:var(--accent2)" stroke-width="2" opacity=".6"/></g>`,
    { label: 'Gellért Hill, the Citadella and the Liberty Bridge', orbX: 1180, orbY: 150, hz: 650, hills: false });

  S.shoes = id => frame(id, `
<path d="M300 640V560l60 -24 40 -80 80 -30h240V640Z" style="fill:var(--far2)"/>
${[420, 500, 580].map((x, i) => `<rect x="${x}" y="${470 - i * 12}" width="46" height="${170 + i * 12}" style="fill:var(--far2)"/>`).join('')}
<path d="M540 520C540 430 590 400 620 380C650 400 700 430 700 520Z" style="fill:var(--far2)"/>
<rect x="0" y="600" width="1600" height="40" ${stone}/><rect x="0" y="632" width="1600" height="14" ${stone2}/>
<rect x="0" y="720" width="1600" height="0" />`,
    { label: 'Shoes on the Danube Bank memorial', orbX: 1250, orbY: 220, refl: true, hz: 640 })
    .replace('</svg>', `<g>${(() => { let s = ''; for (let i = 0; i < 9; i++) { const x = 40 + i * 175, k = i % 3, c = ['#3b3a40', '#4a4540', '#2e3340'][k];
      s += `<g transform="translate(${x} 596) scale(1.9)"><path d="M0 0h32q10 0 10 -12l-2 -22q-4 -6 -12 -4l-8 6H0z" fill="${c}"/><rect x="-4" y="0" width="48" height="6" rx="3" fill="#1b1a20"/>${i % 5 === 2 ? `<g class="bulb"><circle cx="20" cy="-48" r="22" fill="#ffcf70" opacity=".25"/><rect x="14" y="-40" width="12" height="20" rx="3" fill="#f4e4b8"/><ellipse cx="20" cy="-44" rx="4" ry="6" fill="#ffb347"/></g>` : ''}</g>`; } return s; })()}</g></svg>`);

  S.margaret = id => {
    const r = rng('trees'); let trees = '';
    for (let i = 0; i < 52; i++) { const x = r() * 1600, h = 60 + r() * 90, y = 640 - (r() * 40);
      trees += `<g><rect x="${(x - 3) | 0}" y="${(y - h * .4) | 0}" width="6" height="${(h * .5) | 0}" style="fill:var(--trunk)"/><circle cx="${x | 0}" cy="${(y - h * .6) | 0}" r="${(h * .45) | 0}" style="fill:${i % 3 ? 'var(--leaf)' : 'var(--leaf2)'}"/></g>`; }
    return frame(id, `
<path d="M0 640V610Q400 580 800 600T1600 600V640Z" style="fill:var(--leaf2)"/>
<g transform="translate(-300 0)"><rect x="1120" y="360" width="64" height="240" ${stone}/><path d="M1110 366h84l-12 -26h-60z" ${roof}/><path d="M1120 340h64l-10 -40h-44z" ${stone2}/>${spire(1152, 300, 80, 66, 'roof')}${win(1144, 420, 16, 46)}${win(1144, 500, 16, 46)}</g>
${trees}
${Array.from({ length: 11 }, (_, i) => `<path d="M${560 + i * 24} 600Q${560 + i * 24 + (i - 5) * 8} ${520 - Math.abs(i - 5) * -6 - 40} ${560 + i * 24 + (i - 5) * 18} 600" fill="none" stroke="#fff" stroke-width="3" opacity=".55"/>`).join('')}
<ellipse cx="692" cy="606" rx="150" ry="12" style="fill:var(--pool2)" opacity=".8"/>`,
      { label: 'Margaret Island, the Water Tower and the Musical Fountain', orbX: 400, orbY: 220, hz: 650, hills: false });
  };

  window.SCENES = S;
})();
