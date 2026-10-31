// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: monument;

// ============================================================
//  París en familia · widget y avisos
//
//  · Al abrirlo en Scriptable programa un aviso a la hora de
//    cada parada que queda (y uno antes en lo importante).
//  · Como widget muestra qué toca ahora y lo siguiente.
//    Vale para la pantalla de inicio y la de bloqueo.
//  · Funciona sin conexión.
// ============================================================

const APP_URL = "https://agusmltkd.github.io/paris/";   // al tocar el widget se abre la app
const STOPS = /*STOPS*/[];
const DAYS = /*DAYS*/{};
const HOTEL_LL = /*HOTEL*/[];

const BLUE = new Color("#22346B"), GREEN = new Color("#2E6B4E"), AMBER = new Color("#F0B54D");
const WHITE = Color.white(), SOFT = new Color("#ffffff", 0.72), FAINT = new Color("#ffffff", 0.5);
const now = new Date();
const list = STOPS.map((s, i) => ({ ...s, i, date: new Date(s.at) }));

// Parada en curso = la última cuya hora ya ha pasado (hasta 3 h después).
let cur = null, next = null;
for (const s of list){ if (s.date <= now) cur = s; else { next = s; break; } }
if (cur && next === null && now - cur.date > 3 * 3600e3) cur = null;
const sameDay = (a, b) => a && b && a.day === b.day;
const upcoming = list.filter(s => s.date > now);

/* ---------------- avisos ---------------- */
async function scheduleAll(){
  const mine = (await Notification.allPending()).filter(n => (n.identifier || "").startsWith("paris-"));
  Notification.removePending(mine.map(n => n.identifier));
  let count = 0;
  for (const s of upcoming){
    const at = new Notification();
    at.identifier = `paris-${s.i}`;
    at.title = `${s.e} ${s.title}`;
    at.body = s.note || `${s.day} · ${s.t}`;
    at.threadIdentifier = "paris";
    at.openURL = APP_URL;
    at.setTriggerDate(s.date);
    await at.schedule(); count++;

    const before = new Date(s.date.getTime() - s.lead * 60e3);
    if (s.lead && before > now){
      const pre = new Notification();
      pre.identifier = `paris-${s.i}-antes`;
      pre.title = `En ${s.lead} min: ${s.title}`;
      pre.body = `A las ${s.t}. ${s.note || ""}`.trim();
      pre.threadIdentifier = "paris";
      pre.openURL = APP_URL;
      pre.setTriggerDate(before);
      await pre.schedule(); count++;
    }
  }
  return count;
}

/* ---------------- widget ---------------- */
function base(){
  const w = new ListWidget();
  const g = new LinearGradient();
  g.colors = [new Color("#2A3F7E"), BLUE]; g.locations = [0, 1];
  w.backgroundGradient = g;
  w.url = APP_URL;
  // Que iOS lo vuelva a pintar cuando cambie la parada
  if (next) w.refreshAfterDate = new Date(next.date.getTime() + 1000);
  return w;
}
function label(stack, text, size, color, weight = "semibold"){
  const t = stack.addText(text);
  t.font = weight === "bold" ? Font.boldSystemFont(size) : weight === "regular" ? Font.systemFont(size) : Font.semiboldSystemFont(size);
  t.textColor = color; t.lineLimit = 2; t.minimumScaleFactor = 0.7;
  return t;
}
function countdown(stack, date, size, color){
  const d = stack.addDate(date); d.applyRelativeStyle();
  d.font = Font.semiboldSystemFont(size); d.textColor = color; d.lineLimit = 1;
}
function header(w, text){
  const h = w.addStack(); h.centerAlignContent();
  const plate = h.addStack();
  plate.backgroundColor = BLUE; plate.borderColor = GREEN; plate.borderWidth = 2; plate.cornerRadius = 5;
  plate.setPadding(1, 6, 2, 6);
  const t = plate.addText("PARÍS"); t.font = Font.heavySystemFont(10); t.textColor = WHITE;
  h.addSpacer(6);
  label(h, text, 11, FAINT);
}

function small(){
  const w = base(); w.setPadding(12, 12, 12, 12);
  header(w, cur ? cur.day : next ? next.day : "");
  w.addSpacer(8);
  if (cur && (!next || now - cur.date < 4 * 3600e3)){
    label(w, "Ahora", 10, AMBER);
    label(w, `${cur.e} ${cur.title}`, 14, WHITE, "bold");
    w.addSpacer();
  } else w.addSpacer();
  if (next){
    label(w, `Siguiente · ${next.t}`, 10, AMBER);
    label(w, `${next.e} ${next.title}`, 12, SOFT);
    countdown(w, next.date, 11, FAINT);
  } else label(w, "Fin del viaje", 14, WHITE, "bold");
  return w;
}

function medium(){
  const w = base(); w.setPadding(12, 14, 12, 14);
  header(w, cur ? cur.day : next ? next.day : "");
  w.addSpacer(8);
  const row = w.addStack(); row.topAlignContent();
  const left = row.addStack(); left.layoutVertically(); left.size = new Size(0, 0);
  label(left, "Ahora", 10, AMBER);
  label(left, cur ? `${cur.e} ${cur.title}` : "Aún no ha empezado", 15, WHITE, "bold");
  if (cur && cur.note){ left.addSpacer(2); const n = label(left, cur.note, 10, FAINT, "regular"); n.lineLimit = 2; }
  row.addSpacer(12);
  const right = row.addStack(); right.layoutVertically();
  label(right, next ? `Siguiente · ${next.t}` : "Siguiente", 10, AMBER);
  if (next){ label(right, `${next.e} ${next.title}`, 13, WHITE); countdown(right, next.date, 11, FAINT); }
  else label(right, "Fin del viaje", 13, WHITE);
  w.addSpacer();
  const after = upcoming.slice(1, 3).filter(s => sameDay(s, next));
  if (after.length){
    const f = w.addStack();
    label(f, "Luego: " + after.map(s => `${s.t} ${s.title}`).join(" · "), 10, FAINT, "regular").lineLimit = 1;
  }
  return w;
}

/* ---------------- extras del widget grande ---------------- */
const FM = FileManager.local();
const cachePath = name => FM.joinPath(FM.documentsDirectory(), `paris-${name}.json`);
const readCache = name => { try { return JSON.parse(FM.readString(cachePath(name))); } catch { return null; } };
const writeCache = (name, v) => { try { FM.writeString(cachePath(name), JSON.stringify(v)); } catch {} };
const timeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);

// Tiempo del día (Open-Meteo, sin clave). Se guarda para usarlo sin conexión.
async function weather(dayId){
  let c = readCache("tiempo");
  if (!c || Date.now() - c.at > 3 * 3600e3){
    try {
      const r = new Request("https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m&timezone=Europe%2FParis&start_date=2026-10-30&end_date=2026-11-02");
      r.timeoutInterval = 6;
      const j = await timeout(r.loadJSON(), 7000);
      if (j && j.daily){ c = { at: Date.now(), now: j.current && j.current.temperature_2m, days: {} };
        j.daily.time.forEach((t, k) => c.days[t] = [j.daily.weather_code[k], Math.round(j.daily.temperature_2m_max[k]), Math.round(j.daily.temperature_2m_min[k]), j.daily.precipitation_probability_max[k]]);
        writeCache("tiempo", c); }
    } catch {}
  }
  if (!c || !c.days[dayId]) return null;
  const [code, max, min, rain] = c.days[dayId];
  const e = code === 0 ? "☀️" : code <= 2 ? "⛅" : code === 3 ? "☁️" : code <= 48 ? "🌫️" : code <= 67 || (code >= 80 && code <= 82) ? "🌧️" : code <= 86 ? "🌨️" : "⛈️";
  return { e, max, min, rain, now: Date.now() - c.at < 2 * 3600e3 && c.now != null ? Math.round(c.now) : null };
}

// Última posición conocida (si el móvil la da rápido; si no, la guardada).
async function here(){
  try { const l = await timeout(Location.current(), 4000); if (l){ const v = [l.latitude, l.longitude, Date.now()]; writeCache("pos", v); return v; } } catch {}
  const v = readCache("pos"); return v && Date.now() - v[2] < 3 * 3600e3 ? v : null;
}

const SEINE = [[48.8370,2.2660],[48.8437,2.2756],[48.8500,2.2830],[48.8550,2.2880],[48.8603,2.2935],[48.8630,2.2990],[48.8640,2.3060],[48.8642,2.3135],[48.8636,2.3215],[48.8620,2.3280],[48.8603,2.3330],[48.8585,2.3400],[48.8565,2.3445],[48.8545,2.3490],[48.8520,2.3540],[48.8490,2.3590],[48.8455,2.3655],[48.8400,2.3760],[48.8340,2.3850]];

// Mapa esquemático del día: posiciones reales, el Sena, el recorrido y dónde estáis.
function drawMap(stops, color, me, W, H){
  const ctx = new DrawContext(); ctx.size = new Size(W, H); ctx.opaque = false; ctx.respectScreenScale = true;
  ctx.setFillColor(new Color("#1C2B57")); ctx.fillRect(new Rect(0, 0, W, H));
  const pts = stops.filter(s => s.ll && !s.hotel).map(s => s.ll);
  if (!pts.length) pts.push(HOTEL_LL);
  if (me && pts.some(p => Math.abs(p[0] - me[0]) < .03 && Math.abs(p[1] - me[1]) < .04)) pts.push(me);
  const la = pts.map(p => p[0]), lo = pts.map(p => p[1]);
  const k = Math.cos(48.86 * Math.PI / 180);
  const cy = (Math.min(...la) + Math.max(...la)) / 2, cx = (Math.min(...lo) + Math.max(...lo)) / 2;
  const span = Math.max((Math.max(...lo) - Math.min(...lo)) * k / (W - 40), (Math.max(...la) - Math.min(...la)) / (H - 36), 0.004 / W);
  const X = l => W / 2 + (l - cx) * k / span, Y = l => H / 2 - (l - cy) / span;
  const P = p => new Point(X(p[1]), Y(p[0]));
  // cuadrícula de calles sugerida
  ctx.setStrokeColor(new Color("#ffffff", 0.05)); ctx.setLineWidth(1);
  for (let x = 0; x < W; x += 16){ const g = new Path(); g.move(new Point(x, 0)); g.addLine(new Point(x, H)); ctx.addPath(g); ctx.strokePath(); }
  for (let y = 0; y < H; y += 16){ const g = new Path(); g.move(new Point(0, y)); g.addLine(new Point(W, y)); ctx.addPath(g); ctx.strokePath(); }
  // el Sena
  const river = new Path(); river.addLines(SEINE.map(P));
  ctx.setStrokeColor(new Color("#4F6FB0", 0.85)); ctx.setLineWidth(Math.max(6, 0.0016 / span)); ctx.addPath(river); ctx.strokePath();
  // recorrido punteado
  const route = []; stops.forEach(s => { if (s.ll){ const l = route[route.length - 1]; if (!l || l[0] !== s.ll[0] || l[1] !== s.ll[1]) route.push(s.ll); } });
  ctx.setFillColor(new Color(color, 0.95));
  for (let a = 0; a < route.length - 1; a++){
    const p1 = P(route[a]), p2 = P(route[a + 1]), len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    for (let d = 0; d < len; d += 6){ const t = d / len; ctx.fillEllipse(new Rect(p1.x + (p2.x - p1.x) * t - 1.3, p1.y + (p2.y - p1.y) * t - 1.3, 2.6, 2.6)); }
  }
  // hotel
  const h = P(HOTEL_LL);
  if (h.x > -10 && h.x < W + 10 && h.y > -10 && h.y < H + 10){
    ctx.setFillColor(new Color("#2E6B4E")); ctx.fillRect(new Rect(h.x - 8, h.y - 8, 16, 16));
    ctx.setFillColor(BLUE); ctx.fillRect(new Rect(h.x - 6, h.y - 6, 12, 12));
    ctx.setFont(Font.boldSystemFont(9)); ctx.setTextColor(WHITE); ctx.setTextAlignedCenter();
    ctx.drawTextInRect("H", new Rect(h.x - 6, h.y - 6, 12, 12));
  }
  // paradas numeradas: hechas en gris, la actual con aro ámbar
  for (const s of stops.filter(s => s.ll && !s.hotel)){
    const p = P(s.ll), isCur = cur && s.i === cur.i, past = s.date <= now && !isCur, r = isCur ? 10 : 8;
    if (isCur){ ctx.setFillColor(AMBER); ctx.fillEllipse(new Rect(p.x - r - 3, p.y - r - 3, (r + 3) * 2, (r + 3) * 2)); }
    ctx.setFillColor(WHITE); ctx.fillEllipse(new Rect(p.x - r - 1.5, p.y - r - 1.5, (r + 1.5) * 2, (r + 1.5) * 2));
    ctx.setFillColor(past ? new Color("#7C869C") : new Color(color)); ctx.fillEllipse(new Rect(p.x - r, p.y - r, r * 2, r * 2));
    ctx.setFont(Font.boldSystemFont(isCur ? 11 : 9.5)); ctx.setTextColor(WHITE); ctx.setTextAlignedCenter();
    ctx.drawTextInRect(String(s.n), new Rect(p.x - r, p.y - r * 0.62, r * 2, r * 2));
  }
  // vosotros
  if (me){ const m = P(me);
    if (m.x > 0 && m.x < W && m.y > 0 && m.y < H){
      ctx.setFillColor(new Color("#2B7BE4", 0.3)); ctx.fillEllipse(new Rect(m.x - 11, m.y - 11, 22, 22));
      ctx.setFillColor(WHITE); ctx.fillEllipse(new Rect(m.x - 6, m.y - 6, 12, 12));
      ctx.setFillColor(new Color("#2B7BE4")); ctx.fillEllipse(new Rect(m.x - 4.5, m.y - 4.5, 9, 9));
    }
  }
  ctx.setFont(Font.italicSystemFont(9)); ctx.setTextColor(new Color("#9DB4F0", 0.8)); ctx.setTextAlignedLeft();
  ctx.drawTextInRect("la Seine", new Rect(6, H - 15, 60, 12));
  return ctx.getImage();
}

async function large(){
  const w = base(); w.setPadding(12, 13, 12, 13);
  const dayStop = cur && sameDay(cur, next) ? cur : (next || cur);
  if (!dayStop) return finished();
  const todays = list.filter(s => s.dayId === dayStop.dayId);
  const dcolor = (DAYS[dayStop.dayId] || {}).color || "#D9922E";
  const [wx, me] = await Promise.all([weather(dayStop.dayId), here()]);

  // Cabecera: placa, día y tiempo
  const h = w.addStack(); h.centerAlignContent();
  const plate = h.addStack(); plate.backgroundColor = BLUE; plate.borderColor = GREEN; plate.borderWidth = 2; plate.cornerRadius = 5; plate.setPadding(1, 6, 2, 6);
  const pt = plate.addText("PARÍS"); pt.font = Font.heavySystemFont(10); pt.textColor = WHITE;
  h.addSpacer(7);
  const ht = h.addStack(); ht.layoutVertically();
  label(ht, dayStop.day, 13, WHITE, "bold").lineLimit = 1;
  label(ht, (DAYS[dayStop.dayId] || {}).title || "", 10, FAINT, "regular").lineLimit = 1;
  h.addSpacer();
  if (wx){
    const wb = h.addStack(); wb.layoutVertically();
    const top = wb.addStack(); top.addSpacer();
    label(top, `${wx.e} ${wx.now != null && sameDay(dayStop, cur || dayStop) ? wx.now : wx.max}°`, 15, WHITE, "bold");
    const bot = wb.addStack(); bot.addSpacer();
    label(bot, `${wx.max}°/${wx.min}° · 💧${wx.rain ?? 0}%`, 9.5, FAINT, "regular");
  }
  w.addSpacer(8);

  // Mapa
  const img = w.addImage(drawMap(todays, dcolor, me, 320, 132));
  img.imageSize = new Size(320, 132); img.cornerRadius = 10; img.centerAlignImage();
  w.addSpacer(8);

  // Ahora | Siguiente
  const BOXH = 84;
  const row = w.addStack(); row.topAlignContent();
  const L = row.addStack(); L.layoutVertically(); L.backgroundColor = new Color("#ffffff", 0.08); L.cornerRadius = 9; L.setPadding(6, 8, 6, 8); L.size = new Size(152, BOXH);
  label(L, "Ahora", 9.5, AMBER);
  const isNow = cur && sameDay(cur, dayStop);
  label(L, isNow ? `${cur.e} ${cur.title}` : "Aún no ha empezado", 12.5, WHITE, "bold").lineLimit = 2;
  if (isNow){
    label(L, `desde las ${cur.t}`, 9.5, SOFT, "regular").lineLimit = 1;
    if (cur.note) label(L, cur.note, 9, FAINT, "regular").lineLimit = 2;
  }
  L.addSpacer();
  row.addSpacer(8);
  const R = row.addStack(); R.layoutVertically(); R.backgroundColor = new Color(dcolor, 0.28); R.cornerRadius = 9; R.setPadding(6, 8, 6, 8); R.size = new Size(152, BOXH);
  if (next){
    label(R, `Siguiente · ${next.t}`, 9.5, AMBER);
    label(R, `${next.n ? next.n + ". " : ""}${next.title}`, 12.5, WHITE, "bold").lineLimit = 2;
    countdown(R, next.date, 10, AMBER);
    if (next.leg) label(R, `${next.leg[1] === "a pie" ? "🚶" : next.leg[1] === "en metro" ? "🚇" : "🚕"} ${next.leg[0]} min ${next.leg[1]} · salid ${hhmm(new Date(next.date.getTime() - (next.leg[0] + 5) * 60e3))}`, 9.5, SOFT, "regular").lineLimit = 1;
  } else label(R, "Fin del viaje", 12.5, WHITE, "bold");
  R.addSpacer();
  w.addSpacer(8);

  // Luego
  const later = todays.filter(s => s.date > now && (!next || s.i !== next.i)).slice(0, 3);
  if (later.length){
    label(w, "Luego", 9.5, FAINT);
    w.addSpacer(2);
  }
  for (const s of later){
    const r = w.addStack(); r.centerAlignContent();
    const t = r.addText(s.t); t.font = Font.semiboldMonospacedSystemFont(10.5); t.textColor = SOFT;
    r.addSpacer(7);
    label(r, `${s.n ? s.n + ". " : ""}${s.e} ${s.title}`, 11, WHITE, "regular").lineLimit = 1;
    if (s.fixed){ r.addSpacer(5); const tag = r.addStack(); tag.backgroundColor = new Color(dcolor, 0.35); tag.cornerRadius = 4; tag.setPadding(1, 4, 1, 4); label(tag, "reservado", 8.5, WHITE); }
    r.addSpacer();
    w.addSpacer(3);
  }
  if (!later.length && !next){ label(w, "Buen viaje de vuelta.", 11, SOFT, "regular"); }
  w.addSpacer();

  // Progreso del día
  const doneN = todays.filter(s => s.date <= now).length;
  const pr = w.addStack(); pr.centerAlignContent();
  const bar = pr.addStack(); bar.size = new Size(230, 5); bar.cornerRadius = 2.5; bar.backgroundColor = new Color("#ffffff", 0.15);
  const fill = bar.addStack(); fill.size = new Size(Math.max(5, Math.round(230 * doneN / todays.length)), 5); fill.cornerRadius = 2.5; fill.backgroundColor = new Color(dcolor);
  bar.addSpacer();
  pr.addSpacer();
  label(pr, `${doneN} de ${todays.length}`, 9.5, FAINT, "regular");
  return w;
}

const hhmm = d => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

function lockRect(){
  const w = new ListWidget(); w.url = APP_URL;
  if (next) w.refreshAfterDate = new Date(next.date.getTime() + 1000);
  const top = w.addText(cur ? `Ahora · ${cur.title}` : "París"); top.font = Font.semiboldSystemFont(12); top.lineLimit = 1;
  if (next){
    const t = w.addText(`${next.t} ${next.title}`); t.font = Font.boldSystemFont(14); t.lineLimit = 1;
    const d = w.addDate(next.date); d.applyRelativeStyle(); d.font = Font.systemFont(12);
  } else { const t = w.addText("Fin del viaje"); t.font = Font.boldSystemFont(14); }
  return w;
}
function lockInline(){
  const w = new ListWidget(); w.url = APP_URL;
  if (next) w.refreshAfterDate = new Date(next.date.getTime() + 1000);
  w.addText(next ? `${next.e} ${next.t} ${next.title}` : "París · fin del viaje");
  return w;
}
function lockCircle(){
  const w = new ListWidget(); w.url = APP_URL;
  if (next) w.refreshAfterDate = new Date(next.date.getTime() + 1000);
  const e = w.addText(next ? next.e : "🗼"); e.font = Font.systemFont(18); e.centerAlignText();
  const t = w.addText(next ? next.t : "—"); t.font = Font.boldSystemFont(12); t.centerAlignText();
  return w;
}

function finished(){
  const w = base(); w.setPadding(14, 14, 14, 14);
  header(w, "30 oct – 2 nov");
  w.addSpacer();
  label(w, "Bienvenidos a casa", 16, WHITE, "bold");
  label(w, "Fin del viaje", 11, FAINT, "regular");
  return w;
}

async function build(family){
  if (!cur && !next && !family.startsWith("accessory")) return finished();
  switch (family){
    case "small": return small();
    case "large": case "extraLarge": return await large();
    case "accessoryRectangular": return lockRect();
    case "accessoryInline": return lockInline();
    case "accessoryCircular": return lockCircle();
    default: return medium();
  }
}

/* ---------------- arranque ---------------- */
if (config.runsInWidget){
  Script.setWidget(await build(config.widgetFamily));
} else {
  const n = await scheduleAll();
  const a = new Alert();
  a.title = "Avisos de París listos";
  a.message = n
    ? `${n} avisos programados en este móvil, desde «${upcoming[0].title}» (${upcoming[0].day}, ${upcoming[0].t}) hasta el vuelo de vuelta.\n\nAhora añade el widget: mantén pulsada la pantalla de inicio → + → Scriptable → elige el script «París».`
    : "Ya no quedan paradas por delante.";
  a.addAction("Ver el widget grande");
  a.addAction("Ver el widget mediano");
  a.addCancelAction("Cerrar");
  const pick = await a.present();
  if (pick === 0) await (await build("large")).presentLarge();
  if (pick === 1) await (await build("medium")).presentMedium();
}
Script.complete();
