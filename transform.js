const { writeFile } = require('fs')
const DATA = require('./data.json')


const metro = [1, 2, 4, 5]
const tram = [3, 4, 7, 8, 9, 19, 25, 39, 44, 51, 55, 62, 81, 82, 92, 93, 97]

const data = DATA.map(d => ({
  ...d, 
  type: metro.includes(parseInt(d.lineId)) ? 'METRO'
        : tram.includes(parseInt(d.lineId)) ? 'TRAM'
        : 'BUS'
}))

writeFile('data_types.json', JSON.stringify(data), 'utf-8', console.log)
