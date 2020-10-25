const Telebot = require('telebot')

class Bot {
  constructor(token, dha) {
    this.bot = new Telebot(token)
    this.dha = dha
  }

  async priceToday(msg) {
    try {
      await msg.reply.text('Precio: 20$')
    } catch (error) {
      console.error('Error.')
    }
  }


  genMsg(data) {
    if (!data || data.length === 0) throw new Error('No results.')
    let msg = ''
    data.forEach(item => {
      const date = new Date(item.datetime)
      msg += `
      Precio desde las ${date.getHours()}:00 a las ${date.getHours() + 1}:00: ${item.value / 1000}€/kWh`
    })
    return msg
  }

  async priceNow(msg) {
    try {
      const start = new Date()
      console.log(' -> start',start)
      const end = new Date().setHours(start.getHours() + 1)
      const endStr = new Date(end).toISOString().split('.')[0]
      const startStr = start.toISOString().split('.')[0]
      const price = await this.dha.getPriceInRangeDate(startStr, endStr)
      console.log('price ',price)
      const msgStr = this.genMsg(price)
      await msg.reply.text(msgStr)
    } catch (error) {
      await msg.reply.text('Error')
      console.error('Error.', error.message || error)
    }
  }

  start() {
    try {
      this.bot.on(['/start', '/hello'], (msg) => msg.reply.text('Hola!'))
      this.bot.on(['/preciohoy'], (msg) => this.priceToday(msg))
      this.bot.on(['/precioahora'], (msg) => this.priceNow(msg))
      this.bot.start()
    } catch (error) {
      console.error('Unknown error.', error)
    }

  }
}

module.exports = Bot