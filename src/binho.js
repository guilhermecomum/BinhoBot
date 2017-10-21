import TeleBot from 'telebot'
import dotenv from 'dotenv'
import cheerio from 'cheerio'
import superagent from 'superagent'

dotenv.config({ silent: true })
const token = process.env.TELEGRAM_API;

const bot = new TeleBot(token)

const zodiac = {
  "♈ Áries": "aries",
  "♉ Touro": "touro",
  "♊ Gêmeos": "gemeos",
  "♋ Câncer": "cancer",
  "♌ Leão": "leao",
  "♍ Virgem": "virgem",
  "♎ Libra": "libra",
  "♏ Escorpião": "escorpiao",
  "♐ Sargitário": "sargitario",
  "♑ Capricórnio": "capricornio",
  "♒ Aquário": "aquario",
  "♓ Peixes": "peixes"
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
    [bot.button('♎ Libra'), bot.button('♏ Escorpião'), bot.button('♐ Sargitário')],
    [bot.button('♑ Capricórnio'), bot.button('♒ Aquário'), bot.button('♓ Peixes')],
    ['Sair']
  ], {resize: true});
  return bot.sendMessage(msg.from.id, 'Qual seu signo?', {replyMarkup});
})

bot.on(/(.+)/, (msg, props) => {
  const term = zodiac[props.match[1]]
  superagent.get(`http://emais.estadao.com.br/horoscopo/${term}`).then(response => {
    let $ = cheerio.load(response.text)
    let horoscopo = $('.h__signo__dia + p').text()
    return bot.sendMessage(msg.from.id, `${msg.from.first_name}, ${horoscopo}`)
  })
})

// Hide keyboard
bot.on('Sair', msg => {
  return bot.sendMessage(
    msg.from.id, 'Cya!', {replyMarkup: 'hide'}
  );
});

bot.start()
