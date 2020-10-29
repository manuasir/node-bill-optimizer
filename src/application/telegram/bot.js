const Telebot = require('telebot')

class Bot {
  constructor(token, pvpc) {
    this.bot = new Telebot(token)
    this.pvpc = pvpc
  }

  async priceToday(msg, indicator) {
    try {
      const start = new Date().toISOString().split('T')[0] + `T00:00:00`
      const end = new Date().toISOString().split('T')[0] + `T23:59:59`
      const price = await this.pvpc.getPriceInRangeDate(start, end, indicator)
      const msgStr = this.genMsg(price)
      await msg.reply.text(msgStr)
    } catch (error) {
      console.error('Error.')
    }
  }


  genMsg(data) {
    if (!data || data.length === 0) throw new Error('No results.')
    let msg = ''
    data.forEach(item => {
      const date = new Date(item.datetime)
      msg +=
        `\n📅 Dia: ${date.toISOString().split('T')[0]}\n` +
        `⌚ Precio desde las ${date.getHours()}:00 a las ${date.getHours() + 1}:00: \n` +
        `💰 ${(item.value / 1000).toFixed(4)}€ kWh\n` +
        `------------------------------------------------`
    })
    return msg
  }

  async priceNow(msg, indicator) {
    try {
      const start = new Date()
      const end = new Date().setHours(start.getHours() + 1)
      const endStr = new Date(end).toISOString().split('.')[0]
      const startStr = start.toISOString().split('.')[0]
      const price = await this.pvpc.getPriceInRangeDate(startStr, endStr, indicator)
      const msgStr = this.genMsg(price)
      await msg.reply.text(msgStr)
    } catch (error) {
      await msg.reply.text('Error')
      console.error('Error.', error.message || error)
    }
  }

  async help(msg) {
    try {
      const msgStr =

        `Commands:\n` +
        `--------- \n` +
        `/precios_dha_diario - Precios del PVPC actualizados de hoy - Tarifa Discriminación Horaria \n` +
        `/precios_tn_diario -  Precios PVPC actualizados de hoy - Tarifa Normal \n` +
        `/precio_dha_ahora - Precio PVPC ahora en la Tarifa de Discriminación Horaria (DHA) \n` +
        `/precio_tn_ahora -  Precio PVPC ahora en la Tarifa Normal \n`

      await msg.reply.text(msgStr)
    } catch (error) {
      await msg.reply.text('Error')
      console.error('Error.', error.message || error)
    }
  }

  start() {
    try {
      this.bot.on(['/start', '/hello'], (msg) => msg.reply.text('Hola!'))
      this.bot.on(['/precios_dha_diario'], (msg) => this.priceToday(msg, 1014))
      this.bot.on(['/precios_tn_diario'], (msg) => this.priceToday(msg, 1015))
      this.bot.on(['/precio_dha_ahora'], (msg) => this.priceNow(msg, 1014))
      this.bot.on(['/precio_tn_ahora'], (msg) => this.priceNow(msg, 1015))
      this.bot.on(['/help'], (msg) => this.help(msg))
      this.bot.start()
    } catch (error) {
      console.error('Unknown error.', error)
    }

  }
}

module.exports = Bot