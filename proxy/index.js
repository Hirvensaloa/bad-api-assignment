const express = require('express')
const fetch = require('node-fetch')

const PORT = process.env.PORT || 5000

const app = express()

const url = 'https://bad-api-assignment.reaktor.com/v2/products/'

//Apply Access-Control-Allow-Origin: * to every response. 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.get('/:category', (req, res) => {
    console.log('Received GET request to /' + req.params.category)
    
    fetch(url + req.params.category)
        .then(response => response.json())
        .then(json => res.send(json))
})

app.listen(PORT)
console.log('Server running on port ' + PORT)