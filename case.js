const gem = require('./lib/gemini');
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
module.exports = async (chiwa, m, store) => {
try {
let db_gemini_active_user = await loadSession();
const from = m.key.remoteJid
const quoted = m.quoted ? m.quoted : m
const body = (m.mtype === 'conversation' && m.message.conversation) ? m.message.conversation : (m.mtype == 'imageMessage') && m.message.imageMessage.caption ? m.message.imageMessage.caption : (m.mtype == 'documentMessage') && m.message.documentMessage.caption ? m.message.documentMessage.caption : (m.mtype == 'videoMessage') && m.message.videoMessage.caption ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') && m.message.extendedTextMessage.text ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : ''
const budy = (typeof m.text == 'string' ? m.text : '')
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : "";
const isCommand = (isCmd) ? command : "";
const args = body.trim().split(/ +/).slice(1)
const mime = (quoted.msg || quoted).mimetype || ''
const text = q = args.join(" ")
const isGroup = from.endsWith('@g.us')
const botNumber = await chiwa.decodeJid(chiwa.user.id)
const sender = m.key.fromMe ? (chiwa.user.id.split(':')[0]+'@s.whatsapp.net' || chiwa.user.id) : (m.key.participant || m.key.remoteJid)
const senderNumber = sender.split('@')[0]
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const groupMetadata = isGroup ? await chiwa.groupMetadata(m.chat).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
const groupOwner = isGroup ? groupMetadata.owner : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false
const isGroupAdmins = isGroup ? groupAdmins.includes(sender) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const tanggal = moment.tz('Asia/Jakarta').format('DD/MM/YY')
const { Client } = require('ssh2');

const listcolor = ['red','green','yellow','blue','magenta','cyan','white']
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)]

if (m.text && m.sender !== botNumber) {
console.log(chalk.yellow.bgCyan.bold(botName), color(`[ PESAN ]`, `${randomcolor}`), color(`FROM`, `${randomcolor}`), color(`${pushname}`, `${randomcolor}`), color(`Text :`, `${randomcolor}`), color(`${body}`, `white`))
}




try {
ppuser = await chiwa.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}

const fkethmb = await reSize(ppuser, 300, 300)
if (command === 'start' && db_gemini_active_user[m.sender]?.OnSession) return m.reply(mess.OnSession)
if (!isCommand && !m.isGroup && db_gemini_active_user[m.sender] && db_gemini_active_user[m.sender].OnSession && m.text) {
  try {
    const budy = (typeof m.text === 'string' ? m.text : '');

    if (quoted && /image/.test(mime)) {
      await chiwa.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key } });

      const path = require('path');
      const fs = require('fs');
      let q = m.quoted ? m.quoted : m;

      async function downloadAndSaveMedia(media) {
        try {
          const tempDir = './temp';

          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }

          const fileName = `mediaFile_${Date.now()}.jpg`; 
          const filePath = path.join(tempDir, fileName);

          fs.writeFileSync(filePath, media);
          return filePath;
        } catch (error) {
          console.error('Error while saving media:', error);
        }
      }

      let media = await q.download();
      if (media) {
        if (m.message.imageMessage) {
          gorengan = m.message.imageMessage.caption
        }
        if (m.message.extendedTextMessage){
          gorengan = m.message.extendedTextMessage.text
        }
        let felpet = await downloadAndSaveMedia(media);
        let anunya = await gem.sendImage(m.sender, felpet, gorengan);
        await m.reply(`${anunya}`);
      } else {
        await m.reply('Gagal mengunduh media.');
      }
      await chiwa.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
      db_gemini_active_user[m.sender].lastActive = new Date().toISOString();
      await saveSession(db_gemini_active_user);

      return;
    }

    const anun = await gem.continueSession(m.sender, budy);
    await m.reply(anun);

    db_gemini_active_user[m.sender].lastActive = new Date().toISOString();
    await saveSession(db_gemini_active_user);

  } catch (error) {
    console.error('Error processing message:', error);
    await m.reply("An error occurred while processing your message.");
  }
}


switch (command) {
  case 'start': {
    if (m.isGroup) return m.reply(mess.OnlyGrup)
    let db_gemini_active_user = await loadSession();

    if (!db_gemini_active_user[m.sender] || Object.keys(db_gemini_active_user).length === 0) {
      await chiwa.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});

      db_gemini_active_user[m.sender] = { 
        OnSession: true,
        lastActive: new Date().toISOString()
      };

      await saveSession(db_gemini_active_user); 
      const meong = await gem.createNewSession(m.sender, GeminiGreetings);
      await m.reply(meong);
      await chiwa.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
      return;
    }

    await chiwa.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});
    const kawaii = await gem.continueSession(m.sender, GeminiBackGreetings);
    await m.reply(kawaii);

    db_gemini_active_user[m.sender].OnSession = true;
    db_gemini_active_user[m.sender].lastActive = new Date().toISOString(); 
    await saveSession(db_gemini_active_user);
    await chiwa.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
    break;
  }

  case 'stop': {
    if (m.isGroup) return m.reply(mess.OnlyGrup)
    let db_gemini_active_user = await loadSession();

    if (!db_gemini_active_user[m.sender]?.OnSession) return m.reply(mess.NotRegistered);

    await m.reply(mess.LeaveSession);
    db_gemini_active_user[m.sender].OnSession = false;
    await saveSession(db_gemini_active_user);
    break;
  }

  default:
}

if (budy.startsWith('$')) {
exec(budy.slice(2), (err, stdout) => {
if(err) return reply(err)
if (stdout) return reply(stdout)
})
}

} catch (e) {
console.log(e)
}
}

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})