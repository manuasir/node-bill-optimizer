const CsvReader = require('./src/csv-reader')

const csv = new CsvReader('./test/data/data.csv')
csv.load().then(data => {
}).catch(err => {
  console.error(err)
})
