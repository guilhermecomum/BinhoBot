import TeleBot from "telebot";
import dotenv from "dotenv";
import getHoroscope from "./utils/zodiac";
import getQuestion from "./utils/questions";
import getAlbum from "./utils/1001";
import { getSpotifyAlbum } from "./utils/spotify";

dotenv.config({ silent: true });
const token = process.env.TELEGRAM_API;

const bot = new TeleBot({
  token: token,
  usePlugins: ["commandButton"]
});

bot.on(/^\/(start|help|ajuda)$/, async (msg, props) => {
  let id = msg.from.id;
  let name = msg.from.first_name;
  return bot.sendMessage(
    msg.from.id,
    `Olá ${name},\n\nEu sou o Binho e estou aqui para te ajudar \u{1F916}\n\n - Se quer saber seu horóscopo do dia: /signo\n - Se quiser uma pergunta aleatória: /pergunta\n - Se quiser um album aleatório: /album `,
    { parseMode: "markdown", replayMarkup: "hide" }
  );
});

bot.on(/\/signo/, (msg, props) => {
  let replyMarkup = bot.keyboard(
    [
      [bot.button("♈ Áries"), bot.button("♉ Touro"), bot.button("♊ Gêmeos")],
      [bot.button("♋ Câncer"), bot.button("♌ Leão"), bot.button("♍ Virgem")],
      [
        bot.button("♎ Libra"),
        bot.button("♏ Escorpião"),
        bot.button("♐ Sagitário")
      ],
      [
        bot.button("♑ Capricórnio"),
        bot.button("♒ Aquário"),
        bot.button("♓ Peixes")
      ],
      [bot.button("sair")]
    ],
    { resize: true }
  );
  return bot.sendMessage(msg.from.id, "Qual seu signo?", { replyMarkup });
});

bot.on(/^(♈|♉|♊|♋|♌|♍|♎|♏|♐|♑|♒|♓)(.+)$/, async (msg, props) => {
  const term = props.match[1];
  let id = msg.from.id;
  let name = msg.from.first_name;
  let result = await getHoroscope(term);
  bot.sendMessage(id, `*${result.day}*\n${name}, ${result.horoscope}`, {
    parseMode: "markdown",
    replayMarkup: "hide"
  });
});

bot.on(/^\/pergunta$/, async (msg, props) => {
  let id = msg.from.id;
  const question = await getQuestion("random");
  return bot.sendMessage(msg.from.id, question);
});

bot.on(/^\/pergunta (.+)$/, async (msg, props) => {
  const question = await getQuestion(props.match[1]);
  return bot.sendMessage(msg.from.id, question);
});

bot.on(/^\/spotify (.+)$/, async (msg, props) => {
  const term = props.match[1];
  const album = await getSpotifyAlbum(term);
  let markup = ``;
  if (album) {
    markup = `${album.external_urls.spotify}`;
  } else {
    markup = `Ops! Esse album não existe no spotify =(`;
  }
  return bot.sendMessage(msg.from.id, markup, { parseMode: "html" });
});

bot.on(/^\/album$/, async (msg, props) => {
  let id = msg.from.id;
  const album = await getAlbum("random");
  const replyMarkup = bot.inlineKeyboard([
    [
      bot.inlineButton("🔍 Spotify", {
        callback: `/spotify ${album}`
      })
    ]
  ]);

  return bot.sendMessage(msg.from.id, album, { replyMarkup });
});

// Hide keyboard
bot.on(/(sair|Sair)/, msg => {
  return bot.sendMessage(msg.from.id, "Até!", { replyMarkup: "hide" });
});

bot.start();
