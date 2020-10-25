const Bot = require('./src/application/telegram/bot')
const Dha = require('./src/application/dha/dha')
const token = process.env.token
const dha = new Dha(token)
const tgToken = process.env.tg_token
const bot = new Bot(tgToken,dha)
bot.start()