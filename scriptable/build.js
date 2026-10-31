// Genera paris-widget.js (Scriptable) a partir de data.js, para que el widget
// y los avisos usen exactamente el mismo itinerario que la app.
// Uso: node scriptable/build.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8");
const { DAYS, PLACES, HOTEL } = new Function(src + "; return { DAYS, PLACES, HOTEL };")();

const EMOJI = { plane:"✈️", bus:"🚌", taxi:"🚕", metro:"🚇", bed:"🛏️", coffee:"☕", food:"🍽️", walk:"🚶", photo:"📷",
  monument:"🏛️", eiffel:"🗼", museum:"🖼️", church:"⛪", boat:"⛴️", star:"✨", shield:"🛡️", ticket:"🎟️", art:"🎨" };
const addDay = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const where = s => s.ll || (s.maps && PLACES[s.maps]);
const inParis = ll => ll && ll[0] > 48.8 && ll[0] < 48.92;

// Mismo cálculo de trayecto que la app (distancia en línea recta × 1,3).
const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b[0] - a[0]), dLo = r(b[1] - a[1]);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
function travel(from, to, mode){
  if (!from || !to) return null;
  const d = km(from, to) * 1.3;
  if (d < 0.15 || d > 40) return null;
  const walk = Math.round(d / 4.5 * 60);
  if (mode === "driving") return [Math.round(6 + d / 22 * 60), "en taxi"];
  if (mode === "transit" || walk > 30) return [Math.round(10 + d / 20 * 60), "en metro"];
  return [Math.max(2, walk), "a pie"];
}

const r5 = n => Math.round(n * 1e5) / 1e5;
const stops = [];
DAYS.forEach(d => {
  let n = 0, prev = d.scene === "night" ? null : PLACES[HOTEL.maps];
  d.stops.forEach(s => {
    const ll = where(s), hotel = s.maps === HOTEL.maps;
    const leg = ll ? travel(prev, ll, s.mode) : null;
    if (ll) prev = ll;
    if (ll && !hotel) n++;
    stops.push({
      at: `${s.next ? addDay(d.id, 1) : d.id}T${s.t}:00+01:00`, day: `${d.wd} ${d.n}`, dayId: d.id, t: s.t,
      e: EMOJI[s.kind] || "📍", title: s.title, note: (s.note || "").replace(/\bL(\d{1,2})\b/g, "línea $1"),
      fixed: !!s.fixed,
      // Punto en el mapa del día (solo París) y su número
      ll: inParis(ll) ? [r5(ll[0]), r5(ll[1])] : null, hotel, n: ll && !hotel ? n : 0,
      leg,
      // Aviso previo en lo que tiene reserva, entrada o hay que desplazarse
      lead: s.kind === "bed" ? 0 : s.kind === "plane" && s.fixed ? 60 : (s.fixed || s.booking || ["metro", "taxi", "shield"].includes(s.kind)) ? 15 : 0
    });
  });
});
// Colores más claros para que se lean sobre el fondo azul del widget
const LIGHT = { "2026-10-30": "#A9B7D0", "2026-10-31": "#EBA845", "2026-11-01": "#8FA9F2", "2026-11-02": "#5CC08C" };
const days = Object.fromEntries(DAYS.map(d => [d.id, { title: d.title, color: LIGHT[d.id] || d.color }]));

const tpl = fs.readFileSync(path.join(__dirname, "template.js"), "utf8");
const out = tpl
  .replace("/*STOPS*/[]", JSON.stringify(stops).replace(/},{/g, "},\n  {"))
  .replace("/*DAYS*/{}", JSON.stringify(days))
  .replace("/*HOTEL*/[]", JSON.stringify(PLACES[HOTEL.maps]));
fs.writeFileSync(path.join(__dirname, "paris-widget.js"), out);
console.log(`paris-widget.js: ${stops.length} paradas`);
