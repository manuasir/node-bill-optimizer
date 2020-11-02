
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

class DataRepository {

  constructor(pvpc) {
    this.pvpc = pvpc
    this.cache = []
  }

  /**
   * Fills the cache with data
   * @param {String} start
   * @param {String} end
   */
  async updateCache(start, end) {
    try {
      const result = await this.pvpc.getPriceInRangeDate(start, end)
      const tempArr = [...this.cache, ...result]
      this.cache = tempArr.filter((thing, index) => {
        const _thing = JSON.stringify(thing.datetime)
        return index === tempArr.findIndex(obj => {
          return JSON.stringify(obj.datetime) === _thing
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  getCache() {
    return this.cache
  }

  addConsultedTimes(data) {
    data.map((item) => {
      item.consulted = (item.consulted) ? item.consulted + 1 : 1
    })
    return data
  }

  filterData(start, end) {
    const result = this.cache.filter((item) => {
      const date = new Date(item.datetime.split('.')[0])
      date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 )
      const startDate = new Date(start)
      startDate.setTime( startDate.getTime() - new Date().getTimezoneOffset()*60*1000 )
      const endDate = new Date(end)
      endDate.setTime( endDate.getTime() - new Date().getTimezoneOffset()*60*1000 )
      return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()
    })

    return result
  }

  checkHoursDiff(start, end) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.abs(startDate - endDate) / 36e5 + 1
  }

  async get(start, end) {
    try {
      const now = new Date().addDays(1)
      const date = new Date(start)
      date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 )
      if (date > now || this.checkHoursDiff(start,end) > 25) {
        throw new Error('Cannot fetch data with this time range.')
      }
      // If cache is empty, reload it
      if (this.cache.length === 0) {
        await this.updateCache(start, end)
      }
      let data = this.filterData(start, end)

      // If there is data in cache but not the results, fetch and cache them
      if (!data || !Array.isArray(data) || data.length === 0 || data.length < this.checkHoursDiff(start,end)) {
        await this.updateCache(start, end)
        data = this.filterData(start, end)
      }

      const enrichData = this.addConsultedTimes(data)
      return enrichData
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = DataRepository