/* ===================== utilidades ===================== */
const TZ = "Europe/Paris";
const $ = s => document.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const mapsUrl = (q, mode) => "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q) + "&travelmode=" + (mode || "transit");
const mins = s => { const [h, m] = s.t.split(":").map(Number); return h * 60 + m + (s.next ? 1440 : 0); };
const where = s => s.ll || (s.maps && PLACES[s.maps]);

const METRO_BY = Object.fromEntries(METRO.map(m => [m.line, m]));
const lineBadge = n => { const m = METRO_BY[n] || { color:"#8892A0", text:"#fff" }; return `<span class="ml" style="--c:${m.color};--t:${m.text}" aria-label="línea ${n}">${n}</span>`; };
// Texto con las líneas de metro pintadas como en los planos ("L1" → círculo amarillo con 1)
const rich = t => esc(t).replace(/\bL(\d{1,2})\b/g, (_, n) => lineBadge(n));

/* ===================== iconos ===================== */
const P = {
  plane:'<path d="M10 14L3 16v-2l7-4V5a2 2 0 0 1 4 0v5l7 4v2l-7-2v4l2 1.5V21l-4-1-4 1v-1.5l2-1.5z"/>',
  bus:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 21v-3M16 21v-3"/><circle cx="8.5" cy="14.5" r=".6"/><circle cx="15.5" cy="14.5" r=".6"/>',
  taxi:'<path d="M5 17V12l2-5h10l2 5v5zM3 12h18M9 7V5h6v2"/><circle cx="8" cy="17.5" r="1.5"/><circle cx="16" cy="17.5" r="1.5"/>',
  metro:'<circle cx="12" cy="12" r="9"/><path d="M8 16V8l4 5 4-5v8"/>',
  bed:'<path d="M3 19V6M3 14h18v5M21 14a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="11" r="2"/>',
  coffee:'<path d="M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M4 21h12M8 3c0 2 1 2 1 4M12 3c0 2 1 2 1 4"/>',
  food:'<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7M7 7h4M17 21V3c-2.5 1.5-3 5-3 8h3"/>',
  walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="M9 21l2.5-6 3 2.5V21M11.5 15l1-6.5 3.5 3H19M12.5 8.5L9 10l-1.5 3.5"/>',
  photo:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  monument:'<path d="M3 6h18M4 6v14h5v-6a3 3 0 0 1 6 0v6h5V6M5 3h14"/>',
  eiffel:'<path d="M12 2v3M10 5h4M10.5 5L9 12h6l-1.5-7M7 12h10M8 12l-3.5 9H8a4 4 0 0 1 8 0h3.5L16 12"/>',
  museum:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
  church:'<path d="M12 2v5M10 4h4M6 21V11l6-4 6 4v10M10 21v-4a2 2 0 0 1 4 0v4M4 21h16"/>',
  boat:'<path d="M3 15l2 5h14l2-5zM6 15v-5h12v5M9 10V7h6v3"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4 1.3 6L12 16.3l-5.4 3 1.3-6-4.5-4 6-.7z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  ticket:'<path d="M3 7h18v3.5a1.5 1.5 0 0 0 0 3V17H3v-3.5a1.5 1.5 0 0 0 0-3z"/><path d="M15 7v10" stroke-dasharray="2 2"/>',
  art:'<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.2-1-1.5-1-2.6 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  today:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  plan:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  guide:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7M8 11h5"/>',
  bag:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4h6v3M4 12h16"/>',
  locate:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  sunset:'<path d="M12 3v6M8 7l4 4 4-4M3 17h18M6 13l1 1M18 13l-1 1M7 21h10"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'
};
const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.pin}</svg>`;

/* ===================== estado ===================== */
let done = store.get("paris.done", {});
let tab = store.get("paris.tab", "hoy");
let sel = store.get("paris.sel", DAYS[0].id);
let mapDay = store.get("paris.mapDay", "all");
const open = new Set();
const save = () => store.set("paris.done", done);
const toggle = k => { done[k] = !done[k]; save(); };

/* ===================== hora de París ===================== */
function nowParis(){
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone:TZ, year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hourCycle:"h23" })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  return { date:`${p.year}-${p.month}-${p.day}`, min:Number(p.hour) * 60 + Number(p.minute) };
}
const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
// La madrugada (antes de las 5:00) cuenta como el día anterior del viaje.
function tripClock(){
  const n = nowParis();
  let day = DAYS.find(d => d.id === n.date), m = n.min;
  if (n.min < 300){ const prev = DAYS.find(d => d.id === addDays(n.date, -1)); if (prev){ day = prev; m = n.min + 1440; } }
  const phase = day ? "during" : (n.date < TRIP.from ? "before" : "after");
  return { day, min:m, date:n.date, phase };
}
function nowNext(day, min){
  let cur = -1;
  day.stops.forEach((s, i) => { if (mins(s) <= min) cur = i; });
  return { cur, next: cur + 1 < day.stops.length ? cur + 1 : -1 };
}
const inLabel = m => m >= 60 ? `dentro de ${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `dentro de ${m} min`;

/* ===================== tiempo (Open-Meteo, sin clave) ===================== */
let wx = store.get("paris.wx", null);
const WX = c => c === 0 ? ["Despejado", "sun"] : c <= 2 ? ["Algo nuboso", "partly"] : c === 3 ? ["Nublado", "cloud"]
  : c <= 48 ? ["Niebla", "fog"] : c <= 67 || (c >= 80 && c <= 82) ? ["Lluvia", "rain"] : c <= 77 || c <= 86 ? ["Nieve", "snow"] : ["Tormenta", "storm"];
const WXI = {
  sun:'<circle cx="12" cy="12" r="4.5" fill="#F0B54D" stroke="none"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" stroke="#F0B54D"/>',
  partly:'<circle cx="9" cy="9" r="3.6" fill="#F0B54D" stroke="none"/><path d="M8 19h9a3.5 3.5 0 0 0 .5-7 5 5 0 0 0-9.6 1.4A3 3 0 0 0 8 19z" fill="currentColor" stroke="none" opacity=".75"/>',
  cloud:'<path d="M7 18h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.6 1.6A3.3 3.3 0 0 0 7 18z" fill="currentColor" stroke="none" opacity=".7"/>',
  fog:'<path d="M4 9h16M6 13h12M4 17h16" stroke="currentColor" opacity=".7"/>',
  rain:'<path d="M7 14h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.6 1.6A3.3 3.3 0 0 0 7 14z" fill="currentColor" stroke="none" opacity=".7"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" stroke="#4E86C7"/>',
  snow:'<path d="M7 14h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.6 1.6A3.3 3.3 0 0 0 7 14z" fill="currentColor" stroke="none" opacity=".7"/><path d="M8 18h.01M12 20h.01M16 18h.01" stroke="#7FA7D6" stroke-width="2.6"/>',
  storm:'<path d="M7 14h10a4 4 0 0 0 .6-8 5.5 5.5 0 0 0-10.6 1.6A3.3 3.3 0 0 0 7 14z" fill="currentColor" stroke="none" opacity=".7"/><path d="M12 14l-2 4h3l-2 4" stroke="#F0B54D"/>'
};
const wxIcon = k => `<svg class="wxi" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">${WXI[k]}</svg>`;
async function loadWeather(){
  if (!navigator.onLine) return;
  if (wx && Date.now() - wx.at < 3 * 3600e3) return;
  const u = `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset&timezone=Europe%2FParis&start_date=${TRIP.from}&end_date=${TRIP.to}`;
  try {
    const r = await fetch(u); if (!r.ok) return;
    const j = await r.json(), d = j.daily, days = {};
    d.time.forEach((t, i) => days[t] = { code:d.weather_code[i], max:Math.round(d.temperature_2m_max[i]), min:Math.round(d.temperature_2m_min[i]), rain:d.precipitation_probability_max[i], sunset:(d.sunset[i] || "").slice(11, 16) });
    wx = { at:Date.now(), days }; store.set("paris.wx", wx); render();
  } catch {}
}
const wxOf = id => wx && wx.days && wx.days[id];

/* ===================== piezas comunes ===================== */
const plaque = (top, main, cls = "") => `<div class="plaque ${cls}"><div class="plaque-in">${top ? `<small>${top}</small>` : ""}<b>${main}</b></div></div>`;
const scene = (d, id) => `<figure class="scene">${Scenes.draw(d.scene, id)}</figure>`;
const checkBtn = (key, label = "Marcar como hecho") => `<button class="chk${done[key] ? " on" : ""}" data-key="${key}" aria-pressed="${!!done[key]}" aria-label="${label}">${icon("check")}</button>`;
const goBtn = (q, mode, label = "Cómo llegar", cls = "") => `<a class="btn ${cls}" target="_blank" rel="noopener" href="${mapsUrl(q, mode)}">${icon("pin")}${label}</a>`;
function wireChecks(root = document){
  $$(".chk[data-key]", root).forEach(b => b.onclick = e => { e.stopPropagation(); toggle(b.dataset.key); render(); });
}
function checklist(items){
  const n = items.filter(i => done[i.id]).length;
  return `<div class="meter"><i style="width:${n / items.length * 100}%"></i></div>
    <ul class="checks">${items.map(i => `<li class="${done[i.id] ? "on" : ""}">${checkBtn(i.id)}<div><span>${esc(i.text)}</span>${i.sub ? `<small>${esc(i.sub)}</small>` : ""}</div></li>`).join("")}</ul>`;
}
function wxChip(id, full){
  const w = wxOf(id); if (!w) return "";
  const [label, k] = WX(w.code);
  return `<div class="wx${full ? " full" : ""}">${wxIcon(k)}<b>${w.max}°</b><span class="lo">${w.min}°</span>${full ? `<span class="wxl">${label}</span>` : ""}<span class="rain">${icon("drop")}${w.rain ?? 0}%</span>${full && w.sunset ? `<span class="rain">${icon("sunset")}${w.sunset}</span>` : ""}</div>`;
}

/* ===================== entradas guardadas en el móvil ===================== */
// Los PDF o fotos de las entradas se guardan en este teléfono (IndexedDB), nunca en la web.
const TicketDB = (() => {
  let dbp;
  const db = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open("paris-entradas", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("files");
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const run = (mode, fn) => db().then(d => new Promise((res, rej) => {
    const t = d.transaction("files", mode), q = fn(t.objectStore("files"));
    t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error);
  }));
  return {
    get: k => run("readonly", s => s.get(k)),
    put: (k, v) => run("readwrite", s => s.put(v, k)),
    del: k => run("readwrite", s => s.delete(k)),
    keys: () => run("readonly", s => s.getAllKeys())
  };
})();
let saved = new Set();
const refreshSaved = () => TicketDB.keys().then(k => { saved = new Set(k); }).catch(() => {});
const BOOKING_NAME = Object.fromEntries(BOOKINGS.map(b => [b.id, b.what]).concat(FLIGHTS.map(f => [f.id, `Vuelo ${f.code}`])));

const viewBtn = (id, cls = "") => saved.has(id) ? `<button class="btn ticketbtn ${cls}" data-viewtk="${id}">${icon("ticket")}Ver entradas</button>` : "";
function attachControls(id){
  return saved.has(id)
    ? `<div class="attach">${viewBtn(id, "primary")}<button class="btn ghost" data-pick="${id}">Cambiar</button><button class="btn ghost danger" data-unpick="${id}">Quitar</button></div>`
    : `<div class="attach"><button class="btn" data-pick="${id}">${icon("ticket")}Añadir entradas</button><span class="muted">PDF o foto</span></div>`;
}
function pickFile(id){
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "application/pdf,image/*";
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      await TicketDB.put(id, { name:f.name, type:f.type || (f.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"), data:await f.arrayBuffer(), added:Date.now() });
      navigator.storage?.persist?.();
      await refreshSaved(); render(true);
    } catch { alert("No se ha podido guardar el archivo en este móvil."); }
  };
  inp.click();
}

let pdfjsReady = null;
const loadPdfjs = () => pdfjsReady || (pdfjsReady = new Promise((res, rej) => {
  const s = document.createElement("script"); s.src = "vendor/pdf.min.js";
  s.onload = () => { pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js"; res(pdfjsLib); };
  s.onerror = rej; document.head.appendChild(s);
}));
async function openTicket(id){
  const rec = await TicketDB.get(id); if (!rec) return;
  const v = $("#viewer"), body = $("#viewer .vbody");
  $("#viewer .vtitle").textContent = BOOKING_NAME[id] || "Entradas";
  body.innerHTML = `<p class="vload">Abriendo…</p>`;
  v.hidden = false; document.body.classList.add("noscroll");
  if (!rec.type.includes("pdf")){
    const url = URL.createObjectURL(new Blob([rec.data], { type:rec.type }));
    body.innerHTML = `<img class="vpage" src="${url}" alt="Entrada">`;
    return;
  }
  try {
    const lib = await loadPdfjs();
    const pdf = await lib.getDocument({ data:new Uint8Array(rec.data.slice(0)) }).promise;
    body.innerHTML = "";
    const w = Math.min(body.clientWidth - 24, 900), dpr = Math.min(devicePixelRatio || 1, 3);
    for (let n = 1; n <= pdf.numPages; n++){
      const page = await pdf.getPage(n), vp1 = page.getViewport({ scale:1 }), vp = page.getViewport({ scale:(w / vp1.width) * dpr });
      const fig = document.createElement("figure"); fig.className = "vfig";
      const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height; c.className = "vpage";
      fig.appendChild(c);
      const cap = document.createElement("figcaption"); cap.textContent = `Página ${n} de ${pdf.numPages}`; fig.appendChild(cap);
      body.appendChild(fig);
      await page.render({ canvasContext:c.getContext("2d"), viewport:vp }).promise;
    }
  } catch { body.innerHTML = `<p class="vload">No se ha podido abrir el PDF. Prueba a cargarlo otra vez.</p>`; }
}
function closeViewer(){ $("#viewer").hidden = true; $("#viewer .vbody").innerHTML = ""; document.body.classList.remove("noscroll"); }

/* ===================== HOY ===================== */
function viewHoy(){
  const c = tripClock();
  if (c.phase === "before"){
    const left = Math.round((new Date(TRIP.from + "T00:00:00Z") - new Date(c.date + "T00:00:00Z")) / 864e5);
    const pend = BEFORE.filter(b => !done[b.id]).length;
    return `
      ${scene(DAYS[0], "h0")}
      <section class="hero-text">
        <p class="kicker">Viernes 30 de octubre</p>
        <h1 class="count">${left === 1 ? "Mañana" : `Faltan ${left} días`}</h1>
        <p class="lead">Salís de Sevilla a las 19:30 y dormís en París. ${pend ? `Quedan ${pend} cosas por dejar listas.` : "Está todo listo."}</p>
      </section>
      <section class="block"><h2>Antes de salir</h2>${checklist(BEFORE)}</section>
      <section class="block"><h2>El tiempo en París</h2>
        <div class="wxrow">${DAYS.map(d => `<button class="wxday" data-day="${d.id}"><span class="wd">${d.short} ${d.n}</span>${wxChip(d.id) || `<span class="muted">Sin datos</span>`}</button>`).join("")}</div>
        ${wx ? "" : `<p class="note">La previsión se carga cuando hay conexión.</p>`}
      </section>
      <section class="block"><h2>Los cuatro días</h2>
        <div class="daycards">${DAYS.map(d => `<button class="daycard" data-day="${d.id}" style="--dc:${d.color}">${scene(d, "dc" + d.n)}<div><span>${d.wd} ${d.n}</span><b>${esc(d.title)}</b></div></button>`).join("")}</div>
      </section>`;
  }
  if (c.phase === "after"){
    return `${scene(DAYS[3], "h9")}<section class="hero-text"><h1 class="count">De vuelta en casa</h1><p class="lead">El itinerario sigue aquí, con vuestras notas de cada día.</p></section>`;
  }
  const d = c.day, { cur, next } = nowNext(d, c.min), s = d.stops[cur], n = d.stops[next];
  const rest = d.stops.map((x, i) => ({ x, i })).filter(o => o.i > cur);
  return `
    ${scene(d, "h1")}
    <section class="hero-text">
      ${plaque(d.wd, `${d.n} ${d.id.slice(5, 7) === "10" ? "octubre" : "noviembre"}`, "sm")}
      <h1 class="day-title">${esc(d.title)}</h1>
      ${wxChip(d.id, true)}
    </section>
    <section class="nowcard">
      <div class="now-now">
        <span class="lbl">Ahora</span>
        <div class="now-row">${s ? `<span class="kind">${icon(s.kind)}</span><div><b>${esc(s.title)}</b><small>desde las ${s.t}</small></div>` : `<div><b>El día aún no ha empezado</b></div>`}</div>
      </div>
      ${n ? `<div class="now-next">
        <span class="lbl">Siguiente · ${inLabel(Math.max(0, mins(n) - c.min))}</span>
        <div class="now-row"><span class="kind">${icon(n.kind)}</span><div><b>${esc(n.title)}</b><small>a las ${n.t}${n.note ? ` · ${rich(n.note)}` : ""}</small></div></div>
        <div class="acts">${n.maps ? goBtn(n.maps, n.mode, "Cómo llegar", "primary") : ""}${n.booking ? viewBtn(n.booking) : ""}${s && s.booking && s.booking !== n.booking ? viewBtn(s.booking) : ""}</div>
      </div>` : `<div class="now-next"><span class="lbl">Siguiente</span><div class="now-row"><div><b>Fin del día</b><small>A descansar.</small></div></div></div>`}
    </section>
    ${rest.length ? `<section class="block"><h2>Lo que queda hoy</h2>
      <ul class="mini">${rest.map(({ x, i }) => `<li class="${done[d.id + "#" + i] ? "on" : ""}"><span class="mt">${x.t}</span><span class="kind">${icon(x.kind)}</span><button class="mtt" data-open="${d.id}#${i}">${esc(x.title)}</button>${checkBtn(d.id + "#" + i)}</li>`).join("")}</ul></section>` : ""}
    <section class="block">${goBtn(HOTEL.maps, "transit", "Volver al hotel", "wide")}</section>`;
}

/* ===================== PLAN ===================== */
function viewPlan(){
  const c = tripClock(), d = DAYS.find(x => x.id === sel) || DAYS[0];
  const isToday = c.day && c.day.id === d.id;
  const cur = isToday ? nowNext(d, c.min).cur : -1;
  const nDone = d.stops.filter((s, i) => done[d.id + "#" + i]).length;
  const plaques = DAYS.map(x => `<button class="dayplaque${x.id === d.id ? " sel" : ""}${c.day && c.day.id === x.id ? " today" : ""}" data-sel="${x.id}">${plaque(x.short, x.n)}</button>`).join("");
  const stops = d.stops.map((s, i) => {
    const key = d.id + "#" + i, isOpen = open.has(key), has = s.more || s.maps || (s.booking && saved.has(s.booking));
    const cls = ["stop", s.fixed && "fixed", done[key] && "done", i === cur && "current", isOpen && "open"].filter(Boolean).join(" ");
    return `<li class="${cls}" id="stop-${i}">
      <div class="t">${s.t}${s.next ? `<small>+1</small>` : ""}</div>
      <div class="node"><span class="kind">${icon(s.kind)}</span></div>
      <article class="card">
        <header ${has ? `data-tog="${key}" role="button" tabindex="0" aria-expanded="${isOpen}"` : ""}>
          <div class="ttl"><h3>${esc(s.title)}</h3>${s.note ? `<p>${rich(s.note)}</p>` : ""}
            <div class="tags">${s.fixed ? `<span class="tag res">${icon("ticket")}Reservado</span>` : ""}${s.todo ? `<span class="tag todo">${esc(s.todo)}</span>` : ""}${i === cur ? `<span class="tag now">Ahora</span>` : ""}</div>
          </div>
          ${checkBtn(key)}
        </header>
        ${has ? `<div class="more" ${isOpen ? "" : "hidden"}>
          ${s.more ? `<ul>${s.more.map(m => `<li>${rich(m)}</li>`).join("")}</ul>` : ""}
          ${s.maps || (s.booking && saved.has(s.booking)) ? `<div class="acts">${s.booking ? viewBtn(s.booking, "primary") : ""}${s.maps ? goBtn(s.maps, s.mode) : ""}${where(s) ? `<button class="btn ghost" data-showmap="${d.id}">${icon("map")}Ver en el mapa</button>` : ""}</div>` : ""}
        </div>
        <button class="morebtn" data-tog="${key}" aria-label="${isOpen ? "Ocultar detalles" : "Ver detalles"}">${icon("chev")}</button>` : ""}
      </article></li>`;
  }).join("");
  return `
    <nav class="plaques" aria-label="Días">${plaques}</nav>
    ${scene(d, "p" + d.n)}
    <section class="hero-text">
      <p class="kicker">${d.wd} ${d.n} de ${d.id.slice(5, 7) === "10" ? "octubre" : "noviembre"}</p>
      <h1 class="day-title">${esc(d.title)}</h1>
      <p class="lead">${rich(d.intro)}</p>
      <div class="dayfacts">${wxChip(d.id, true)}<span class="progress-txt">${nDone} de ${d.stops.length} hechas</span></div>
      <div class="meter"><i style="width:${nDone / d.stops.length * 100}%;background:${d.color}"></i></div>
    </section>
    <ol class="timeline" style="--dc:${d.color}">${stops}</ol>
    <section class="block"><h2>Notas del día</h2>
      <textarea id="note" placeholder="Un restaurante que os han recomendado, algo que queda pendiente…">${esc(store.get("paris.note." + d.id, ""))}</textarea></section>`;
}

/* ===================== MAPA ===================== */
let map = null, meMarker = null, mapItems = [], mapBounds = null;
function viewMapa(){
  const chips = [{ id:"all", label:"Todo el viaje", color:"var(--ink)" }].concat(DAYS.map(d => ({ id:d.id, label:`${d.short} ${d.n}`, color:d.color })))
    .map(x => `<button class="chip${mapDay === x.id ? " sel" : ""}" data-mapday="${x.id}" style="--dc:${x.color}"><i></i>${x.label}</button>`).join("");
  return `
    <div class="chips">${chips}</div>
    <div class="mapbox"><div id="map"></div>
      <div class="mapctl"><button class="fab" id="locate" aria-label="Dónde estoy">${icon("locate")}</button><button class="fab" id="fitall" aria-label="Ver todo">${icon("expand")}</button></div>
    </div>
    <ol class="mlist" id="mlist"></ol>
    <p class="note">El mapa se guarda a medida que lo veis. Abridlo con conexión antes de salir y tendréis también sin internet las zonas que hayáis visto.</p>`;
}
function pinIcon(color, txt, extra = ""){
  return L.divIcon({ className:"", html:`<div class="pin ${extra}" style="--pc:${color}">${txt}</div>`, iconSize:[30, 30], iconAnchor:[15, 15], popupAnchor:[0, -15] });
}
function drawMap(){
  if (map){ map.remove(); map = null; meMarker = null; }
  if (typeof L === "undefined"){ $("#map").innerHTML = `<p class="note pad">El mapa no se ha podido cargar.</p>`; return; }
  map = L.map("map", { zoomControl:false });
  L.control.zoom({ position:"bottomleft" }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19, attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  const c = tripClock(), days = mapDay === "all" ? DAYS : DAYS.filter(d => d.id === mapDay);
  mapItems = [];
  days.forEach(d => {
    const cur = c.day && c.day.id === d.id ? nowNext(d, c.min).cur : -1;
    const route = []; let n = 0;
    d.stops.forEach((s, i) => {
      const ll = where(s); if (!ll) return;
      if (mapDay === "all" && (ll[0] > 49 || ll[0] < 48.8)) return;   // en la vista general quedan fuera Beauvais y Orly
      const last = route[route.length - 1];
      if (!last || last[0] !== ll[0] || last[1] !== ll[1]) route.push(ll);
      if (s.maps === HOTEL.maps) return;
      n++;
      const key = d.id + "#" + i;
      const m = L.marker(ll, { icon:pinIcon(d.color, n, [done[key] && "done", i === cur && "current", s.fixed && "fixed"].filter(Boolean).join(" ")), zIndexOffset: i === cur ? 1000 : 0 }).addTo(map)
        .bindPopup(`<span class="pd" style="color:${d.color}">${d.wd} ${d.n} · ${s.t}</span><b>${esc(s.title)}</b>${s.note ? `<p>${rich(s.note)}</p>` : ""}<a target="_blank" rel="noopener" href="${mapsUrl(s.maps, s.mode)}">Cómo llegar</a>`, { maxWidth:260, autoPanPadding:[24, 24] });
      mapItems.push({ d, s, n, m, key });
    });
    if (route.length > 1) L.polyline(route, { color:d.color, weight:4, opacity:.85, dashArray:"1 9", lineCap:"round" }).addTo(map);
  });
  const hotel = PLACES[HOTEL.maps];
  L.marker(hotel, { icon:L.divIcon({ className:"", html:`<div class="pin hotel">${icon("bed")}</div>`, iconSize:[34, 34], iconAnchor:[17, 17], popupAnchor:[0, -17] }), zIndexOffset:500 })
    .addTo(map).bindPopup(`<span class="pd">Vuestro hotel</span><b>${esc(HOTEL.name)}</b><p>${esc(HOTEL.address)}</p><a target="_blank" rel="noopener" href="${mapsUrl(HOTEL.maps, "transit")}">Cómo llegar</a>`);
  const pts = mapItems.map(x => x.m.getLatLng());
  mapBounds = L.latLngBounds(pts.length ? pts.concat([hotel]) : [hotel]);
  const fit = () => map.fitBounds(mapBounds, { padding:[34, 34], maxZoom:16 });
  fit(); setTimeout(() => { map.invalidateSize(); fit(); }, 80);

  $("#mlist").innerHTML = mapDay === "all"
    ? DAYS.map(d => `<li class="legend"><button data-mapday="${d.id}" style="--dc:${d.color}"><i></i><span><b>${d.wd} ${d.n}</b> ${esc(d.title)}</span>${icon("chev", "r")}</button></li>`).join("")
    : mapItems.map((x, k) => `<li><button data-mi="${k}"><span class="pin sm ${done[x.key] ? "done" : ""}" style="--pc:${x.d.color}">${x.n}</span><span class="mt">${x.s.t}</span><span class="mtt">${esc(x.s.title)}</span></button></li>`).join("");
  $$("#mlist [data-mi]").forEach(b => b.onclick = () => {
    const it = mapItems[Number(b.dataset.mi)];
    $(".mapbox").scrollIntoView({ behavior:"smooth", block:"start" });
    map.flyTo(it.m.getLatLng(), 16, { duration:.6 }); setTimeout(() => it.m.openPopup(), 650);
  });
  $("#fitall").onclick = () => { map.closePopup(); fit(); };
  $("#locate").onclick = () => {
    if (!navigator.geolocation) return alert("Este móvil no da la ubicación.");
    navigator.geolocation.getCurrentPosition(p => {
      const ll = [p.coords.latitude, p.coords.longitude];
      if (meMarker) meMarker.setLatLng(ll);
      else meMarker = L.marker(ll, { icon:L.divIcon({ className:"", html:'<div class="me"></div>', iconSize:[18, 18], iconAnchor:[9, 9] }), zIndexOffset:2000 }).addTo(map);
      map.flyTo(ll, 16, { duration:.6 });
    }, () => alert("No se ha podido obtener la ubicación. Revisa que la app tenga permiso."), { enableHighAccuracy:true, timeout:10000, maximumAge:30000 });
  };
}

/* ===================== GUÍA ===================== */
function viewGuia(){
  return `
    <header class="pagehead"><h1>Guía</h1><p class="lead">Lo práctico para moverse, pedir y no llevarse sustos.</p></header>
    <section class="block"><h2>Las líneas de metro que vais a usar</h2>
      <ul class="lines">${METRO.map(m => `<li>${lineBadge(m.line)}<p>${rich(m.use)}</p></li>`).join("")}</ul>
      <p class="note">Los billetes se compran en las máquinas de cualquier estación o en la app Bonjour RATP. Guardad el billete hasta salir: puede haber revisores.</p>
    </section>
    <section class="block"><h2>Frases útiles</h2>
      <ul class="phrases">${PHRASES.map(p => `<li><b lang="fr">${esc(p.fr)}</b><span class="say">${esc(p.say)}</span><small>${esc(p.es)}</small></li>`).join("")}</ul>
    </section>
    <section class="block"><h2>Dónde comer</h2>
      <ul class="eat">${EAT.map(e => `<li><div><small>${esc(e.zone)}</small><b>${esc(e.name)}</b><p>${esc(e.what)}</p><span class="addr">${esc(e.where)}</span></div>${goBtn(e.maps, "transit", "Ir")}</li>`).join("")}</ul>
      <p class="note">Sugerencias conocidas, no reservas. Comprobad el horario antes de ir, sobre todo el domingo festivo.</p>
    </section>
    <section class="block"><h2>Consejos</h2>
      <dl class="tips">${TIPS.map(t => `<div><dt>${esc(t.title)}</dt><dd>${esc(t.text)}</dd></div>`).join("")}</dl>
    </section>
    <section class="block"><h2>Emergencias</h2>
      <div class="sos">${EMERGENCY.map(e => `<a class="sosbtn" href="tel:${e.tel}">${icon("phone")}<b>${e.tel}</b><span>${esc(e.label)}</span></a>`).join("")}</div>
      <div class="embassy"><div><b>${esc(EMBASSY.name)}</b><p>${esc(EMBASSY.address)}</p></div>${goBtn(EMBASSY.maps, "transit", "Ir")}</div>
    </section>`;
}

/* ===================== VIAJE ===================== */
function viewViaje(){
  const passes = FLIGHTS.map(f => `
    <article class="pass">
      <div class="pass-top"><span>${esc(f.airline)}</span><b>${esc(f.code)}</b><span>${esc(f.date)}</span></div>
      <div class="pass-route">
        <div><b class="iata">${f.from}</b><small>${esc(f.fromName)}</small><span class="hr">${f.dep}</span></div>
        <div class="pass-plane">${icon("plane")}</div>
        <div class="r"><b class="iata">${f.to}</b><small>${esc(f.toName)}</small><span class="hr">${f.arr}</span></div>
      </div>
      <div class="pass-foot">${attachControls(f.id).replace(/>Añadir entradas</, ">Añadir tarjetas de embarque<")}</div>
    </article>`).join("");
  const tickets = BOOKINGS.map(b => `
    <article class="ticket${b.pending ? " pending" : ""}">
      <div class="stub">${icon(b.kind)}</div>
      <div class="tk-body">
        <small>${esc(b.when)}</small><b>${esc(b.what)}</b><span>${esc(b.detail)}</span>
        ${b.tip ? `<span class="tktip">${esc(b.tip)}</span>` : ""}
        ${b.pending ? `<span class="tag todo">Pendiente</span>` : ""}
        ${attachControls(b.id)}
        <input class="code" data-code="${b.id}" value="${esc(store.get("paris.code." + b.id, ""))}" placeholder="Código de reserva" autocomplete="off" enterkeyhint="done">
      </div>
    </article>`).join("");
  return `
    <header class="pagehead"><h1>Viaje</h1><p class="lead">Vuelos, hotel, reservas y lo que hay que llevar.</p></header>
    <section class="block"><h2>Vuelos</h2>${passes}</section>
    <section class="block"><h2>Hotel</h2>
      <div class="hotel">
        ${plaque(`${HOTEL.arr}<sup>e</sup> Arr<sup>t</sup>`, esc(HOTEL.street), "street")}
        <p><b>${esc(HOTEL.name)}</b><br>${esc(HOTEL.address)}</p>
        <p class="metroline">${rich(HOTEL.metro)}</p>
        ${goBtn(HOTEL.maps, "transit", "Cómo llegar al hotel", "primary wide")}
      </div>
    </section>
    <section class="block"><h2>Reservas</h2><div class="tickets">${tickets}</div>
      <p class="note">Las entradas y los códigos se guardan solo en este móvil, no en la web, y se abren sin conexión. Cada uno puede cargar las suyas desde el PDF que os llegó por correo.</p></section>
    <section class="block"><h2>Antes de salir</h2>${checklist(BEFORE)}</section>
    <section class="block"><h2>En la maleta</h2>${checklist(PACK)}</section>`;
}

/* ===================== render y navegación ===================== */
const VIEWS = { hoy:viewHoy, plan:viewPlan, mapa:viewMapa, guia:viewGuia, viaje:viewViaje };
function render(keepScroll){
  const y = scrollY;
  if (map && tab !== "mapa"){ map.remove(); map = null; }
  $("#app").innerHTML = VIEWS[tab]();
  $("#app").dataset.tab = tab;
  $$(".tabbar button").forEach(b => b.setAttribute("aria-current", b.dataset.tab === tab ? "page" : "false"));
  wireChecks($("#app"));
  wire();
  if (tab === "mapa") drawMap();
  if (keepScroll) scrollTo(0, y);
  $("#offline").hidden = navigator.onLine;
}
function go(t, opts = {}){
  tab = t; store.set("paris.tab", tab);
  if (opts.day){ sel = opts.day; store.set("paris.sel", sel); }
  render();
  scrollTo(0, 0);
  if (opts.stop != null){
    const el = document.getElementById("stop-" + opts.stop);
    if (el) setTimeout(() => el.scrollIntoView({ behavior:"smooth", block:"center" }), 60);
  }
}
function wire(){
  $$("[data-sel]").forEach(b => b.onclick = () => { sel = b.dataset.sel; store.set("paris.sel", sel); render(); });
  $$("[data-day]").forEach(b => b.onclick = () => go("plan", { day:b.dataset.day }));
  $$("[data-tog]").forEach(b => {
    const f = () => { const k = b.dataset.tog; open.has(k) ? open.delete(k) : open.add(k); render(true); };
    b.onclick = e => { if (e.target.closest(".chk, a")) return; f(); };
    b.onkeydown = e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); f(); } };
  });
  $$("[data-open]").forEach(b => b.onclick = () => { const [d, i] = b.dataset.open.split("#"); open.add(b.dataset.open); go("plan", { day:d, stop:Number(i) }); });
  $$("[data-showmap]").forEach(b => b.onclick = () => { mapDay = b.dataset.showmap; store.set("paris.mapDay", mapDay); go("mapa"); });
  $$("[data-mapday]").forEach(b => b.onclick = () => { mapDay = b.dataset.mapday; store.set("paris.mapDay", mapDay); render(); });
  const note = $("#note"); if (note) note.oninput = e => store.set("paris.note." + sel, e.target.value);
  $$("[data-code]").forEach(i => i.oninput = () => store.set("paris.code." + i.dataset.code, i.value));
  $$("[data-viewtk]").forEach(b => b.onclick = e => { e.stopPropagation(); openTicket(b.dataset.viewtk); });
  $$("[data-pick]").forEach(b => b.onclick = () => pickFile(b.dataset.pick));
  $$("[data-unpick]").forEach(b => b.onclick = async () => {
    if (!confirm("¿Quitar las entradas guardadas en este móvil?")) return;
    await TicketDB.del(b.dataset.unpick); await refreshSaved(); render(true);
  });
}
$("#viewer .vclose").onclick = closeViewer;
addEventListener("keydown", e => { if (e.key === "Escape" && !$("#viewer").hidden) closeViewer(); });

$$(".tabbar button").forEach(b => b.onclick = () => {
  if (b.dataset.tab === "plan" && tab === "plan"){ const c = tripClock(); if (c.day){ sel = c.day.id; store.set("paris.sel", sel); } }
  go(b.dataset.tab);
});

// Durante el viaje se abre en "Hoy" con el día en curso seleccionado.
(() => { const c = tripClock(); if (c.day){ sel = c.day.id; if (!store.get("paris.opened." + c.date, false)){ tab = "hoy"; store.set("paris.opened." + c.date, true); } } })();
render();
refreshSaved().then(() => { if (saved.size) render(true); });
loadWeather();
addEventListener("online", () => { render(true); loadWeather(); });
addEventListener("offline", () => render(true));
document.addEventListener("visibilitychange", () => { if (!document.hidden && tab === "hoy") render(true); });
setInterval(() => { if (tab === "hoy" && !document.activeElement?.matches("input,textarea")) render(true); }, 60000);
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
