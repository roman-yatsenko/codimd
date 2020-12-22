'use strict'

const Router = require('express').Router
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const config = require('../../config')
const models = require('../../models')
const logger = require('../../logger')
const { setReturnToFromReferer } = require('../utils')
const { urlencodedParser } = require('../../utils')
const { pnsUserToken, pnsUserProfileInfo } = require('../pns/utils')
const response = require('../../response')
var Sequelize = require('sequelize')
const { or } = Sequelize.Op

const pnsAuth = module.exports = Router()

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async function (email, password, done) {
  let userToken = await pnsUserToken(email, password)
  let pnsUserId = await pnsUserProfileInfo(userToken)

  try {
    const user = models.User.findAll({
      where: {
        [or]: [
          { email: email },
          { profileid: pnsUserId }
        ]
      }
      // where: {
      //   email: email
      // }
    })

    if (!user) return done(null, false)
    return done(null, user)
  } catch (err) {
    logger.error(err)
    return done(err)
  }
}))

if (config.pnsAuth) {
  pnsAuth.post('/register', urlencodedParser, async function (req, res, next) {
    if (!req.body.email || !req.body.password) return response.errorBadRequest(req, res)

    let userToken = await pnsUserToken(req.body.email, req.body.password).then((res) => res.token, (err) => err)
    let pnsUserId = await pnsUserProfileInfo(userToken).then((res) => res.userid, (err) => err)

    try {
      if (userToken) {
        const [user, created] = await models.User.findOrCreate({
          where: {
            email: req.body.email
          },
          defaults: {
            password: req.body.password,
            profileid: pnsUserId
          }
        })
  
        if (!user) {
          req.flash('error', 'Failed to register your account, please try again.')
          return res.redirect(config.serverURL + '/')
        }
  
        if (created) {
          logger.debug('user registered: ' + user.id)
          req.flash('info', "You've successfully registered, please signin.")
        } else {
          logger.debug('user found: ' + user.id)
          req.flash('error', 'This email has been used, please try another one.')
        }
        return res.redirect(config.serverURL + '/')
      } else {
        req.flash('error', 'Failed to register your account, please try again.')
        return res.redirect(config.serverURL + '/')
      }
    } catch (err) {
      logger.error('auth callback failed: ' + err)
      return response.errorInternalError(req, res)
    }
  })
}

pnsAuth.post('/login', urlencodedParser, function (req, res, next) {
  if (!req.body.email || !req.body.password) return response.errorBadRequest(req, res)
  setReturnToFromReferer(req)
  passport.authenticate('local', {
    successReturnToOrRedirect: config.serverURL + '/',
    failureRedirect: config.serverURL + '/',
    failureFlash: 'Invalid email or password.'
  })(req, res, next)
})
