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
const STOPS = [{"at":"2026-10-30T17:30:00+01:00","day":"Viernes 30","t":"17:30","e":"🚕","title":"Al aeropuerto de Sevilla","note":"Dos horas antes del vuelo.","lead":15},
  {"at":"2026-10-30T19:30:00+01:00","day":"Viernes 30","t":"19:30","e":"✈️","title":"Vuelo FR1246 a París Beauvais","note":"Sevilla 19:30 → Beauvais 22:00.","lead":60},
  {"at":"2026-10-30T22:00:00+01:00","day":"Viernes 30","t":"22:00","e":"✈️","title":"Llegada a Beauvais","note":"Salid directos a la parada del Aérobus, delante de la terminal. Los autobuses salen coordinados con los vuelos.","lead":60},
  {"at":"2026-10-30T22:30:00+01:00","day":"Viernes 30","t":"22:30","e":"🚌","title":"Aérobus A01 a Porte Maillot","note":"Entre 1h15 y 1h30 de trayecto. Unos 17 € por persona.","lead":15},
  {"at":"2026-10-31T00:00:00+01:00","day":"Viernes 30","t":"00:00","e":"🚕","title":"De Porte Maillot al hotel","note":"Taxi o VTC, unos 10 minutos.","lead":15},
  {"at":"2026-10-31T00:15:00+01:00","day":"Viernes 30","t":"00:15","e":"🛏️","title":"Check-in en el hotel","note":"Avisad de que llegáis pasada la medianoche.","lead":0},
  {"at":"2026-10-31T09:00:00+01:00","day":"Sábado 31","t":"09:00","e":"☕","title":"Desayuno","note":"Con calma: la noche anterior habrá sido larga.","lead":0},
  {"at":"2026-10-31T10:00:00+01:00","day":"Sábado 31","t":"10:00","e":"🏛️","title":"Arco del Triunfo","note":"A 10 minutos andando del hotel.","lead":0},
  {"at":"2026-10-31T10:30:00+01:00","day":"Sábado 31","t":"10:30","e":"🚶","title":"Campos Elíseos hasta la Concorde","note":"Unos 2 km cuesta abajo, con paradas.","lead":0},
  {"at":"2026-10-31T11:45:00+01:00","day":"Sábado 31","t":"11:45","e":"📷","title":"Puente Alejandro III","note":"El puente más fotogénico de París.","lead":0},
  {"at":"2026-10-31T13:00:00+01:00","day":"Sábado 31","t":"13:00","e":"🍽️","title":"Comida en la rue Cler","note":"Calle peatonal de mercado con bistrós, a 10 minutos de la Torre.","lead":0},
  {"at":"2026-10-31T14:30:00+01:00","day":"Sábado 31","t":"14:30","e":"📷","title":"Campo de Marte","note":"Fotos de la Torre desde el césped antes de entrar.","lead":0},
  {"at":"2026-10-31T15:10:00+01:00","day":"Sábado 31","t":"15:10","e":"🛡️","title":"Control de seguridad","note":"Entre 15 y 20 minutos antes de la hora, por el acceso para visitantes con entrada, en los jardines.","lead":15},
  {"at":"2026-10-31T15:30:00+01:00","day":"Sábado 31","t":"15:30","e":"🗼","title":"Torre Eiffel por escaleras","note":"Hasta el 2º piso. Entre 1h30 y 2h en total.","lead":15},
  {"at":"2026-10-31T18:00:00+01:00","day":"Sábado 31","t":"18:00","e":"⛴️","title":"Crucero por el Sena","note":"Opcional. Sale del pie de la Torre y dura alrededor de una hora.","lead":0},
  {"at":"2026-10-31T19:00:00+01:00","day":"Sábado 31","t":"19:00","e":"✨","title":"Trocadéro y la Torre iluminada","note":"La Torre centellea cinco minutos cada hora en punto.","lead":0},
  {"at":"2026-10-31T20:00:00+01:00","day":"Sábado 31","t":"20:00","e":"🍽️","title":"Cena cerca del hotel","note":"Zona Trocadéro y Victor Hugo.","lead":0},
  {"at":"2026-11-01T08:45:00+01:00","day":"Domingo 1","t":"08:45","e":"☕","title":"Desayuno","note":"","lead":0},
  {"at":"2026-11-01T09:20:00+01:00","day":"Domingo 1","t":"09:20","e":"🚇","title":"Metro hasta el Louvre","note":"línea 1 de Argentine a Palais Royal–Musée du Louvre, directo, unos 15 minutos.","lead":15},
  {"at":"2026-11-01T09:45:00+01:00","day":"Domingo 1","t":"09:45","e":"🎟️","title":"Entrada por la Pirámide","note":"Fila de visitantes con entrada. Tened las entradas cargadas en la app: dentro la cobertura falla.","lead":15},
  {"at":"2026-11-01T10:00:00+01:00","day":"Domingo 1","t":"10:00","e":"🖼️","title":"Museo del Louvre","note":"Unas 3 horas para lo imprescindible, con audioguía.","lead":15},
  {"at":"2026-11-01T13:15:00+01:00","day":"Domingo 1","t":"13:15","e":"🍽️","title":"Comida junto al Palais-Royal","note":"Y paseo por sus jardines y las columnas de Buren.","lead":0},
  {"at":"2026-11-01T14:30:00+01:00","day":"Domingo 1","t":"14:30","e":"🚶","title":"Pont des Arts y Pont Neuf","note":"Andando junto al Sena hasta la Île de la Cité.","lead":0},
  {"at":"2026-11-01T15:15:00+01:00","day":"Domingo 1","t":"15:15","e":"⛪","title":"Catedral de Notre-Dame","note":"Entrada gratuita con franja horaria.","lead":15},
  {"at":"2026-11-01T16:30:00+01:00","day":"Domingo 1","t":"16:30","e":"🚶","title":"Barrio Latino","note":"Shakespeare and Company, Saint-Michel y el Panteón por fuera.","lead":0},
  {"at":"2026-11-01T18:00:00+01:00","day":"Domingo 1","t":"18:00","e":"☕","title":"Saint-Germain-des-Prés","note":"Café en Les Deux Magots o el Café de Flore, que están puerta con puerta.","lead":0},
  {"at":"2026-11-01T20:00:00+01:00","day":"Domingo 1","t":"20:00","e":"🍽️","title":"Cena y vuelta al hotel","note":"De vuelta, línea 1 directa desde Châtelet hasta Argentine.","lead":0},
  {"at":"2026-11-02T08:30:00+01:00","day":"Lunes 2","t":"08:30","e":"🛏️","title":"Desayuno y check-out","note":"Dejad las maletas en recepción y pedid el taxi para las 14:00.","lead":0},
  {"at":"2026-11-02T09:15:00+01:00","day":"Lunes 2","t":"09:15","e":"🚇","title":"Metro a Montmartre","note":"10 minutos andando hasta Étoile y línea 2 hasta Anvers, unos 20 minutos.","lead":15},
  {"at":"2026-11-02T09:45:00+01:00","day":"Lunes 2","t":"09:45","e":"⛪","title":"Sacré-Cœur","note":"Abierto de 6:30 a 22:30, entrada libre.","lead":0},
  {"at":"2026-11-02T10:45:00+01:00","day":"Lunes 2","t":"10:45","e":"🎨","title":"Place du Tertre","note":"Pintores y retratistas al aire libre.","lead":0},
  {"at":"2026-11-02T12:00:00+01:00","day":"Lunes 2","t":"12:00","e":"🍽️","title":"Comida en Montmartre","note":"Antes de la una para no ir con prisas.","lead":0},
  {"at":"2026-11-02T13:15:00+01:00","day":"Lunes 2","t":"13:15","e":"🚇","title":"Vuelta al hotel","note":"línea 2 de Anvers a Étoile y a recoger las maletas.","lead":15},
  {"at":"2026-11-02T14:00:00+01:00","day":"Lunes 2","t":"14:00","e":"🚕","title":"Taxi a Orly","note":"Tarifa fija de 45 € para los cuatro. Entre 40 y 50 minutos.","lead":15},
  {"at":"2026-11-02T15:00:00+01:00","day":"Lunes 2","t":"15:00","e":"✈️","title":"Llegada a Orly","note":"Dos horas antes del vuelo.","lead":0},
  {"at":"2026-11-02T17:05:00+01:00","day":"Lunes 2","t":"17:05","e":"✈️","title":"Vuelo VY8074 a Sevilla","note":"Orly 17:05 → Sevilla 19:25.","lead":60},
  {"at":"2026-11-02T19:25:00+01:00","day":"Lunes 2","t":"19:25","e":"🛏️","title":"En casa","note":"","lead":0}];

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
