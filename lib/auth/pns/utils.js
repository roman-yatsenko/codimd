'use strict'

const axios = require('axios')

exports.pnsUserToken = async function getUserToken (login, password) {
  const baseUrl = 'https://pns.hneu.edu.ua/login/token.php?'
  const url = `${baseUrl}username=${login}&password=${password}&service=content-web-service`
  const response = await axios.get(url)
  return response
}

// exports.pnsUserToken = function pnsUserToken (login, password) {
//   return (
//     getUserToken(login, password)
//     .then(response => {
//       console.log(response)
//       return response.token
//     })
//     .catch(error => {
//       console.log(error)
//       return false
//     })
//   )
// }

exports.pnsUserProfileInfo = async function getUserProfileInfo (token) {
  const url = `https://pns.hneu.edu.ua/webservice/rest/server.php?wstoken=${token}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`
  const response = await axios.get(url)
  return response
}

// exports.pnsUserProfileInfo = function pnsUserProfileInfo (token) {
//   if (!token) return
//   return (
//     getUserProfileInfo(token)
//     .then(response => {
//       console.log(response)
//       return response.userid
//     })
//     .catch(error => console.log(error))
//   )
// }

//  = { pnsUserToken, pnsUserProfileInfo }
// export { pnsUserToken, pnsUserProfileInfo }
