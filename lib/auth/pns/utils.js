/*
  Это не работает, думаю лучше реализоваь OAuth2 на стороне ПНС
*/
'use strict'

const axios = require('axios')

exports.pnsUserToken = async function getUserToken (login, password) {
  const baseUrl = 'https://pns.hneu.edu.ua/login/token.php?'
  const url = `${baseUrl}username=${login}&password=${password}&service=content-web-service`
  const response = await axios.get(url)
  return response
}

exports.pnsUserProfileInfo = async function getUserProfileInfo (token) {
  const url = `https://pns.hneu.edu.ua/webservice/rest/server.php?wstoken=${token}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`
  const response = await axios.get(url)
  return response
}
