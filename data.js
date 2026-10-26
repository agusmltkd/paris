/* =====================================================================
   DATOS DEL VIAJE — todo lo que se ve en la app sale de aquí.

   Cada parada de un día:
     t      hora "HH:MM"           next: true si es pasada la medianoche
     title  nombre                 kind: icono (plane, bus, taxi, metro, bed,
     note   una o dos frases               coffee, food, walk, photo, monument,
     more   lista de detalles              eiffel, museum, church, boat, star,
            (se ven al abrir la tarjeta)   shield, ticket, art)
     fixed  reserva cerrada        todo: algo que falta hacer antes
     maps   texto para Google Maps  mode: transit | walking | driving
     ll     [lat, lng] si no está en PLACES o hay que afinar
   En los textos, "L1", "L14"… se pintan como la línea de metro.
   ===================================================================== */

const TRIP = {
  title: "París",
  people: "4 adultos",
  from: "2026-10-30",
  to: "2026-11-02"
};

const HOTEL = {
  name: "Hotel de Sévigné",
  street: "Rue de Belloy",
  arr: "16",
  address: "6 rue de Belloy, 75116 París",
  maps: "Hotel de Sévigné, 6 rue de Belloy, 75116 Paris",
  metro: "Boissière L6 · Argentine L1"
};

const PLACES = {
  [HOTEL.maps]: [48.8683, 2.2924],
  "Aéroport de Paris-Beauvais": [49.4544, 2.1128],
  "Paris Porte Maillot, 22 boulevard Pershing, 75017 Paris": [48.8790, 2.2833],
  "Arc de Triomphe, Paris": [48.8738, 2.2950],
  "Place de la Concorde, Paris": [48.8656, 2.3212],
  "Pont Alexandre III, Paris": [48.8639, 2.3136],
  "Rue Cler, 75007 Paris": [48.8567, 2.3062],
  "Champ de Mars, Paris": [48.8556, 2.2986],
  "Tour Eiffel, Paris": [48.8584, 2.2945],
  "Bateaux Parisiens, Port de la Bourdonnais, Paris": [48.8596, 2.2924],
  "Place du Trocadéro, Paris": [48.8620, 2.2880],
  "Palais Royal - Musée du Louvre, Paris": [48.8625, 2.3364],
  "Pyramide du Louvre, Paris": [48.8610, 2.3357],
  "Musée du Louvre, Paris": [48.8600, 2.3375],
  "Jardin du Palais Royal, Paris": [48.8650, 2.3378],
  "Pont Neuf, Paris": [48.8572, 2.3412],
  "Cathédrale Notre-Dame de Paris": [48.8530, 2.3499],
  "Shakespeare and Company, Paris": [48.8526, 2.3471],
  "Les Deux Magots, Paris": [48.8541, 2.3332],
  "Anvers, Paris": [48.8829, 2.3441],
  "Basilique du Sacré-Cœur de Montmartre, Paris": [48.8867, 2.3431],
  "Place du Tertre, Paris": [48.8865, 2.3408],
  "Place des Abbesses, Paris": [48.8844, 2.3386],
  "Aéroport de Paris-Orly": [48.7262, 2.3652]
};

const DAYS = [
  {
    id: "2026-10-30", wd: "Viernes", short: "Vie", n: "30", color: "#7A8BA6",
    scene: "night", title: "Llegada",
    intro: "Día de viaje. Llegáis tarde a Beauvais, que está a más de una hora de París: lo importante es tener comprado el autobús y avisado el hotel.",
    stops: [
      { t:"17:30", kind:"taxi", title:"Al aeropuerto de Sevilla", note:"Dos horas antes del vuelo.",
        more:["Ryanair cierra el embarque 30 minutos antes de la salida.", "Tarjetas de embarque en la app de Ryanair, una por persona.", "Gratis solo la mochila pequeña que va bajo el asiento; la maleta de cabina, si la habéis pagado."],
        maps:"Aeropuerto de Sevilla", mode:"driving" },
      { t:"19:30", kind:"plane", title:"Vuelo FR1246 a París Beauvais", note:"Sevilla 19:30 → Beauvais 22:00.", fixed:true },
      { t:"22:00", kind:"plane", title:"Llegada a Beauvais", note:"Salid directos a la parada del Aérobus, delante de la terminal. Los autobuses salen coordinados con los vuelos.", fixed:true, maps:"Aéroport de Paris-Beauvais", mode:"walking" },
      { t:"22:30", kind:"bus", title:"Aérobus A01 a Porte Maillot", note:"Entre 1h15 y 1h30 de trayecto. Unos 17 € por persona.", todo:"Comprar billetes",
        more:["En 2026 el billete se reserva online antes de viajar.", "Las maletas van en la bodega: llevad a mano solo lo necesario.", "Termina en el 22 del boulevard Pershing, en Porte Maillot."],
        maps:"Paris Porte Maillot, 22 boulevard Pershing, 75017 Paris", mode:"driving" },
      { t:"00:00", next:true, kind:"taxi", title:"De Porte Maillot al hotel", note:"Taxi o VTC, unos 10 minutos.",
        more:["En metro sería la L1 una parada hasta Argentine y luego 15 minutos andando: con maletas y a medianoche, mejor taxi."],
        maps:HOTEL.maps, mode:"driving" },
      { t:"00:15", next:true, kind:"bed", title:"Check-in en el hotel", note:"Avisad de que llegáis pasada la medianoche.", todo:"Avisar al hotel", maps:HOTEL.maps, mode:"walking" }
    ]
  },
  {
    id: "2026-10-31", wd: "Sábado", short: "Sáb", n: "31", color: "#D9922E",
    scene: "eiffel", title: "Campos Elíseos y Torre Eiffel",
    intro: "Todo a pie desde el hotel. Paseo por la orilla derecha, comida cerca de la Torre y subida a las 15:30. Anochece sobre las 17:20: bajáis con las luces encendidas.",
    stops: [
      { t:"09:00", kind:"coffee", title:"Desayuno", note:"Con calma: la noche anterior habrá sido larga.",
        more:["Si el desayuno no va incluido, un café con croissant en una boulangerie del barrio cuesta bastante menos que en una terraza."] },
      { t:"10:00", kind:"monument", title:"Arco del Triunfo", note:"A 10 minutos andando del hotel.",
        more:["Se llega por el paso subterráneo desde los Campos Elíseos: nunca crucéis la rotonda.", "Debajo está la tumba del Soldado Desconocido; su llama se reaviva cada tarde a las 18:30.", "De la plaza salen doce avenidas en estrella: por eso se llama Étoile.", "Subir a la terraza es de pago."],
        maps:"Arc de Triomphe, Paris", mode:"walking" },
      { t:"10:30", kind:"walk", title:"Campos Elíseos hasta la Concorde", note:"Unos 2 km cuesta abajo, con paradas.",
        more:["Ladurée, en el número 75, es la casa de los macarons.", "Al final, la plaza de la Concorde y el obelisco de Luxor."],
        maps:"Place de la Concorde, Paris", mode:"walking" },
      { t:"11:45", kind:"photo", title:"Puente Alejandro III", note:"El puente más fotogénico de París.",
        more:["La mejor foto, desde el centro del puente mirando a la Torre.", "A un lado el Grand Palais; al otro, los Inválidos con su cúpula dorada, donde está la tumba de Napoleón."],
        maps:"Pont Alexandre III, Paris", mode:"walking" },
      { t:"13:00", kind:"food", title:"Comida en la rue Cler", note:"Calle peatonal de mercado con bistrós, a 10 minutos de la Torre.",
        more:["Queserías, panaderías y fruterías: buen sitio para algo sencillo y francés."],
        maps:"Rue Cler, 75007 Paris", mode:"walking" },
      { t:"14:30", kind:"photo", title:"Campo de Marte", note:"Fotos de la Torre desde el césped antes de entrar.", maps:"Champ de Mars, Paris", mode:"walking" },
      { t:"15:00", kind:"shield", title:"Control de seguridad", note:"Media hora antes de la reserva, con el QR en captura de pantalla.", maps:"Tour Eiffel, Paris", ll:[48.8574, 2.2960], mode:"walking" },
      { t:"15:30", kind:"eiffel", title:"Torre Eiffel por escaleras", note:"Hasta el 2º piso. Entre 1h30 y 2h en total.", fixed:true,
        more:["674 escalones hasta el 2º piso, con parada en el 1º, que tiene suelo de cristal.", "Desde arriba se ven el Sacré-Cœur, Notre-Dame y los Inválidos.", "El billete de escaleras llega solo al 2º piso."],
        maps:"Tour Eiffel, Paris", mode:"walking" },
      { t:"18:00", kind:"boat", title:"Crucero por el Sena", note:"Opcional. Sale del pie de la Torre y dura alrededor de una hora.",
        more:["Bateaux Parisiens: se compra online o en la taquilla del muelle.", "Ida y vuelta hasta Notre-Dame, con los monumentos ya iluminados."],
        maps:"Bateaux Parisiens, Port de la Bourdonnais, Paris", mode:"walking" },
      { t:"19:00", kind:"star", title:"Trocadéro y la Torre iluminada", note:"La Torre centellea cinco minutos cada hora en punto.",
        more:["La explanada del Palais de Chaillot tiene la vista más famosa de la Torre.", "Está a un paseo corto del hotel."],
        maps:"Place du Trocadéro, Paris", mode:"walking" },
      { t:"20:00", kind:"food", title:"Cena cerca del hotel", note:"Zona Trocadéro y Victor Hugo.", maps:HOTEL.maps, mode:"walking" }
    ]
  },
  {
    id: "2026-11-01", wd: "Domingo", short: "Dom", n: "1", color: "#22346B",
    scene: "louvre", title: "Louvre y la Île de la Cité",
    intro: "Es Todos los Santos, festivo en Francia: más gente, misas en Notre-Dame y muchas tiendas cerradas. La L1 os deja en el Louvre sin transbordo.",
    stops: [
      { t:"08:45", kind:"coffee", title:"Desayuno" },
      { t:"09:20", kind:"metro", title:"Metro hasta el Louvre", note:"L1 de Argentine a Palais Royal–Musée du Louvre, directo, unos 15 minutos.", maps:"Palais Royal - Musee du Louvre, Paris", ll:[48.8625, 2.3364], mode:"transit" },
      { t:"09:45", kind:"ticket", title:"Entrada por la Pirámide", note:"Fila de visitantes con billete. QR en captura: dentro la cobertura falla.",
        more:["La entrada del Carrousel, bajo tierra, también admite entradas con hora y suele tener menos cola.", "Llevad el DNI: lo pueden pedir junto a la entrada."],
        maps:"Pyramide du Louvre, Paris", mode:"walking" },
      { t:"10:00", kind:"museum", title:"Museo del Louvre", note:"Unas 3 horas para lo imprescindible.", fixed:true,
        more:["La Gioconda: ala Denon, 1ª planta, sala de los Estados. Id primero, antes de que se llene.", "Victoria de Samotracia: en lo alto de la escalera Daru, ala Denon.", "Venus de Milo: ala Sully, planta baja.", "La balsa de la Medusa y La coronación de Napoleón: ala Denon, pintura francesa de gran formato.", "Guardarropa gratuito bajo la Pirámide."],
        maps:"Musée du Louvre, Paris", mode:"walking" },
      { t:"13:15", kind:"food", title:"Comida junto al Palais-Royal", note:"Y paseo por sus jardines y las columnas de Buren.",
        more:["Angelina, en el 226 de la rue de Rivoli, es famosa por su chocolate caliente. Suele haber cola."],
        maps:"Jardin du Palais Royal, Paris", mode:"walking" },
      { t:"14:30", kind:"walk", title:"Pont des Arts y Pont Neuf", note:"Andando junto al Sena hasta la Île de la Cité.",
        more:["El Pont Neuf, pese a su nombre, es el puente más antiguo de París.", "En la punta de la isla, la plaza del Vert-Galant baja hasta el agua."],
        maps:"Pont Neuf, Paris", mode:"walking" },
      { t:"15:15", kind:"church", title:"Catedral de Notre-Dame", note:"Entrada gratuita con franja horaria.", todo:"Reservar franja",
        more:["La franja se reserva en la web oficial 2 o 3 días antes: el jueves o el viernes.", "Restaurada tras el incendio de 2019 y abierta de nuevo desde diciembre de 2024.", "Por Todos los Santos puede haber celebraciones que limiten la visita."],
        maps:"Cathédrale Notre-Dame de Paris", mode:"walking" },
      { t:"16:30", kind:"walk", title:"Barrio Latino", note:"Shakespeare and Company, Saint-Michel y el Panteón por fuera.",
        more:["Shakespeare and Company es la librería en inglés más famosa de París, frente a Notre-Dame.", "La rue de la Huchette y sus callejones conservan el trazado medieval."],
        maps:"Shakespeare and Company, Paris", mode:"walking" },
      { t:"18:00", kind:"coffee", title:"Saint-Germain-des-Prés", note:"Café en Les Deux Magots o el Café de Flore, que están puerta con puerta.",
        more:["Son caros, pero sentarse en su terraza es parte del plan."],
        maps:"Les Deux Magots, Paris", mode:"walking" },
      { t:"20:00", kind:"food", title:"Cena y vuelta al hotel", note:"De vuelta, L1 directa desde Châtelet hasta Argentine.", maps:HOTEL.maps, mode:"transit" }
    ]
  },
  {
    id: "2026-11-02", wd: "Lunes", short: "Lun", n: "2", color: "#2E6B4E",
    scene: "montmartre", title: "Montmartre y vuelta",
    intro: "Mañana en Montmartre con las maletas guardadas en el hotel. A las 14:00 hay que salir hacia Orly sin falta.",
    stops: [
      { t:"08:30", kind:"bed", title:"Desayuno y check-out", note:"Dejad las maletas en recepción y pedid el taxi para las 14:00.", maps:HOTEL.maps },
      { t:"09:15", kind:"metro", title:"Metro a Montmartre", note:"10 minutos andando hasta Étoile y L2 hasta Anvers, unos 20 minutos.", maps:"Anvers, Paris", mode:"transit" },
      { t:"09:45", kind:"church", title:"Sacré-Cœur", note:"Abierto de 6:30 a 22:30, entrada libre.",
        more:["Desde la escalinata se ve París entero.", "El funicular funciona con un billete de metro normal.", "Cuidado con quien ofrece pulseras de hilo en las escaleras: es un timo habitual."],
        maps:"Basilique du Sacré-Cœur de Montmartre, Paris", mode:"walking" },
      { t:"10:45", kind:"art", title:"Place du Tertre", note:"Pintores y retratistas al aire libre.",
        more:["La Maison Rose, en la esquina de la rue de l'Abreuvoir, es la casa rosa de las fotos.", "El Muro de los Te quiero está en la plaza Jehan-Rictus, junto a Abbesses: \"te quiero\" en más de 250 idiomas."],
        maps:"Place du Tertre, Paris", mode:"walking" },
      { t:"12:00", kind:"food", title:"Comida en Montmartre", note:"Antes de la una para no ir con prisas.",
        more:["Bouillon Pigalle, en el 22 del boulevard de Clichy: cocina francesa clásica a buen precio. Sin reserva, cola."],
        maps:"Place des Abbesses, Paris", mode:"walking" },
      { t:"13:15", kind:"metro", title:"Vuelta al hotel", note:"L2 de Anvers a Étoile y a recoger las maletas.", maps:HOTEL.maps, mode:"transit" },
      { t:"14:00", kind:"taxi", title:"Taxi a Orly", note:"Tarifa fija de 45 € para los cuatro. Entre 40 y 50 minutos.",
        more:["La tarifa fija desde la orilla derecha no cambia aunque haya tráfico.", "Alternativa en metro: L1 hasta Châtelet y L14 hasta Aéroport d'Orly, con billete especial de aeropuerto."],
        maps:"Aéroport de Paris-Orly", mode:"driving" },
      { t:"15:00", kind:"plane", title:"Llegada a Orly", note:"Dos horas antes del vuelo." },
      { t:"17:05", kind:"plane", title:"Vuelo VY8074 a Sevilla", note:"Orly 17:05 → Sevilla 19:25.", fixed:true },
      { t:"19:25", kind:"bed", title:"En casa", fixed:true }
    ]
  }
];

const FLIGHTS = [
  { date:"Vie 30 oct", airline:"Ryanair", code:"FR1246", from:"SVQ", fromName:"Sevilla", dep:"19:30", to:"BVA", toName:"París Beauvais", arr:"22:00" },
  { date:"Lun 2 nov", airline:"Vueling", code:"VY8074", from:"ORY", fromName:"París Orly", dep:"17:05", to:"SVQ", toName:"Sevilla", arr:"19:25" }
];

const BOOKINGS = [
  { id:"r-eiffel", what:"Torre Eiffel", detail:"2º piso por escaleras", when:"Sáb 31 · 15:30", kind:"eiffel" },
  { id:"r-louvre", what:"Museo del Louvre", detail:"Entrada con hora", when:"Dom 1 · 10:00", kind:"museum" },
  { id:"r-bus", what:"Aérobus Beauvais", detail:"A Porte Maillot", when:"Vie 30 · tras el vuelo", kind:"bus", pending:true },
  { id:"r-nd", what:"Notre-Dame", detail:"Franja gratuita", when:"Dom 1 · 15:15", kind:"church", pending:true }
];

const BEFORE = [
  { id:"b-aerobus", text:"Comprar el Aérobus Beauvais → Porte Maillot", sub:"Cuatro billetes. Sin reserva os podéis quedar sin plaza esa noche." },
  { id:"b-hotel", text:"Avisar al hotel de la llegada pasada la medianoche" },
  { id:"b-nd", text:"Reservar franja en Notre-Dame para el domingo", sub:"Se abre 2 o 3 días antes: jueves 29 o viernes 30." },
  { id:"b-qr", text:"Capturas de los QR", sub:"Torre Eiffel, Louvre y tarjetas de embarque." },
  { id:"b-metro", text:"Billetes de metro en el móvil", sub:"App Bonjour RATP, o en las máquinas de cualquier estación." },
  { id:"b-app", text:"Instalar esta app en los cuatro móviles", sub:"Y abrir el mapa de cada día una vez con conexión." }
];

const PACK = [
  { id:"p-dni", text:"DNI de los cuatro" },
  { id:"p-tse", text:"Tarjeta sanitaria europea" },
  { id:"p-shoes", text:"Calzado cómodo", sub:"Hay muchas escaleras y se anda mucho." },
  { id:"p-coat", text:"Abrigo y algo de lluvia", sub:"Principios de noviembre: fresco y con posibilidad de chubascos." },
  { id:"p-power", text:"Cargadores y batería externa", sub:"Los enchufes son compatibles con los españoles." },
  { id:"p-bag", text:"Mochila pequeña para el día" },
  { id:"p-card", text:"Tarjeta sin comisiones en el extranjero", sub:"En euros no hay cambio de moneda." }
];

const METRO = [
  { line:"1", color:"#FFCD00", text:"#1a1a1a", use:"Argentine, junto al hotel, directa a Étoile, Concorde, Louvre y Châtelet." },
  { line:"2", color:"#003CA6", text:"#fff", use:"De Étoile a Anvers, a los pies de Montmartre." },
  { line:"6", color:"#6ECA97", text:"#1a1a1a", use:"De Boissière, junto al hotel, a Bir-Hakeim, al lado de la Torre Eiffel." },
  { line:"14", color:"#62259D", text:"#fff", use:"De Châtelet al aeropuerto de Orly, sin conductor y muy rápida." }
];

const PHRASES = [
  { es:"Hola / Buenos días", fr:"Bonjour", say:"bonyúr" },
  { es:"Buenas tardes / noches", fr:"Bonsoir", say:"bonsuár" },
  { es:"Gracias", fr:"Merci", say:"mersí" },
  { es:"Por favor", fr:"S'il vous plaît", say:"sil vu plé" },
  { es:"Perdone", fr:"Excusez-moi", say:"excusé muá" },
  { es:"Una mesa para cuatro", fr:"Une table pour quatre", say:"un tábl pur kátr" },
  { es:"Una jarra de agua", fr:"Une carafe d'eau", say:"un caráf dó" },
  { es:"La cuenta, por favor", fr:"L'addition, s'il vous plaît", say:"ladisión, sil vu plé" },
  { es:"¿Cuánto cuesta?", fr:"C'est combien ?", say:"sé combián" },
  { es:"¿Dónde está el metro?", fr:"Où est le métro ?", say:"u é le metró" },
  { es:"¿Habla español?", fr:"Vous parlez espagnol ?", say:"vu parlé españól" },
  { es:"Adiós", fr:"Au revoir", say:"o revuár" }
];

const EAT = [
  { zone:"Campos Elíseos", name:"Ladurée", what:"Macarons y salón de té de 1862.", where:"75 av. des Champs-Élysées", maps:"Ladurée Champs-Élysées, Paris", ll:[48.8711, 2.3030] },
  { zone:"Torre Eiffel", name:"Rue Cler", what:"Calle de mercado con bistrós y terrazas.", where:"75007", maps:"Rue Cler, 75007 Paris", ll:[48.8567, 2.3062] },
  { zone:"Louvre", name:"Angelina", what:"Chocolate caliente espeso y el pastel Mont-Blanc.", where:"226 rue de Rivoli", maps:"Angelina, 226 rue de Rivoli, Paris", ll:[48.8651, 2.3284] },
  { zone:"Saint-Germain", name:"Café de Flore y Les Deux Magots", what:"Los cafés literarios más famosos, puerta con puerta.", where:"Bd Saint-Germain", maps:"Café de Flore, Paris", ll:[48.8541, 2.3326] },
  { zone:"Montmartre", name:"Bouillon Pigalle", what:"Cocina francesa clásica a precio económico.", where:"22 bd de Clichy", maps:"Bouillon Pigalle, 22 boulevard de Clichy, Paris", ll:[48.8826, 2.3375] },
  { zone:"Grands Boulevards", name:"Bouillon Chartier", what:"Comedor de 1896, barato y siempre lleno.", where:"7 rue du Faubourg-Montmartre", maps:"Bouillon Chartier, 7 rue du Faubourg Montmartre, Paris", ll:[48.8720, 2.3436] }
];

const TIPS = [
  { title:"Saludad al entrar", text:"En tiendas y cafés se dice \"Bonjour\" nada más entrar. Cambia mucho el trato." },
  { title:"El agua es gratis", text:"Pedid \"une carafe d'eau\": agua del grifo en jarra, sin coste." },
  { title:"La propina va incluida", text:"El servicio está incluido en la cuenta. Redondear es un detalle, no una obligación." },
  { title:"Ojo con los carteristas", text:"Sobre todo en el metro, en la Torre Eiffel y en Montmartre. Mochila por delante en las aglomeraciones." },
  { title:"Domingo festivo", text:"El 1 de noviembre es Todos los Santos: muchas tiendas cerradas, pero monumentos y museos abren." },
  { title:"Puertas del metro", text:"En algunos trenes las puertas no se abren solas: hay que pulsar el botón o levantar la palanca." }
];

const EMERGENCY = [
  { label:"Emergencias", tel:"112" },
  { label:"Urgencias médicas (SAMU)", tel:"15" },
  { label:"Policía", tel:"17" }
];
const EMBASSY = { name:"Embajada de España", address:"22 avenue Marceau, 75008 París", maps:"Ambassade d'Espagne, 22 avenue Marceau, Paris" };
