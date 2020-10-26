const Bot = require('./src/application/telegram/bot')
const PVPC = require('./src/application/pvpc/pvpc')
const token = process.env.token
const pvpc = new PVPC(token)
const tgToken = process.env.tg_token
const bot = new Bot(tgToken,pvpc)
bot.start()