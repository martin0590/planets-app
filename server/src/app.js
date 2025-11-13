const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launcher.router')

const app = express()

// Middlewares
app.use(cors({
    origin: process.env.ORIGIN
}))
app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(planetsRouter)
app.use(launchesRouter)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app