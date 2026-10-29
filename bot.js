const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'nightfurymc.play.hosting', // مثال: play.myserver.com (امسح النص العربي واكتب الأيباي بين القوسين)
        port: 25565,                // ضع بورت سيرفرك هنا
        username: 'NightFuryMC',     // اسم البوت داخل السيرفر
        version: false              // كشف إصدار السيرفر تلقائياً
    });

    bot.on('spawn', () => {
        console.log('✅ البوت متصل الآن وفي السيرفر بنجاح!');
        
        // حركة تلقائية كل 30 ثانية لكي لا يفصلك السيرفر بتهمة الخمول (AFK)
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() * Math.PI) - (Math.PI / 2);
            bot.look(yaw, pitch, true);
        }, 30000);
    });

    // إعادة الاتصال تلقائياً إذا انقطع النت أو طفأ السيرفر
    bot.on('end', () => {
        console.log('⚠️ انقطع الاتصال، جارِ إعادة المحاولة خلال 5 ثوانٍ...');
        setTimeout(createBot, 5000);
    });

    bot.on('error', err => console.log('❌ حدث خطأ:', err));
}

createBot();
