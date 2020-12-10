const baseUrl = ''

async function fetchUserToken (baseUrl, login, password) {
  const url = `${baseUrl}${login}${password}`
  return fetch(url)
}

function getUserToken (login, password) {
  const response = await fetchUserToken(baseUrl, login, password)
  return response.json()
}

/*
  getUserToken()
    .then(res => {
      return (
        // save res.token to DB
        done(null, user)
      )
    })
    .catch(err => {
      return done(null, false)
    })
*/

export { getUserToken }
