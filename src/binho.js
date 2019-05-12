import Telegraf, { Markup, Extra } from "telegraf";
import dotenv from "dotenv";
import getHoroscope from "./utils/zodiac";
import getQuestion from "./utils/questions";
import getAlbum from "./utils/1001";
import { getSpotifyAlbum } from "./utils/spotify";

dotenv.config({ silent: true });
//const token = process.env.TELEGRAM_API;
const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  Markup.removeKeyboard(true)
  ctx.reply('Hello')
})

bot.on(/^\/(start|help|ajuda)$/, async (msg, props) => {
  let id = msg.from.id;
  let name = msg.from.first_name;
  return bot.sendMessage(
    msg.from.id,
    `Olá ${name},\n\nEu sou o Binho e estou aqui para te ajudar \u{1F916}\n\n - Se quer saber seu horóscopo do dia: /signo\n - Se quiser uma pergunta aleatória: /pergunta\n - Se quiser um album aleatório: /album `,
    { parseMode: "markdown", replayMarkup: "hide" }
  );
});


bot.command('signo', ({ reply }) => {
  reply('Qual seu signo?', Markup.keyboard([
    ["♈ Áries", "♉ Touro", "♊ Gêmeos"],
    ["♋ Câncer", "♌ Leão", "♍ Virgem"],
    [ "♎ Libra", "♏ Escorpião", "♐ Sagitário" ],
    [ "♑ Capricórnio", "♒ Aquário", "♓ Peixes" ],
  ]).oneTime().resize().extra())
})

bot.hears(/^(♈|♉|♊|♋|♌|♍|♎|♏|♐|♑|♒|♓)(.+)$/, async ctx => {
  const term = ctx.match[1];
  let id = ctx.from.id;
  let name = ctx.from.first_name;
  let result = await getHoroscope(term);
  ctx.reply(`*${result.day}*\n${name}, ${result.horoscope}`,
     Extra.markdown()
  )
});

bot.hears(/pergunta?(.+)/, async ctx => {
  let arg = ctx.match[1]
  let index = Number.isInteger(parseInt(arg)) ? parseInt(arg) : "random"
  const question = await getQuestion(index);
  ctx.reply(question);
});

bot.action(/spotify (.+)$/, async ctx => {
  const arg = ctx.match[1];
  const album = await getSpotifyAlbum(arg);
  let response = ``;
  if (album) {
    response = `${album.external_urls.spotify}`;
  } else {
    response = `Ops! Esse album não existe no spotify =(`;
  }
  ctx.reply(response, Extra.markdown());
});


bot.command('album', async ctx => {
  const album = await getAlbum("random");
  return ctx.reply(album, Markup.inlineKeyboard([
     Markup.callbackButton('🔍 Spotify', `spotify ${album}`)

  ]).extra())
})

bot.launch();
