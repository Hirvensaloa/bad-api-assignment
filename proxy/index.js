const express = require('express')

const logger = require('./utils/logger')
const loader = require('./dataHandlers/loader')
const tracker = require('./dataHandlers/data-tracker')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static('build'))

//Apply Access-Control-Allow-Origin: * to every response. 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/:category', (req, res) => {

    const category = req.params.category

    logger.req(req)

    loader.getCategory(category)
        .then(data => {
            res.send(data)
            logger.info('Data sent succesfully')
        })
        .catch(err => {
            res.status(503).send('Error: Could not fetch data for ' + category + '. Server probably can not reach the APIs.')
        })

})

//When the server has been running for twenty seconds begin to update data. 
setTimeout(tracker.update, 20000)

app.listen(PORT)
logger.run(PORT)