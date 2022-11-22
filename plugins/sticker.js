const { sticker } = require('../lib/sticker.js')
const uploadFile = require('../lib/uploadFile.js')
const uploadImage = require('../lib/uploadImage.js')
const { webp2png } = require('../lib/webp2mp4.js')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
      let img = await q.download?.()
      if (!img) throw `balas gambar/video/stiker dengan perintah ${usedPrefix + command}`
      try {
        stiker = await sticker(img, false, packname, author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          let out
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (!out || typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, packname, author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], packname, author)
      else return m.reply('URL tidak valid!')
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    else throw 'Masukkan Gambarnya'
  }
}
handler.help = ['stiker (caption|reply media)', 'stiker <url>', 'stikergif (caption|reply media)', 'stikergif <url>']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?(wm)?$/i
handler.group = true
module.exports= handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}