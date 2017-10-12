const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const token = process.env.TELEGRAM_API;
const bot = new TelegramBot(token);
const url = process.env.APP_URL || 'https://binho-bot.herokuapp.com';
const port = process.env.PORT

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${token}`);

const app = express();

// parse the updates to JSON
app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

bot.on('message', (message) => {
  const userId = message.chat.id;
  console.log(message)
  bot.sendMessage(userId, 'Em que posso ajudar? \u{1F601}');
});
