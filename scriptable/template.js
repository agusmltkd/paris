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

function large(){
  const w = base(); w.setPadding(14, 14, 14, 14);
  const day = next ? next.day : cur ? cur.day : "";
  header(w, day);
  w.addSpacer(10);
  const todays = list.filter(s => s.day === (cur && sameDay(cur, next) ? cur.day : day));
  for (const s of todays.slice(-11)){
    const r = w.addStack(); r.centerAlignContent();
    const isCur = cur && s.i === cur.i, past = s.date <= now && !isCur;
    label(r, s.t, 12, isCur ? AMBER : past ? FAINT : SOFT).font = Font.semiboldMonospacedSystemFont(12);
    r.addSpacer(8);
    label(r, `${s.e} ${s.title}`, 13, isCur ? AMBER : past ? FAINT : WHITE, isCur ? "bold" : "regular").lineLimit = 1;
    r.addSpacer();
    w.addSpacer(5);
  }
  w.addSpacer();
  if (next){ const f = w.addStack(); label(f, `Siguiente: ${next.title} · `, 11, SOFT, "regular"); countdown(f, next.date, 11, SOFT); }
  return w;
}

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

function build(family){
  if (!cur && !next && !family.startsWith("accessory")) return finished();
  switch (family){
    case "small": return small();
    case "large": case "extraLarge": return large();
    case "accessoryRectangular": return lockRect();
    case "accessoryInline": return lockInline();
    case "accessoryCircular": return lockCircle();
    default: return medium();
  }
}

/* ---------------- arranque ---------------- */
if (config.runsInWidget){
  Script.setWidget(build(config.widgetFamily));
} else {
  const n = await scheduleAll();
  const a = new Alert();
  a.title = "Avisos de París listos";
  a.message = n
    ? `${n} avisos programados en este móvil, desde «${upcoming[0].title}» (${upcoming[0].day}, ${upcoming[0].t}) hasta el vuelo de vuelta.\n\nAhora añade el widget: mantén pulsada la pantalla de inicio → + → Scriptable → elige el script «París».`
    : "Ya no quedan paradas por delante.";
  a.addAction("Ver el widget");
  a.addCancelAction("Cerrar");
  if (await a.present() === 0) await build("medium").presentMedium();
}
Script.complete();
