//This file contains functions for loading data from the API. 

const fetch = require('node-fetch')

const logger = require('./../utils/logger')
const container = require('./containers')
const config = require('./../utils/config')

//Maps for storing Etags to check data freshness. Manufacturer as key and Etag as value. 
let manufacturerEtags = new Map()

//Fetches data for given manufacturer. Returns a promise that if resolved contains APIs response data as json and etag.  
const fetchManufacturer = (manufacturer) => {

    console.log('Fetching manufacturer: ' + manufacturer)

    return new Promise( (resolve, reject) => {

        fetch(config.manufacturerUrl + manufacturer)
            .then(response => {
                response.json()
                    .then((json) => {
                        //If response is not an array, send new request. 
                        if(!Array.isArray(json.response)) {
                            
                            fetchManufacturer(manufacturer)
                                .then(data => resolve(data))
                                .catch(err => reject(err)) 

                        } else {  //If succesful respond with data as json and etag.
                            const etag = response.headers.get('etag')
                            manufacturerEtags.set(manufacturer, etag) //Store etag to map.

                            resolve(
                                {
                                    etag: etag, 
                                    json: json.response
                                })
                        }
                    })
                    .catch(err => {
                        logger.error('Converting data to json', err)
                        reject(err)
                    })
            })
            .catch(err => {
                logger.error(`Fetching manufacturer ${manufacturer}`, err)
                reject(err)
            })        
    })  
}

//Fetches items for a given category. Return a promise, containing item data, when the data is parsed and added to map. 
const fetchCategory = (category) => {

    logger.info(`Fetching category: ${category}`)

        return new Promise( (resolve, reject) => {
        
            fetch(config.categoryUrl + category)
                .then(response => response.json())
                .then(json => { 
                    parse(json)
                        .then(data => {
                            container.addCategory(category, data)

                            resolve(data)
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                .catch(err => {
                    logger.error(`Fetching category: ${category}`, err)
                    reject(err)
                })
        })

}

//Returns promise with items for a given category. 
const getCategory = (category) => {

    return new Promise( (resolve, reject) => {

        if(container.categoryMap.has(category)) {

            resolve(container.categoryMap.get(category))

        } else {

            fetchCategory(category)
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        }
    })
}

//Gets manufacturer data from fetchManufactuer and adds it to manufacturerMap. 
const addManufacturerData = (manufacturer) => {

    return new Promise((resolve, reject) => {

        if(!container.manufacturerMap.has(manufacturer)){

            fetchManufacturer(manufacturer)
                .then(data => {
                    container.addManufacturer(manufacturer, data.json)
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })

        } else {
            resolve()
        }
    })

}

/*For parsing data, return array of items that contain id, name, manufacturer, color, price and availability.  
Takes an array consisting of item data as parameter. */
const parse = (data) => {

    return new Promise( (resolve, reject) => {

        //Get all the different manufacturers that have no data in the container module. 
        let manufacturers = []
        let promises = []

        for(i = 0; i < data.length; i++) {
            
            const item = data[i]
            const manufacturer = item.manufacturer

            if(!manufacturers.includes(manufacturer)){
                manufacturers.push(manufacturer)
                promises.push(addManufacturerData(manufacturer))
            }
        }

        //When all manufacturers are obtained, parse data. 
        Promise.all(promises)
            .then(values => {
                
                for(i = 0; i < data.length; i++) {
        
                    const item = data[i]
            
                    //Checks if given item is in stock. 
                    const instock = container.manufacturerMap.get(item.manufacturer).get(item.id)
            
                    data[i].availability = instock
                }

                resolve(data)

            })
            .catch(err => {
                reject(err)
            })

    })

}

module.exports = {
    fetchManufacturer, 
    fetchCategory, 
    getCategory,
    manufacturerEtags
}