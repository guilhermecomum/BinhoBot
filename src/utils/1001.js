import Albuns from './albumsDB'

export default function getAlbum(index) {

  const size = Albuns.length
  const random  = parseInt(Math.random() * (size - 0) + 0)

  if (index && index >= 1 && index <= size) {
    return Albuns[index - 1]
  }

  return Albuns[random]
}
