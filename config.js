require("./lib/module");

global.botName = 'BandinqBot'; // Nama bot
global.GeminiGreetings = `
Namamu adalah ${global.botName},deskripsikan dirimu apa yang dapat kamu lakukan seperti dapat membantu menjawab dari gambar dan lain sebagainya,dan beritahu user jika ingin menghentikan sesi dapat mengetik /stop

Sekarang sapalah dan perkenalkan dirimu!
`; // Sapaan pertama ke user baru
global.prefix = '/';
global.GeminiBackGreetings = `Halo! aku kembali!`; // Pesan pertama yang dikirim ke AI ketika melanjutkan chat
global.GeminiMAXHistory = 10; // Total riwayat chat yang bakal diingat oleh Gemini
global.GeminiKey = 'AIzaSyADkodF-yOmXa5iyuQL1UQEEhUnGGgFJK4';
global.GeminiTimeout = 30 * 60 * 1000; // 30 menit, Batas waktu jika user tidak aktif
global.mess = global.mess || {};
global.mess.OnlyGrup = "Bot ini hanya dapat digunakan di private chat"
global.mess.NotRegistered = "Anda belum pernah menggunakan bot ini\n\nUntuk menggunakan bot,silahkan ketik /start";
global.mess.LeaveSession = "Anda berhasil keluar dari sesi bot!\n\nUntuk menggunakannya kembali silahkan ketik /start";
global.mess.afkSession = "Sesi anda dengan bot telah habis dikarenakan tidak ada aktifitas\n\nUntuk memulai kembali silahkan ketik /start";
global.mess.OnSession = "Anda sedang berada di sesi.\n\nAnda hanya dapat menggunakan perintah /stop untuk mengakhiri sesi";
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
