
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
      console.log('UPDATE CACHE start ',start)
      console.log('UPDATE CACHE end ',end)
      const result = await this.pvpc.getPriceInRangeDate(start, end)
      console.log('UPDATE CACHE request result ',result)
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
    console.log('Filtering data, current cache: ',this.cache)
    console.log('Filtering start ', start)
    console.log('Filtering end ,',end)
    const result = this.cache.filter((item) => {
      const date = new Date(item.datetime)
      const startDate = new Date(start)
      const endDate = new Date(end)
      if(date.getTime() < startDate.getTime()) {
        console.log('date is less than start so it wont be in the filtered result ',date+' --- '+startDate)
      }
      if(date.getTime() > endDate.getTime()) {
        console.log('date is greater than end so it wont be in the filtered result ',date+' --- '+endDate)
      }
      return date.getTime() >= startDate.getTime() && date.getTime() < endDate.getTime()
    })
    //console.log('filtered result ',result)
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
      console.log(' GET : tomorrow ',now)
      const date = new Date(start)
      date.setTime( date.getTime() - new Date().getTimezoneOffset()*60*1000 )
      console.log('GET date',date)
      console.log('GET start',start)
      if (date > now || this.checkHoursDiff(start,end) > 24) {
        throw new Error('Cannot fetch data with this time range.')
      }
      // If cache is empty, reload it
      if (this.cache.length === 0) {
        console.log('cache empty, reloading')
        await this.updateCache(start, end)
      }
      let data = this.filterData(start, end)
      console.log('GET data ',data)
      // If there is data in cache but not the results, fetch and cache them
      if (!data || !Array.isArray(data) || data.length === 0 ) {
        console.log('cache not empty, but requested data is not in there, reloading')
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