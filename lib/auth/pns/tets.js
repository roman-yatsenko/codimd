'use strict'

const https = require('https')

async function getUserToken (login, password) {
  const tokenPns = https.get(`https://pns.hneu.edu.ua/login/token.php?username=${login}&password=${password}&service=content-web-service`, (response) => {
    let token
    let data = ''

    // A chunk of data has been recieved.
    response.on('data', (chunk) => {
      data += chunk
    })

    // The whole response has been received. Print out the result.
    response.on('end', () => {
      token = JSON.parse(data).token
    })
    return token
  }).on("error", (err) => {
    console.log("Error: " + err.message)
  })
  return tokenPns
}

let a = getUserToken('testpetro', 'testpetro')
console.log('is work', getUserToken('testpetro', 'testpetro'))