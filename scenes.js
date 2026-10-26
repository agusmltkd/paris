/* Ilustraciones de cada día, dibujadas en SVG (sin imágenes externas). */
const Scenes = (() => {
  const W = 400, H = 200;
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // Fila de edificios haussmannianos: fachada de piedra, tejado de zinc en mansarda y chimeneas.
  function haussmann(base, minH, maxH, o){
    const r = rnd(o.seed || 7);
    let x = -10, s = "";
    while (x < W + 10){
      const w = 34 + r() * 26, h = minH + r() * (maxH - minH), top = base - h, roof = 10 + r() * 6;
      s += `<rect x="${x}" y="${top}" width="${w + .5}" height="${h}" fill="${o.wall}"/>`;
      s += `<path d="M${x} ${top} L${x + 4} ${top - roof} H${x + w - 4} L${x + w} ${top} Z" fill="${o.roof}"/>`;
      const ch = 1 + Math.floor(r() * 3);
      for (let c = 0; c < ch; c++){
        const cx = x + 8 + r() * (w - 18);
        s += `<rect x="${cx}" y="${top - roof - 6}" width="5" height="8" fill="${o.roof}"/>`;
      }
      if (o.win){
        const cols = Math.max(2, Math.floor(w / 11)), gap = w / cols;
        for (let fy = top + 7; fy < base - 8; fy += 11){
          for (let c = 0; c < cols; c++){
            const lit = o.lit ? r() < o.lit : true;
            if (lit) s += `<rect x="${x + c * gap + gap / 2 - 2}" y="${fy}" width="4" height="6" rx="1" fill="${o.win}" opacity="${o.winOp || 1}"/>`;
          }
        }
        // balcón corrido del 2º piso
        if (o.balcony) s += `<rect x="${x + 2}" y="${top + 16}" width="${w - 4}" height="1.4" fill="${o.balcony}"/>`;
      }
      x += w;
    }
    return s;
  }

  function eiffel(x, base, h, fill, lights){
    const w = h * .42, p1 = w * .62, y1 = base - h * .27, y2 = base - h * .53;
    let s = `<path d="M${x - w / 2} ${base} Q${x - w * .36} ${base - h * .12} ${x - p1 / 2} ${y1} L${x - w * .11} ${y2} L${x - w * .035} ${base - h * .92} L${x} ${base - h} L${x + w * .035} ${base - h * .92} L${x + w * .11} ${y2} L${x + p1 / 2} ${y1} Q${x + w * .36} ${base - h * .12} ${x + w / 2} ${base} L${x + w * .22} ${base} Q${x} ${base - h * .21} ${x - w * .22} ${base} Z" fill="${fill}"/>`;
    s += `<rect x="${x - p1 * .56}" y="${y1 - 2}" width="${p1 * 1.12}" height="${h * .025}" fill="${fill}"/>`;
    s += `<rect x="${x - w * .15}" y="${y2 - 1.5}" width="${w * .3}" height="${h * .02}" fill="${fill}"/>`;
    // celosía
    s += `<g stroke="${lights ? lights : "rgba(255,255,255,.18)"}" stroke-width=".6" opacity="${lights ? .3 : 1}">`;
    for (let k = 1; k < 6; k++){
      const yy = y1 + (y2 - y1) * k / 6, half = (p1 / 2) - ((p1 / 2) - w * .11) * k / 6;
      s += `<line x1="${x - half}" y1="${yy}" x2="${x + half}" y2="${yy - 4}"/><line x1="${x + half}" y1="${yy}" x2="${x - half}" y2="${yy - 4}"/>`;
    }
    s += `</g>`;
    if (lights){
      const r = rnd(11);
      for (let k = 0; k < 26; k++){
        const t = r(), yy = base - h * (.05 + t * .85), spread = (w / 2) * (1 - t) * .9;
        s += `<circle cx="${x + (r() * 2 - 1) * spread}" cy="${yy}" r=".9" fill="${lights}"/>`;
      }
      s += `<circle cx="${x}" cy="${base - h - 2}" r="2.4" fill="${lights}"/><circle cx="${x}" cy="${base - h - 2}" r="6" fill="${lights}" opacity=".25"/>`;
    }
    return s;
  }

  function arc(x, base, w, h, fill, shade){
    const a = w * .18;
    return `<path d="M${x - w / 2} ${base} V${base - h} H${x + w / 2} V${base} H${x + a} V${base - h * .42} A${a} ${a} 0 0 0 ${x - a} ${base - h * .42} V${base} Z" fill="${fill}"/>
      <rect x="${x - w / 2 - 2}" y="${base - h - 3}" width="${w + 4}" height="5" fill="${shade}"/>
      <rect x="${x - w / 2}" y="${base - h * .78}" width="${w}" height="2" fill="${shade}"/>`;
  }

  function pyramid(x, base, w, glass, frame, id){
    const h = w * .62, tri = `M${x - w / 2} ${base} L${x} ${base - h} L${x + w / 2} ${base} Z`;
    let s = `<clipPath id="${id}"><path d="${tri}"/></clipPath><path d="${tri}" fill="${glass}"/>`;
    s += `<g stroke="${frame}" stroke-width=".7" opacity=".75" clip-path="url(#${id})">`;
    const step = w / 10;
    for (let k = -10; k <= 10; k++){
      const x0 = x - w / 2 + k * step;
      s += `<line x1="${x0}" y1="${base}" x2="${x0 + w / 2 * 2}" y2="${base - h * 2}"/>`;
      s += `<line x1="${x0 + w}" y1="${base}" x2="${x0 + w - w}" y2="${base - h * 2}"/>`;
    }
    s += `</g><path d="M${x - w / 2} ${base} L${x} ${base - h} L${x + w / 2} ${base}" fill="none" stroke="${frame}" stroke-width="1.4"/>`;
    // reflejo
    s += `<path d="M${x} ${base - h} L${x + w / 2} ${base} L${x + w * .12} ${base} Z" fill="#fff" opacity=".18"/>`;
    return s;
  }

  function notreDame(x, base, s, stone, shade){
    const tw = s * .32, th = s, gap = s * .32;
    const lx = x - gap / 2 - tw, rx = x + gap / 2;
    return `<path d="M${x - 1.5} ${base - th * 1.55} L${x + 1.5} ${base - th * 1.55} L${x + 5} ${base - th * .9} H${x - 5} Z" fill="${shade}"/>
      <rect x="${lx}" y="${base - th}" width="${tw}" height="${th}" fill="${stone}"/>
      <rect x="${rx}" y="${base - th}" width="${tw}" height="${th}" fill="${stone}"/>
      <rect x="${lx - 1}" y="${base - th - 2}" width="${tw + 2}" height="3" fill="${shade}"/>
      <rect x="${rx - 1}" y="${base - th - 2}" width="${tw + 2}" height="3" fill="${shade}"/>
      <rect x="${x - gap / 2}" y="${base - th * .62}" width="${gap}" height="${th * .62}" fill="${stone}"/>
      <rect x="${lx}" y="${base - th * .55}" width="${tw * 2 + gap}" height="2" fill="${shade}"/>
      <rect x="${lx}" y="${base - th * .3}" width="${tw * 2 + gap}" height="2" fill="${shade}"/>
      <circle cx="${x}" cy="${base - th * .43}" r="${gap * .32}" fill="none" stroke="${shade}" stroke-width="1.6"/>
      <circle cx="${x}" cy="${base - th * .43}" r="${gap * .1}" fill="${shade}"/>
      ${[lx + tw * .3, lx + tw * .7, rx + tw * .3, rx + tw * .7].map(wx => `<rect x="${wx - 1.6}" y="${base - th * .9}" width="3.2" height="${th * .22}" rx="1.6" fill="${shade}"/>`).join("")}
      ${[x - gap * .35, x, x + gap * .35].map(dx => `<path d="M${dx - 4} ${base} V${base - 10} A4 4 0 0 1 ${dx + 4} ${base - 10} V${base} Z" fill="${shade}"/>`).join("")}`;
  }

  function sacreCoeur(x, base, s, white, shade){
    const dome = (cx, w, h, by) => `<rect x="${cx - w / 2}" y="${by - h * .35}" width="${w}" height="${h * .35}" fill="${white}"/>
      <path d="M${cx - w / 2} ${by - h * .35} Q${cx - w / 2} ${by - h} ${cx} ${by - h * 1.05} Q${cx + w / 2} ${by - h} ${cx + w / 2} ${by - h * .35} Z" fill="${white}"/>
      <rect x="${cx - 1}" y="${by - h * 1.22}" width="2" height="${h * .2}" fill="${white}"/>
      <rect x="${cx - w / 2}" y="${by - h * .36}" width="${w}" height="1.5" fill="${shade}"/>`;
    return `<rect x="${x - s * .62}" y="${base - s * .42}" width="${s * 1.24}" height="${s * .42}" fill="${white}"/>
      ${[-.42, -.14, .14, .42].map(k => `<path d="M${x + k * s - 4} ${base} V${base - s * .18} A4 4 0 0 1 ${x + k * s + 4} ${base - s * .18} V${base} Z" fill="${shade}" opacity=".5"/>`).join("")}
      <rect x="${x + s * .55}" y="${base - s * 1.05}" width="${s * .16}" height="${s * 1.05}" fill="${white}"/>
      <path d="M${x + s * .55} ${base - s * 1.05} L${x + s * .63} ${base - s * 1.25} L${x + s * .71} ${base - s * 1.05} Z" fill="${white}"/>
      ${dome(x - s * .42, s * .24, s * .5, base - s * .42)}
      ${dome(x + s * .3, s * .24, s * .5, base - s * .42)}
      ${dome(x, s * .44, s * .95, base - s * .42)}`;
  }

  const tree = (x, base, r, c) => `<rect x="${x - 1.2}" y="${base - r}" width="2.4" height="${r}" fill="#5B4636"/><circle cx="${x}" cy="${base - r * 1.5}" r="${r}" fill="${c}"/>`;
  const plane = (x, y, s, c, rot = -12) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-16 0 Q-16 -2 -12 -2 H10 Q16 -2 18 0 Q16 2 10 2 H-12 Q-16 2 -16 0 Z M-2 -2 L-8 -12 H-4 L6 -2 Z M-2 2 L-8 12 H-4 L6 2 Z M-14 -2 L-17 -7 H-14 L-10 -2 Z" fill="${c}"/></g>`;
  const boat = (x, y, w, c, glass) => `<path d="M${x} ${y} H${x + w} L${x + w - 6} ${y + 6} H${x + 4} Z" fill="${c}"/><rect x="${x + 8}" y="${y - 5}" width="${w - 20}" height="5" rx="2" fill="${glass}"/>`;
  const stars = (n, seed, c, maxY) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${r() * W}" cy="${r() * maxY}" r="${r() * .9 + .3}" fill="${c}" opacity="${.4 + r() * .6}"/>`; return s; };
  const water = (y, c, line) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="${c}"/>${[0, 1, 2].map(k => `<path d="M${-20 + k * 37} ${y + 6 + k * 6} h28 M${110 + k * 41} ${y + 9 + k * 5} h22 M${240 + k * 29} ${y + 5 + k * 6} h30" stroke="${line}" stroke-width="1.2" stroke-linecap="round"/>`).join("")}`;

  const grad = (id, stops) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
  const wrap = (id, defs, body, label) => `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;

  const SCENES = {
    night: id => wrap(id, grad(id + "s", [[0, "#0B1230"], [.7, "#26346A"], [1, "#41497A"]]),
      `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>${stars(70, 3, "#fff", 120)}
       <circle cx="330" cy="42" r="15" fill="#F3E7C6"/><circle cx="336" cy="38" r="15" fill="#1A2350" opacity=".9"/>
       <path d="M30 150 Q140 120 236 64" stroke="#F3E7C6" stroke-width="1.2" stroke-dasharray="3 6" fill="none" opacity=".6"/>
       ${plane(250, 58, 1.15, "#F3E7C6", -24)}
       ${eiffel(92, 182, 132, "#1A2147", "#E8B34A")}
       ${haussmann(200, 16, 34, { seed: 5, wall: "#151C3D", roof: "#0F1532", win: "#E8B34A", lit: .28 })}`, "París de noche con un avión llegando"),

    eiffel: id => wrap(id, grad(id + "s", [[0, "#5D6CA3"], [.45, "#C98B8F"], [.75, "#F0A867"], [1, "#F7D395"]]),
      `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>
       <circle cx="118" cy="126" r="26" fill="#FFE2A6" opacity=".9"/>
       ${haussmann(162, 18, 34, { seed: 21, wall: "#B98A8E", roof: "#9F7A86" })}
       ${arc(72, 168, 58, 50, "#8D6676", "#7A5668")}
       ${eiffel(282, 168, 150, "#2C2F57", "#FFD57A")}
       ${haussmann(176, 14, 26, { seed: 9, wall: "#6E5470", roof: "#57435E", win: "#FFD57A", lit: .35, winOp: .9 })}
       ${water(176, "#3E3F68", "#F7C98A")}
       ${boat(150, 184, 46, "#1E2245", "#FFD57A")}
       ${tree(18, 176, 9, "#C8642B")}${tree(380, 176, 10, "#D9922E")}`, "La Torre Eiffel y el Arco del Triunfo al atardecer"),

    louvre: id => wrap(id, grad(id + "s", [[0, "#A9C3DA"], [1, "#EEF2F4"]]),
      `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>
       <circle cx="330" cy="40" r="14" fill="#FFF5DA"/>
       ${haussmann(152, 22, 40, { seed: 33, wall: "#DCD2C2", roof: "#8C98A6", win: "#A8B4C0", balcony: "#6E7A88" })}
       ${notreDame(322, 152, 82, "#C9BBA4", "#9E8F78")}
       <rect x="0" y="152" width="${W}" height="48" fill="#CDBFA9"/>
       <rect x="0" y="152" width="${W}" height="3" fill="#B7A88F"/>
       ${pyramid(170, 186, 132, "#8FB3CF", "#3D5A78", id + "p")}
       <rect x="0" y="186" width="${W}" height="14" fill="#BCA98D"/>
       ${tree(36, 186, 11, "#D9922E")}${tree(66, 186, 9, "#B85A2E")}${tree(372, 186, 11, "#C8782B")}`, "La pirámide del Louvre con Notre-Dame al fondo"),

    montmartre: id => wrap(id, grad(id + "s", [[0, "#B9D0E2"], [1, "#F4E6D5"]]),
      `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>
       ${plane(338, 34, .8, "#5D6C86", -16)}
       <path d="M0 140 Q120 96 200 92 Q290 96 400 138 V200 H0 Z" fill="#A5A27A"/>
       ${sacreCoeur(198, 94, 54, "#F6F2EA", "#B5AE9F")}
       <path d="M0 152 Q110 120 200 124 Q300 126 400 152 V200 H0 Z" fill="#8E9465"/>
       ${tree(110, 132, 8, "#C8782B")}${tree(290, 134, 8, "#D9922E")}${tree(84, 142, 7, "#B85A2E")}${tree(318, 144, 7, "#C8642B")}
       ${haussmann(200, 30, 52, { seed: 41, wall: "#E8DCCB", roof: "#7E8B9A", win: "#9AA7B4", balcony: "#5F6B79" })}`, "El Sacré-Cœur en lo alto de Montmartre")
  };

  return { draw: (name, id = "sc") => (SCENES[name] || SCENES.eiffel)(id) };
})();
