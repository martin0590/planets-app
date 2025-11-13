const express = require('express')
const {httpAddNewLaunch, httpGetAllLaunches} = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)

module.exports = launchesRouter

