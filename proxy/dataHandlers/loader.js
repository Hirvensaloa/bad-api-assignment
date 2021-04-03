//This file contains functions for loading data from the API. 

const fetch = require('node-fetch')

const logger = require('./../utils/logger')
const container = require('./containers')
const config = require('./../utils/config')

//Maps for storing Etags to check data freshness. Manufacturer as key and Etag as value. 
let manufacturerEtags = new Map()

//Fetches data for given manufacturer. Returns a promise that if resolved contains APIs response data as json and etag.  
const fetchManufacturer = async (manufacturer) => {

    console.log('Fetching manufacturer: ' + manufacturer)

    try {
        const response = await fetch(config.manufacturerUrl + manufacturer)

        const json = await response.json()

        //If response is not an array, send new request. 
        if(!Array.isArray(json.response)) {
            
            try {
                const data = await fetchManufacturer(manufacturer)
                
                return data
            }
            catch(err) {
                logger.error(`Fetching manufacturer: ${manufacturer}`, err)
            }

        } else {  //If succesful respond with data as json and etag.
            const etag = response.headers.get('etag')
            manufacturerEtags.set(manufacturer, etag) //Store etag to map.

            return(
                {
                    etag: etag, 
                    json: json.response
                })
        }
    }
    catch(err) {
        logger.error(`Fetching manufacturer ${manufacturer}`, err)
    }        
}

//Fetches items for a given category. Return a promise, containing item data, when the data is parsed and added to map. 
const fetchCategory = async (category) => {

    logger.info(`Fetching category: ${category}`)

    try {
        const response = await fetch(config.categoryUrl + category)
        const json = await response.json()

        const data = await parse(json)
        
        container.addCategory(category, data)

        return data 
    } catch(err) {
        logger.error(`Fetching category: ${category}`, err)
    }

}

//Returns promise with items for a given category. 
const getCategory = async (category) => {

    if(container.categoryMap.has(category)) {

        return container.categoryMap.get(category)

    } else {

        try {
            const data = await fetchCategory(category)

            return data
        } catch (err) {
            logger.error("Error while fetching category", err)
        }
    }
}

//Gets manufacturer data from fetchManufactuer and adds it to manufacturerMap. 
const addManufacturerData = async (manufacturer) => {

        if(!container.manufacturerMap.has(manufacturer)){

            try {
                const data = await fetchManufacturer(manufacturer)
            
                container.addManufacturer(manufacturer, data.json)
            } catch(err) {
                logger.error("Error while adding manufacturer data", err)
            }

        } 
}

/*For parsing data, return array of items that contain id, name, manufacturer, color, price and availability.  
Takes an array consisting of item data as parameter. */
const parse = async (data) => {

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
        await Promise.all(promises)
        
        for(i = 0; i < data.length; i++) {
    
            const item = data[i]
    
            //Checks if given item is in stock. 
            const instock = container.manufacturerMap.get(item.manufacturer).get(item.id)
    
            data[i].availability = instock
        }

        return data
        
}

module.exports = {
    fetchManufacturer, 
    fetchCategory, 
    getCategory,
    manufacturerEtags
}