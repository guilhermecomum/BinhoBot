import axios from 'axios'

const questionsJson = "https://spreadsheets.google.com/feeds/list/1MapTsyBcZxvh-WNvXUZHSn05cW7_fHD3F_E9r8PEIBE/od6/public/values?alt=json"

export default function getQuestion(index) {
  return axios.get(questionsJson).then((response) => {
    const questions = response.data.feed.entry
    const size = questions.length
    if ( index == 'random' ) {
      const random  = parseInt(Math.random() * (size - 0) + 0)
      return questions[random].title["$t"]
    } else if (index >= 1 && index <= size) {
      return questions[index - 1].title["$t"]
    } else {
      return `Não tenho essa pergunta, tente um número entre 1 e ${size}`
    }
  })
}

