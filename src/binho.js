import TeleBot from 'telebot'
import dotenv from 'dotenv'
import got from 'got'
import cheerio from 'cheerio'
import superagent from 'superagent'

dotenv.config({ silent: true })
const token = process.env.TELEGRAM_API;

const bot = new TeleBot(token)


bot.on(/^\/receita (.+)$/, (msg, props) => {
  const term = props.match[1];
  got(`https://panelinha-api-server-prod.herokuapp.com/v1/search?title=${term}&pageSize=1&pageType=receita`).then(response => {
    console.log(response.body)
  })
})

bot.on(/^\/signo (.+)$/, (msg, props) => {
  const term = props.match[1];
  superagent.get(`http://emais.estadao.com.br/horoscopo/${term}`).then(response => {
    let $ = cheerio.load(response.text)
    let horoscopo = $('.h__signo__dia + p').text()
    return bot.sendMessage(msg.from.id, `Seu horoscopo (${term}): ${horoscopo}`)
  })
})

bot.start()
