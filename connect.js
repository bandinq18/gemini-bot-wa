require('./config.js')
require('./lib/global')
async function loadSession() {
  try {
    const fs = require('fs').promises;
    const data = await fs.readFile('./database/gemini.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const emptyData = {};
      await fs.writeFile('./database/gemini.json', JSON.stringify(emptyData, null, 2));
      return emptyData;
    } else {
      console.error('Error reading or parsing file:', err);
      throw err;
    }
  }
}


async function saveSession(sessionData) {
  try {
    const fs = require('fs').promises;
    await fs.writeFile('./database/gemini.json', JSON.stringify(sessionData, null, 2));
  } catch (err) {
    console.error('Error writing to file:', err);
    throw err;
  }
}
const alo = require('./lib/alo')
const readline = require("readline");
const usePairingCode = true
const question = (text) => {
  const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
  });
  return new Promise((resolve) => {
rl.question(text, resolve)
  })
};
async function startSesi() {

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(`./session`)
const { version, isLatest } = await fetchLatestBaileysVersion()

const connectionOptions = {
logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
}
const chiwa = alo.makeWASocket(connectionOptions)
if(usePairingCode && !chiwa.authState.creds.registered) {
		const phoneNumber = await question(chalk.red('Silahkan masukkan nomor diawali kode negara:'))
        let code = await chiwa.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.blue(`NIH KAK KODE NYA >_< :`, code));

	}
store.bind(chiwa.ev)

chiwa.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
const reason = new Boom(lastDisconnect?.error)?.output.statusCode
console.log(color(lastDisconnect.error, 'deeppink'))
if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
process.exit()
} else if (reason === DisconnectReason.badSession) {
console.log(color(`Bad Session File, Please Delete Session and Scan Again`))
process.exit()
} else if (reason === DisconnectReason.connectionClosed) {
console.log(color('[SYSTEM]', 'white'), color('Connection closed, reconnecting...', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionLost) {
console.log(color('[SYSTEM]', 'white'), color('Connection lost, trying to reconnect', 'deeppink'))
process.exit()
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(color('Connection Replaced, Another New Session Opened, Please Close Current Session First'))
chiwa.logout()
} else if (reason === DisconnectReason.loggedOut) {
console.log(color(`Device Logged Out, Please Scan Again And Run.`))
chiwa.logout()
} else if (reason === DisconnectReason.restartRequired) {
console.log(color('Restart Required, Restarting...'))
await startSesi()
} else if (reason === DisconnectReason.timedOut) {
console.log(color('Connection TimedOut, Reconnecting...'))
startSesi()
}
} else if (connection === "connecting") {
start(`1`, `Connecting...`)
} else if (connection === "open") {
success(`1`, `Tersambung`)

setInterval(async () => {
  let db_gemini_active_user = await loadSession();
  
  const now = Date.now();

  for (let user in db_gemini_active_user) {
    if (db_gemini_active_user[user].OnSession) {
      const lastActive = new Date(db_gemini_active_user[user].lastActive).getTime();
      
      if (now - lastActive > GeminiTimeout) {
        db_gemini_active_user[user].OnSession = false;

        chiwa.sendMessage(user, {text: mess.afkSession})
        await saveSession(db_gemini_active_user);

      }
    }
  }
}, 3000); 

}
})

chiwa.ev.on('messages.upsert', async (chatUpdate) => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return chiwa.readMessages([m.key])
if (!chiwa.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = alo.smsg(chiwa, m, store)
require("./case")(chiwa, m, store)
} catch (err) {
console.log(err)
}
})

chiwa.public = true

chiwa.ev.on('creds.update', saveCreds)
return chiwa
}

startSesi()

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err)
})