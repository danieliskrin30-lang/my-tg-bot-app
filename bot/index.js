const { Bot, InlineKeyboard, Keyboard } = require("grammy");
require("dotenv").config();

// ============================================================
// CONFIG
// ============================================================

const webAppUrl = process.env.WEB_APP_URL || "";
if (!webAppUrl) {
  console.warn("[WARN] WEB_APP_URL is not set. The bot's web app menu button may not work correctly.");
}

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN || "");

// ============================================================
// CONTENT DATABASE
// ============================================================

const quotes = [
  "Любовь — это не находить идеального человека, а научиться видеть несовершенного по-настоящему. — Сэм Кин",
  "Самая большая проблема отношений — не отсутствие любви, а отсутствие мужества быть честным. — Джон Готтман",
  "Отношения не делают вас счастливыми сразу. Они делают вас настоящими. — Эстер Перель",
  "Вы не можете изменить другого человека. Но можете изменить то, как вы реагируете на этого человека. — Харриет Лернер",
  "Здоровые отношения — это не идеальные отношения, а честные отношения. — Джон Готтман",
  "Сильнее всего мы привязаны не к тем, кто делает нам хорошо, а к тем, от кого ждёте, что они начнут. — Роберт Грин",
  "Любовь — это навык, а не чувство. Ей нужно учиться и практиковаться. — Эрих Фромм",
  "То, как вы относитесь к себе, становится эталоном того, как другие относятся к вам. — Доктор Генри Клауд",
  "Невозможно построить отношения с другим человеком, если они полностью разрушены с собой. — Эстер Перель",
  "Связь создаётся не словами, а присутствием. — Джон Готтман",
  "Страх близости — это чаще всего страх быть отвергнутым таким, какой ты есть. — Сью Джонсон",
  "Лучшее, что вы можете сделать для своих отношений — это заняться собой. — Харриет Лернер",
  "Истинная близость начинается там, где заканчивается страх показать свои недостатки. — Брене Браун",
  "Здоровые отношения — это когда можно быть разными и при этом быть вместе. — Эстер Перель",
  "Мы не разрушаем отношения из-за того, что чувствуем слишком много. Мы их разрушаем из-за того, что чувствуем слишком мало. — Сью Джонсон",
];

const tips = [
  "Попробуйте сегодня сказать своему близкому что-то, за что вы его цените. Даже маленькое признание может изменить настроение обоих.",
  "Проведите сегодня 10 минут в тишине вместе — без телефонов, без разговоров. Просто рядом. Это укрепляет связь сильнее, чем кажется.",
  "Если сегодня возникнет конфликт — попробуйте перед ответом сделать глубокий вдох и посчитать до трёх. Это даёт мозгу время переключиться с реакции на понимание.",
  "Вспомните одно хорошее воспоминание, которое вас связывает. Можете даже написать его. Тёплые воспоминания — топливо для отношений.",
  "Замечайте сегодня моменты, когда вы слушаете — действительно слушаете, а не просто ждёте своей очереди заговорить.",
  "Если вы чувствуете одиночество в отношениях — это не значит, что всё разрушено. Это часто значит, что пора поговорить. Попробуйте.",
  "Не пытайтесь быть идеальным партнёром. Будьте настоящим — это значительно ценнее.",
  "Перед тем как лечь спать, скажите друг другу что-нибудь тёплое. Исследования Готтмана показывают: пара хороших слов важнее одного конфликта.",
  "Если вам трудно — не бойтесь обратиться к специалисту. Это не слабость, это забота о себе и об отношениях.",
  "Спросите сегодня: «Что я могу сделать для тебя лучше?» — и действительно услышьте ответ.",
];

const supportivePhrases = [
  "Я слышу тебя. То, что ты чувствуешь, — это нормально, и ты не один/одна.",
  "Благодарю, что поделился/пошла. Это требует мужества, и я ценю твое доверие.",
  "Иногда нужно просто высказаться — и ты уже сделал/сделала первый шаг.",
  "Твои чувства важны. Не давай никому из обесценивать их.",
  "Ты не обязан/обязана всё знать и всё решать прямо сейчас. Позволь себе время.",
  "Мы все иногда теряемся. Это не значит, что мы сломаны — это значит, что мы живые.",
  "Позволь себе быть несовершенным/несовершенной. Именно таким/такой тебя и любят.",
];

const moodResponses = {
  happy: [
    "Замечательно, что у тебя такой настрой! ☀️ Расскажи, что именно делает этот день хорошим?",
    "Рад(а) за тебя! Хорошее настроение — это ресурс. Не забудь поделиться им с близкими.",
    "Прекрасно! Такие моменты стоит замечать и запоминать — они помогают в трудные дни.",
  ],
  neutral: [
    "И это нормально. Не каждый день нужно быть продуктивным или счастливым. Просто позволь себе быть.",
    "Спокойное состояние — тоже ресурс. Иногда именно из него рождаются лучшие решения.",
    "Понимаю. Хочешь, дам короткий совет или просто побудем в тишине? 💫",
  ],
  sad: [
    "Мне жаль, что тебе сейчас тяжело. Помни — это временно, даже если кажется, что навсегда. 💛",
    "Ты имеешь полное право чувствовать себя так. Иногда нужно пройти через тьму, чтобы увидеть свет.",
    "Я здесь. Хочешь поговорить о том, что тревожит? Или могу предложить что-то поддерживающее.",
  ],
  anxious: [
    "Тревога — это не опасность, это сигнал. Давай попробуем разобраться, о чём она тебе говорит.",
    "Попробуй сделать 3 глубоких вдоха. Ты в безопасности прямо сейчас. Это состояние пройдёт.",
    "Тревога часто преувеличивает угрозу. Спроси себя: «Что самое реалистичное может случиться?» — и обычно окажется не так страшно.",
  ],
  angry: [
    "Злость — это нормальная эмоция. Важно не подавлять её, а понять, что стоит за ней.",
    "Злость часто подсказывает, где нарушены наши границы. Что в твоих отношениях сейчас кажется несправедливым?",
    "Дай себе время. Злость — это энергия. Когда остынешь — можно будет действовать спокойно и осознанно.",
  ],
};

// ============================================================
// WELCOME MESSAGE HANDLER (DO NOT EDIT THE /start COMMAND)
// ============================================================

const mainKeyboard = new Keyboard()
  .text("📖 Цитата")
  .text("💡 Совет дня")
  .row()
  .text("🎭 Моё настроение")
  .text("🗣 Поговорить")
  .resized()
  .persistent();

bot.command("start", async (ctx) => {
  console.log(`Received /start command from user ${ctx.from?.username || 'unknown'}`);
  try {
    await ctx.reply(`<b>Привет, ${ctx.from?.first_name || 'друг'}!</b>\n\nРады видеть тебя здесь. Это безопасное место, где ты можешь бережно прикоснуться к своему прошлому и стать ближе к себе нынешнему.\n\nНажми на кнопку <b>"🍃 Открыть"</b> внизу экрана, чтобы начать наше путешествие.`, {
      parse_mode: "HTML",
    });
    await ctx.reply("🍃 Меню:", { reply_markup: mainKeyboard });
    console.log("Reply sent successfully!");
  } catch (err) {
    console.error("CRITICAL ERROR during /start callback:", err.description || err.message);
  }
});

// ============================================================
// HELP COMMAND
// ============================================================

bot.command("help", async (ctx) => {
  console.log(`Received /help command from user ${ctx.from?.username || 'unknown'}`);
  try {
    const helpText = `
<b>🍃 Доступные команды:</b>

📖 <b>/quote</b> — цитата психолога об отношениях
💡 <b>/tip</b> — совет на день для отношений
🎭 <b>/mood</b> — поделиться настроением
🗣 <b>/talk</b> — поговорить о конкретной теме

Это пространство создано для того, чтобы поддержка и немного рефлексии были всегда под рукой.
`;
    await ctx.reply(helpText, { parse_mode: "HTML" });
  } catch (err) {
    console.error("Error during /help callback:", err.message);
  }
});

// ============================================================
// QUOTE COMMAND
// ============================================================

bot.command("quote", async (ctx) => {
  console.log(`Received /quote command from user ${ctx.from?.username || 'unknown'}`);
  try {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const keyboard = new InlineKeyboard()
      .text("📖 Ещё цитату", "more_quote")
      .text("💡 Совет дня", "tip");
    await ctx.reply(`${quote}\n\n— Нажми кнопку для продолжения`, { reply_markup: keyboard });
  } catch (err) {
    console.error("Error during /quote callback:", err.message);
  }
});

// ============================================================
// TIP COMMAND
// ============================================================

bot.command("tip", async (ctx) => {
  console.log(`Received /tip command from user ${ctx.from?.username || 'unknown'}`);
  try {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const keyboard = new InlineKeyboard()
      .text("💡 Ещё совет", "more_tip")
      .text("📖 Цитату", "quote");
    await ctx.reply(`💡 <b>Совет на день:</b>\n\n${tip}`, { parse_mode: "HTML", reply_markup: keyboard });
  } catch (err) {
    console.error("Error during /tip callback:", err.message);
  }
});

// ============================================================
// MOOD COMMAND
// ============================================================

bot.command("mood", async (ctx) => {
  console.log(`Received /mood command from user ${ctx.from?.username || 'unknown'}`);
  try {
    const keyboard = new Keyboard()
      .text("☀️ Отлично")
      .text("😌 Спокойно")
      .row()
      .text("😢 Грустно")
      .text("😰 Тревожно")
      .text("😤 Злюсь")
      .resized();
    await ctx.reply("Как ты себя чувствуешь прямо сейчас? Выбери, что ближе:", { reply_markup: keyboard });
  } catch (err) {
    console.error("Error during /mood callback:", err.message);
  }
});

// ============================================================
// TALK COMMAND (topic-based conversations)
// ============================================================

bot.command("talk", async (ctx) => {
  console.log(`Received /talk command from user ${ctx.from?.username || 'unknown'}`);
  try {
    const keyboard = new Keyboard()
      .text("💔 Расставание")
      .text("❤️ Близость")
      .text("💪 Доверие")
      .row()
      .text("💬 Границы")
      .text("🪞 Самооценка")
      .text("🔥 Конфликты")
      .resized();
    await ctx.reply("О чём хочешь поговорить? Выбери тему или просто напиши, что тебя волнует:", { reply_markup: keyboard });
  } catch (err) {
    console.error("Error during /talk callback:", err.message);
  }
});

// ============================================================
// TOPIC DATABASE FOR /talk
// ============================================================

const topics = {
  "💔 Расставание": {
    text: "Расставание — всегда больно, даже если оно к лучшему.\n\nНекоторые вещи, которые могут помочь:\n\n• Дай себе время горевать — это нормально\n• Не торопись закрывать чувства\n• Помни: прошлое не определяет твоё будущее\n• Обратись к близким, не оставайся один/одна\n\nТы выстоишь. Даже если сейчас кажется, что нет.",
  },
  "❤️ Близость": {
    text: "Близость — это не только физическая сторона.\n\nНастоящая близость начинается с уязвимости — способности показать себя настоящего/настоящую.\n\nСоветы для углубления близости:\n\n• Делитесь маленькими страхами, а только победами\n• Проводите время без телефонов\n• Говорите «я чувствую...» вместо «ты всегда...»\n• Будьте любопытными друг к другу — люди меняются\n\nБлизость — это выбор, который нужно делать каждый день.",
  },
  "💪 Доверие": {
    text: "Доверие строится годами, а разрушается за секунду. Но его можно восстановить.\n\nЧто помогает:\n\n• Говорить правду, даже когда неудобно\n• Не давать обещаний, которые не сможете выполнить\n• Показывать — не только говорить\n• Признать ошибку, не оправдываясь\n\nДоверие — это мост между двумя людьми. Его стоит строить.",
  },
  "💬 Границы": {
    text: "Границы — это не стены. Это двери, к которым вы решаете, кому открывать.\n\nКак установить здоровые границы:\n\n• Определите, что вас задевает и что для вас неприемлемо\n• Говорите «нет» спокойно и без оправданий\n• Не терпите неуважение, даже если вам страшно потерять\n• Помните: границы — это акт любви к себе\n\nЧеловек, который уважает вас, примет ваши границы.",
  },
  "🪞 Самооценка": {
    text: "Самооценка — фундамент всех отношений. Нельзя дать другому то, чего не даёшь себе.\n\nЧто помочь в подъёме самооценки:\n\n• Замечайте свои достижения, даже маленькие\n• Говорите с собой так, как говорили бы с лучшим другом\n• Не сравнивайте своё «внутри» с чужим «снаружи»\n• Позволяйте себе отдых без чувства вины\n\nВы уже достаточно хороши. Прямо сейчас.",
  },
  "🔥 Конфликты": {
    text: "Конфликты неизбежны. Но они не обязательно разрушительны.\n\nПравила здорового конфликта:\n\n• Говорите о конкретном, а не в общем\n• Не используйте «всегда» и «никогда»\n• Делайте паузы, если чувствуете, что «закипаете»\n• Избегайте критики личности — говорите о поведении\n• После конфликта: признание, извинение, движение дальше\n\nКонфликт может стать точкой роста, если оба хотят понять.",
  },
};

// ============================================================
// CALLBACK QUERY HANDLERS (inline buttons)
// ============================================================

bot.callbackQuery("more_quote", async (ctx) => {
  try {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const keyboard = new InlineKeyboard()
      .text("📖 Ещё цитату", "more_quote")
      .text("💡 Совет дня", "tip");
    await ctx.reply(`${quote}\n\n— Нажми кнопку для продолжения`, { reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error("Error handling more_quote callback:", err.message);
  }
});

bot.callbackQuery("tip", async (ctx) => {
  try {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const keyboard = new InlineKeyboard()
      .text("💡 Ещё совет", "more_tip")
      .text("📖 Цитату", "quote");
    await ctx.reply(`💡 <b>Совет на день:</b>\n\n${tip}`, { parse_mode: "HTML", reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error("Error handling tip callback:", err.message);
  }
});

bot.callbackQuery("more_tip", async (ctx) => {
  try {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const keyboard = new InlineKeyboard()
      .text("💡 Ещё совет", "more_tip")
      .text("📖 Цитату", "quote");
    await ctx.reply(`💡 <b>Совет на день:</b>\n\n${tip}`, { parse_mode: "HTML", reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error("Error handling more_tip callback:", err.message);
  }
});

bot.callbackQuery("quote", async (ctx) => {
  try {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const keyboard = new InlineKeyboard()
      .text("📖 Ещё цитату", "more_quote")
      .text("💡 Совет дня", "tip");
    await ctx.reply(`${quote}\n\n— Нажми кнопку для продолжения`, { reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error("Error handling quote callback:", err.message);
  }
});

// ============================================================
// MOOD RESPONSE HANDLERS (keyboard buttons)
// ============================================================

bot.hears("☀️ Отлично", async (ctx) => {
  try {
    const response = moodResponses.happy[Math.floor(Math.random() * moodResponses.happy.length)];
    await ctx.reply(response);
  } catch (err) {
    console.error("Error handling mood response:", err.message);
  }
});

bot.hears("😌 Спокойно", async (ctx) => {
  try {
    const response = moodResponses.neutral[Math.floor(Math.random() * moodResponses.neutral.length)];
    await ctx.reply(response);
  } catch (err) {
    console.error("Error handling mood response:", err.message);
  }
});

bot.hears("😢 Грустно", async (ctx) => {
  try {
    const response = moodResponses.sad[Math.floor(Math.random() * moodResponses.sad.length)];
    await ctx.reply(response);
  } catch (err) {
    console.error("Error handling mood response:", err.message);
  }
});

bot.hears("😰 Тревожно", async (ctx) => {
  try {
    const response = moodResponses.anxious[Math.floor(Math.random() * moodResponses.anxious.length)];
    await ctx.reply(response);
  } catch (err) {
    console.error("Error handling mood response:", err.message);
  }
});

bot.hears("😤 Злюсь", async (ctx) => {
  try {
    const response = moodResponses.angry[Math.floor(Math.random() * moodResponses.angry.length)];
    await ctx.reply(response);
  } catch (err) {
    console.error("Error handling mood response:", err.message);
  }
});

// ============================================================
// MAIN MENU BUTTONS (persistent keyboard)
// ============================================================

function handleQuoteAction(ctx) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const keyboard = new InlineKeyboard()
    .text("📖 Ещё цитату", "more_quote")
    .text("💡 Совет дня", "tip");
  return ctx.reply(`${quote}\n\n— Нажми кнопку для продолжения`, { reply_markup: keyboard });
}

function handleTipAction(ctx) {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const keyboard = new InlineKeyboard()
    .text("💡 Ещё совет", "more_tip")
    .text("📖 Цитату", "quote");
  return ctx.reply(`💡 <b>Совет на день:</b>\n\n${tip}`, { parse_mode: "HTML", reply_markup: keyboard });
}

function handleMoodAction(ctx) {
  const keyboard = new Keyboard()
    .text("☀️ Отлично")
    .text("😌 Спокойно")
    .row()
    .text("😢 Грустно")
    .text("😰 Тревожно")
    .text("😤 Злюсь")
    .resized();
  return ctx.reply("Как ты себя чувствуешь прямо сейчас? Выбери, что ближе:", { reply_markup: keyboard });
}

function handleTalkAction(ctx) {
  const keyboard = new Keyboard()
    .text("💔 Расставание")
    .text("❤️ Близость")
    .text("💪 Доверие")
    .row()
    .text("💬 Границы")
    .text("🪞 Самооценка")
    .text("🔥 Конфликты")
    .resized();
  return ctx.reply("О чём хочешь поговорить? Выбери тему или просто напиши, что тебя волнует:", { reply_markup: keyboard });
}

bot.hears("📖 Цитата", async (ctx) => {
  try { await handleQuoteAction(ctx); }
  catch (err) { console.error("Error handling quote button:", err.message); }
});

bot.hears("💡 Совет дня", async (ctx) => {
  try { await handleTipAction(ctx); }
  catch (err) { console.error("Error handling tip button:", err.message); }
});

bot.hears("🎭 Моё настроение", async (ctx) => {
  try { await handleMoodAction(ctx); }
  catch (err) { console.error("Error handling mood button:", err.message); }
});

bot.hears("🗣 Поговорить", async (ctx) => {
  try { await handleTalkAction(ctx); }
  catch (err) { console.error("Error handling talk button:", err.message); }
});

// ============================================================
// TOPIC RESPONSE HANDLERS (keyboard buttons)
// ============================================================

bot.hears("💔 Расставание", async (ctx) => {
  try {
    await ctx.reply(topics["💔 Расставание"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

bot.hears("❤️ Близость", async (ctx) => {
  try {
    await ctx.reply(topics["❤️ Близость"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

bot.hears("💪 Доверие", async (ctx) => {
  try {
    await ctx.reply(topics["💪 Доверие"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

bot.hears("💬 Границы", async (ctx) => {
  try {
    await ctx.reply(topics["💬 Границы"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

bot.hears("🪞 Самооценка", async (ctx) => {
  try {
    await ctx.reply(topics["🪞 Самооценка"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

bot.hears("🔥 Конфликты", async (ctx) => {
  try {
    await ctx.reply(topics["🔥 Конфликты"].text);
  } catch (err) {
    console.error("Error handling topic response:", err.message);
  }
});

// ============================================================
// DEFAULT MESSAGE HANDLER
// ============================================================

bot.on("message:text", async (ctx) => {
  const userMsg = (ctx.message.text || "").toLowerCase();

  // Check for /help and topic keywords even in regular messages
  if (userMsg.includes("помощь") || userMsg.includes("команды") || userMsg.includes("help")) {
    await ctx.reply(
      `Доступные команды:\n\n` +
      `📖 /quote — цитата психолога\n` +
      `💡 /tip — совет на день\n` +
      `🎭 /mood — поделиться настроением\n` +
      `🗣 /talk — поговорить о конкретной теме\n\n` +
      `Или просто напиши, что тебя волнует.`
    );
    return;
  }

  // Give supportive response to regular messages
  const phrase = supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];

  try {
    const keyboard = new Keyboard()
      .text("📖 Цитата")
      .text("💡 Совет")
      .row()
      .text("🎭 Настроение")
      .text("🗣 Тема")
      .resized();
    await ctx.reply(`💭 ${phrase}\n\nМогу предложить что-то полезное прямо сейчас:`, { reply_markup: keyboard });
  } catch (err) {
    console.error("Error in default message handler:", err.message);
  }
});

// ============================================================
// RUN BOT
// ============================================================

bot.start({
  drop_pending_updates: true,
  onStart: async (botInfo) => {
    console.log(`Bot @${botInfo.username} is running and updates were dropped...`);

    // Set the Menu Button (the one near the input field)
    try {
      await bot.api.setChatMenuButton({
        menu_button: {
          type: "web_app",
          text: "🍃 Открыть",
          web_app: { url: webAppUrl || "https://google.com" }
        }
      });
      console.log("Menu Button set successfully!");
    } catch (e) {
      console.error("Failed to set Menu Button:", e.message);
    }
  }
});
