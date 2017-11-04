import TeleBot from 'telebot'
import dotenv from 'dotenv'
import getHoroscope from './utils/zodiac'

dotenv.config({ silent: true })
const token = process.env.TELEGRAM_API;

const bot = new TeleBot(token)

bot.on(/\/signo/, (msg, props) => {
  let replyMarkup = bot.keyboard([
    [bot.button('♈ Áries'), bot.button('♉ Touro'), bot.button('♊ Gêmeos')],
    [bot.button('♋ Câncer'),bot.button('♌ Leão'), bot.button('♍ Virgem')],
    [bot.button('♎ Libra'), bot.button('♏ Escorpião'), bot.button('♐ Sagitário')],
    [bot.button('♑ Capricórnio'), bot.button('♒ Aquário'), bot.button('♓ Peixes')],
    [bot.button('Sair')]
  ], {resize: true});
  return bot.sendMessage(msg.from.id, 'Qual seu signo?', {replyMarkup})
})

bot.on(/^(♈|♉|♊|♋|♌|♍|♎|♏|♐|♑|♒|♓)(.+)$/, async (msg, props) => {
  const term = props.match[1]
  let id = msg.from.id
  let name = msg.from.first_name
  let result = await getHoroscope(term)
  bot.sendMessage( id, `*${result.day}*\n${name}, ${result.horoscope}`, {parseMode: 'markdown', replayMarkup: 'hide'} )
})

// Hide keyboard
bot.on(/Sair/, (msg) => {
  return bot.sendMessage(
    msg.from.id, 'Até!', {replyMarkup: 'hide'}
  )
})

bot.start()
