import cheerio from 'cheerio'
import axios from 'axios'

const zodiacDict = {
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

export default function getHoroscope(sign) {
  let zodiac = zodiacDict[sign]
  return axios.get(`http://emais.estadao.com.br/horoscopo/${zodiac}`).then((response) => {
    let $ = cheerio.load(response.data)
    let horoscope = $('.h__signo__dia + p').text().trim()
    let day = $('.h__signo__dia').text()
    return { day: day, horoscope: horoscope }
  })
}
