require('dotenv').config()
const https = require('https')

const cityName = process.argv[2]
console.log(cityName)
console.log(process.env.API_KEY)

https.get(`${process.env.BASE_URL}${cityName}?key=${process.env.API_KEY}`, (response) => {
    let data = ''

    response.on('data', (chunk) => {
        data += chunk
    })

    response.on('end', () => {
        console.log(JSON.parse(data))
    })   
}).on('error', (err) => {
    console.log(err)
})
