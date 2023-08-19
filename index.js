require('dotenv').config()
const https = require('https')

const [cityName, tempUnitFlag] = [process.argv[2], process.argv[3]]
const tempUnit = tempUnitFlag === "-f" ? "F" : "C"; 

https.get(`${process.env.BASE_URL}${cityName}?key=${process.env.API_KEY}`, (response) => {
    let data = ''

    response.on('data', (chunk) => {
        data += chunk
    })

    response.on('end', async () => {
        const weatherData =await JSON.parse(data);
        const { currentConditions , resolvedAddress, description} = weatherData
        console.log(`Current temperature in ${resolvedAddress} is ${currentConditions.temp}${tempUnit}.\nConditions are currently: ${currentConditions.conditions}.\nWhat you should expect: ${description}`)
    })   
}).on('error', (err) => {
    console.log({err})
})
