const CsvReader = require('./src/csv-reader')

const csv = new CsvReader('./test/data/data.csv')
csv.load().then(data => {
  console.log('the data, ', data)
}).catch(err => {
  console.error(err)
})
