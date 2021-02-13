const express = require('express')
const path = require('path')

const logger = require('./utils/logger')
const loader = require('./dataHandlers/loader')
const tracker = require('./dataHandlers/data-tracker')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static('client/build'))

/*Every get request to /:category returns the index.html.
This is done to work with React router's paths. Otherwise when reloading
pages on front end, it would just sent requests to server and it cant answer. 
*/
app.get('/:category', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../client/build/')})
})

//Apply Access-Control-Allow-Origin: * to every response. 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/categories/:category', (req, res) => {

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

const categories = ['beanies, facemasks, gloves']

//Go through every category and fetch them. 
categories.forEach(category => loader.fetchCategory(category))

app.listen(PORT)
logger.run(PORT)