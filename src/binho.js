import TeleBot from 'telebot'
import dotenv from 'dotenv'
import cheerio from 'cheerio'
import superagent from 'superagent'

dotenv.config({ silent: true })
const token = process.env.TELEGRAM_API;

const bot = new TeleBot(token)

const zodiac = {
  "♈": "aries",
  "♉": "touro",
  "♊": "gemeos",
  "♋": "cancer",
  "♌": "leao",
  "♍": "virgem",
  "♎": "libra",
  "♏": "escorpiao",
  "♐": "sagitario",
  "♑": "capricornio",
  "♒": "aquario",
  "♓": "peixes"
}

bot.on(/^\/receita (.+)$/, (msg, props) => {
  const term = props.match[1];
  superagent.get(`https://panelinha-api-server-prod.herokuapp.com/v1/search?title=${term}&pageSize=1&pageType=receita`).then(response => {
    console.log(response.body)
  })
})

bot.on(/\/signo/, (msg, props) => {

  let replyMarkup = bot.keyboard([
    [bot.button('♈ Áries'), bot.button('♉ Touro'), bot.button('♊ Gêmeos')],
    [bot.button('♋ Câncer'),bot.button('♌ Leão'), bot.button('♍ Virgem')],
    [bot.button('♎ Libra'), bot.button('♏ Escorpião'), bot.button('♐ Sagitário')],
    [bot.button('♑ Capricórnio'), bot.button('♒ Aquário'), bot.button('♓ Peixes')],
    [bot.button('Sair')]
  ], {resize: true});
  return bot.sendMessage(msg.from.id, 'Qual seu signo?', {replyMarkup});
})

bot.on(/^(♈|♉|♊|♋|♌|♍|♎|♏|♐|♑|♒|♓)(.+)$/, (msg, props) => {
  const term = zodiac[props.match[1]]
  superagent.get(`http://emais.estadao.com.br/horoscopo/${term}`).then(response => {
    let id = msg.from.id
    let name = msg.from.first_name
    let $ = cheerio.load(response.text)
    let horoscope = $('.h__signo__dia + p').text().trim()
    let day = $('.h__signo__dia').text()
    return bot.sendMessage( id, `*${day}*\n${name}, ${horoscope}`, {parseMode: 'markdown'} )
  })
})

// Hide keyboard
bot.on(/Sair/, msg => {
  return bot.sendMessage(
    msg.from.id, 'Até!', {replyMarkup: 'hide'}
  );
});

bot.start()
