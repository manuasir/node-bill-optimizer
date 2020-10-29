const Bot = require('./src/application/telegram/bot')
const PVPC = require('./src/application/pvpc/pvpc')
const Repo = require('./src/application/repository/repository')
const token = process.env.token
const pvpc = new PVPC(token)
const repo = new Repo(pvpc)
const tgToken = process.env.tg_token
const bot = new Bot(tgToken,repo)
bot.start()