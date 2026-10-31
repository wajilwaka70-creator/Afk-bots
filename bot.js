const http = require('http');
const mineflayer = require('mineflayer');

// ==========================================
// 1. إنشاء سيرفر الويب لإرضاء منصة Render ومنع الـ Timed Out
// ==========================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minecraft AFK Bots are running on different servers 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[Web Server] Listening on port ${PORT}`);
});

// ==========================================
// 2. إعدادات البوتات (كل بوت بسيرفر مختلف)
// ==========================================
const botsConfig = [
  {
    username: 'NightFuryMC',
    host: 'nightfurymc.play.hosting', // <--- أيبي السيرفر الأول
    port: 25565
  },
  {
    username: 'NightFurySMP',
    host: 'nightfurysmp1.play.hosting',         // <--- أيبي السيرفر الثاني
    port: 25565
  },
  {
    username: 'NightFuryMaceSMP',
    host: 'nightfurymacesmp.play.hosting',         // <--- أيبي السيرفر الثالث
    port: 25565
  },
  {
    username: 'NightFuryBoxPvP',
    host: 'nightfurycbox.play.hosting',         // <--- أيبي السيرفر الرابع
    port: 25565
  },
  
  {
    username: 'CPvP',
    host: 'space-mcc.play.hosting',         // <--- أيبي السيرفر الرابع
    port: 25565
  },
  
  {
    username: 'Lava',
    host: 'space-mcc123box.play.hosting',         // <--- أيبي السيرفر الرابع
    port: 25565
  },
  
  {
    username: 'Crystal',
    host: 'space-mccccarena.play.hosting',         // <--- أيبي السيرفر الرابع
    port: 25565
  }
];

function createBot(config, delay) {
  setTimeout(() => {
    console.log(`[Bot] Attempting to connect ${config.username} to ${config.host}:${config.port}...`);
    
    const bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      version: false // اكتشاف الإصدار تلقائياً لكل سيرفر
    });

    // عند الدخول بنجاح للسيرفر
    bot.on('spawn', () => {
      console.log(`[Bot] ${bot.username} joined ${config.host} successfully!`);
      
      // حركة تلقائية كل 30 ثانية لتفادي الطرد بسبب الخمول (AFK)
      const afkInterval = setInterval(() => {
        if (!bot.entity) return;
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
        
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() * Math.PI) - (Math.PI / 2);
        bot.look(yaw, pitch, true);
      }, 30000);

      // تنظيف الـ interval عند خروج البوت
      bot.once('end', () => {
        clearInterval(afkInterval);
      });
    });

    // التعامل مع انقطاع الاتصال وإعادة المحاولة لنفس السيرفر
    bot.on('end', (reason) => {
      console.log(`[Bot] ${config.username} Disconnected from ${config.host}: ${reason}. Reconnecting in 10 seconds...`);
      setTimeout(() => createBot(config, 0), 10000);
    });

    // التعامل مع الأخطاء بدون توقف التطبيق
    bot.on('error', (err) => {
      console.error(`[Bot Error - ${config.username}]:`, err.message);
    });

  }, delay);
}

// تشغيل البوتات بناءً على إعداداتها الخاصة مع فاصل زمني بين كل بوت
botsConfig.forEach((config, index) => {
  createBot(config, index * 4000);
});
