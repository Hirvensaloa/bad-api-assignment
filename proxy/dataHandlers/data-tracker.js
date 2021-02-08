//This file contains tools for checking differences between cached data in the proxy and APIs data. 

const fetch = require('node-fetch')

const logger = require('./../utils/logger')
const loader = require('./loader')
const container = require('./containers')

//Checks every 5 seconds if api has been modified. 
const update = () => {

    Promise.all(updateAllManufacturers())
        .then((values) => {
            logger.info('Manufacturers updated succesfully')
            setTimeout(update, 5000)
        })
        .catch(err => {
            logger.error('Updating manufacturers', err)
            setTimeout(update, 5000)
        })
}

//Update data for all maufacturers. 
const updateAllManufacturers = () => {

    logger.info('Updating manufacturers...')
    
    const it = loader.manufacturerEtags.keys()

    let manufacturer = it.next()

    let promises = []
    
    while(!manufacturer.done){
        promises.push(updateManufacturer(manufacturer.value))
        manufacturer = it.next()
    }

    return promises
}

/*Update a single manufacturer. Fetches data from the API and compares Etags. If etags don't match add data to container. 
Returns a Promise which is resolved when data has been updated. */
const updateManufacturer = (manufacturer) => {

    return new Promise((resolve, reject) => {

        loader.fetchManufacturer(manufacturer)
            .then(data => {
                if(data.etag !== loader.manufacturerEtags.get(manufacturer)){
                    container.addManufacturer(manufacturer, data.json)
                    logger.info(`Noticed changes with manufacturer: ${manufacturer}`)
                }
                resolve()
            })
            .catch(err => {
                logger.error(`While updating manufacturer ${manufacturer}`)
                reject(err)
            })

    })
}


module.exports = {
    update
}