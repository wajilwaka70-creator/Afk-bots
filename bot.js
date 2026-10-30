const http = require('http');
const mineflayer = require('mineflayer');

// ==========================================
// 1. إنشاء سيرفر الويب لإرضاء منصة Render ومنع الـ Timed Out
// ==========================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bot is running 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Web Server] Listening on port ${PORT}`);
});

// ==========================================
// 2. إعدادات بوت التأفيك (Mineflayer)
// ==========================================
const botOptions = {
  host: 'nightfurymc.play.hosting', // IP سيرفرك الجديد
  port: 25565,                      // البورت الافتراضي
  username: 'NightFuryMC',         // اسم بوت التأفيك
  version: false                    // يتصل بأحدث إصدار متاح تلقائياً
};

function createBot() {
  console.log('[Bot] Attempting to connect to nightfurymc.play.hosting...');
  const bot = mineflayer.createBot(botOptions);

  // عند الدخول بنجاح للسيرفر
  bot.on('spawn', () => {
    console.log(`[Bot] ${bot.username} joined NightFurryMC successfully!`);
  });

  // التعامل مع انقطاع الاتصال (Disconnect) وإعادة المحاولة
  bot.on('end', (reason) => {
    console.log(`[Bot] Disconnected: ${reason}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000); // إعادة الاتصال تلقائياً بعد 10 ثوانٍ
  });

  // التعامل مع الأخطاء بدون توقف التطبيق
  bot.on('error', (err) => {
    console.error('[Bot Error]:', err.message);
  });
}

// تشغيل البوت
createBot();
