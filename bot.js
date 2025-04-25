// Importa il modulo tmi.js e il modulo fs
const tmi = require('tmi.js');
const fs = require('fs');

// Configurazione del bot di Twitch
const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
  },
  identity: {
    username: 'assistentecarota_bot',
    password: 'oauth:l0qghkz6ha7w1yihoj5bwbagoreslv',
  },
  channels: ['#bunnyhime_'],
};

// Crea un client tmi.js
const client = new tmi.Client(options);
client.connect().catch(console.error);

// Collezione per tracciare gli utenti salutati e accomiatati
const utentiSalutati = new Set();
const utentiAccomiatati = new Set();

// Contatore Bun Bun
const counterFile = 'bunbun_counter.json';
let bunBunCounter = 0;

// Carica il contatore salvato
if (fs.existsSync(counterFile)) {
  try {
    const data = fs.readFileSync(counterFile, 'utf8');
    bunBunCounter = JSON.parse(data).count || 0;
  } catch (error) {
    console.error('Errore nel caricamento del contatore:', error);
  }
}

// Salva il contatore nel file
function salvaContatore() {
  fs.writeFileSync(counterFile, JSON.stringify({ count: bunBunCounter }), 'utf8');
}

// Messaggi di saluto basati sull'orario
const salutiMattina = [
  "☀️ Buongiorno, {username}! Spero che la tua giornata inizi al meglio! ☕",
  "🌅 Ciao {username}! Che il sole illumini la tua giornata! 😊",
  "✨ Buondì {username}, pronto/a per una giornata fantastica? 🌞"
];

const salutiPomeriggio = [
  "🌤️ Buon pomeriggio, {username}! Come sta andando la tua giornata? 😊",
  "🎶 Ciao {username}! Goditi un po' di relax con noi! 🎉",
  "💫 Ehilà {username}! Il pomeriggio è perfetto per divertirsi insieme! 🍿"
];

const salutiSera = [
  "🌙 Buonasera, {username}! Rilassati e goditi la live! ✨",
  "🌌 Ciao {username}, è ora di mettersi comodi e divertirsi! 🎮",
  "🌠 Bentornato/a {username}! La serata è lunga, facciamoci compagnia! 💫"
];

// Funzione per scegliere il messaggio di saluto in base all'orario
function scegliSaluto(username) {
  const ora = new Date().getHours();
  let messaggiPossibili;

  if (ora >= 6 && ora < 12) {
    messaggiPossibili = salutiMattina;
  } else if (ora >= 12 && ora < 18) {
    messaggiPossibili = salutiPomeriggio;
  } else {
    messaggiPossibili = salutiSera;
  }

  return messaggiPossibili[Math.floor(Math.random() * messaggiPossibili.length)].replace('{username}', username);
}

// Quando il bot si connette al canale
client.on('connected', (address, port) => {
  console.log(`Connesso a ${address}:${port}`);
  client.say(options.channels[0], "👋 Ciao a tutti! Sono AssistenteCarota, pronto a rendere la live ancora più speciale! 🎉");
});

// Ascolta i messaggi della chat
client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const username = tags['display-name'];

  // Saluti
  if (!utentiSalutati.has(username)) {
    const messaggioSaluto = scegliSaluto(username);
    client.say(channel, messaggioSaluto);
    utentiSalutati.add(username);
  }

  // Addii
  if (['arrivederci', 'addio', 'a presto', 'ci vediamo', 'devo andare', 'vado via'].some(addio => message.toLowerCase().includes(addio)) && !utentiAccomiatati.has(username)) {
    client.say(channel, `👋 Ciao ${username}! Grazie per essere passato/a, torna presto! ✨`);
    utentiAccomiatati.add(username);
  }

  // Risposta "vado a mangiare"
  if (['vado a mangiare', 'è ora di mangiare', 'vado a pranzare', 'vado a cenare'].some(frase => message.toLowerCase().includes(frase))) {
    const risposteMangiare = [
      `Buon appetito, ${username}! 🍽️ Che il tuo pasto sia delizioso!`,
      `Spero che il cibo sia ottimo, ${username}! 🍕 Buon appetito!`,
      `${username}, goditi il tuo pasto! 😋 Ci vediamo dopo!`,
      `Mangia bene, ${username}! 🍲 Ti aspettiamo di nuovo in chat!`,
      `Buon pranzo/cena, ${username}! 🍴 Torna presto a farci compagnia!`
    ];
    client.say(channel, risposteMangiare[Math.floor(Math.random() * risposteMangiare.length)]);
  }

  // Risposta "vado a dormire"
  if (['vado a dormire', 'vado a letto', 'è ora di dormire', 'vado a nanna', 'vado a fare la nanna', 'buonanotte a tutti'].some(frase => message.toLowerCase().includes(frase))) {
    const risposteDormire = [
      `Buonanotte, ${username}! 🌠 Sogni d'oro! 😴`,
      `Riposa bene, ${username}! 🌜 Ci vediamo domani!`,
      `Sogni tranquilli, ${username}! 🌙 Dormi bene e rilassati!`,
      `${username}, buonanotte e sogni d'oro! 🌌 A domani!`,
      `Dormi bene, ${username}! 🌠 Riposati e torna carico!`
    ];
    client.say(channel, risposteDormire[Math.floor(Math.random() * risposteDormire.length)]);
  }

  // Comando !bunbun o "bun bun" o "bunbun" in un messaggio
  if (message.toLowerCase().includes('bun bun') || message.toLowerCase().includes('bunbun')) {
    bunBunCounter++;
    salvaContatore();
    client.say(channel, `🐰 Bun Bun! Siamo a ${bunBunCounter} bun bun EVVIVA! 🎉`);
  }
});
