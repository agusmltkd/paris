// Genera paris-widget.js (Scriptable) a partir de data.js, para que el widget
// y los avisos usen exactamente el mismo itinerario que la app.
// Uso: node scriptable/build.js
const fs = require("fs"), path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "data.js"), "utf8");
const { DAYS } = new Function(src + "; return { DAYS };")();

const EMOJI = { plane:"✈️", bus:"🚌", taxi:"🚕", metro:"🚇", bed:"🛏️", coffee:"☕", food:"🍽️", walk:"🚶", photo:"📷",
  monument:"🏛️", eiffel:"🗼", museum:"🖼️", church:"⛪", boat:"⛴️", star:"✨", shield:"🛡️", ticket:"🎟️", art:"🎨" };
const addDay = (iso, n) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

const stops = [];
DAYS.forEach(d => d.stops.forEach(s => {
  const date = s.next ? addDay(d.id, 1) : d.id;
  stops.push({
    at: `${date}T${s.t}:00+01:00`, day: `${d.wd} ${d.n}`, t: s.t, e: EMOJI[s.kind] || "📍",
    title: s.title, note: (s.note || "").replace(/\bL(\d{1,2})\b/g, "línea $1"),
    // Aviso previo en lo que tiene reserva, entrada o hay que desplazarse
    lead: s.kind === "bed" ? 0 : s.kind === "plane" && s.fixed ? 60 : (s.fixed || s.booking || ["metro", "taxi", "shield"].includes(s.kind)) ? 15 : 0
  });
}));

const tpl = fs.readFileSync(path.join(__dirname, "template.js"), "utf8");
const out = tpl.replace("/*STOPS*/[]", JSON.stringify(stops, null, 0).replace(/},{/g, "},\n  {"));
fs.writeFileSync(path.join(__dirname, "paris-widget.js"), out);
console.log(`paris-widget.js: ${stops.length} paradas`);
