const telegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv').config();
const token = process.env.TELEGRAM_API;
const bot = new telegramBot(token, {webHook: { port: process.env.PORT }});

const url = process.env.APP_URL || 'https://binho-bot.herokuapp.com';

// setup webhook
bot.setWebHook(`${url}/bot${token}`);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Yo! yo! yo! \u{1F601}');
});
