const cheerio = require('cheerio');
const axios = require('axios');

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

module.exports.getHoroscope = function(sign) {
  let zodiac = zodiacDict[sign]
  return axios.get(`http://emais.estadao.com.br/horoscopo/${zodiac}`).then((response) => {
    let $ = cheerio.load(response.data)
    let horoscope = $('.h__signo__dia + p').text().trim()
    let day = $('.h__signo__dia').text()
    return { day: day, horoscope: horoscope }
  })
}
