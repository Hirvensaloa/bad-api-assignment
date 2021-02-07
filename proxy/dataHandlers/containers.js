//This file contains containers for caching manufacturers and items per category.

const logger = require('./../utils/logger')

//Maps categories to items.
let categoryMap = new Map()

//Manufactures mapped to map that contains item id as key and item availability (boolean) as value. 
let manufacturerMap = new Map( new Map() )

//Adds manufactures with given data to manufacturerMap. 
const addManufacturer = (manufacturer, data) => {

    let map = new Map()

    logger.info(`Adding manufacturer: ${manufacturer} to map with array size of: ${data.length}`)

    for(i = 0; i < data.length; i++) {

        //If DATAPAYLOAD contains word OUTOF, we can determine that item is OUT-OF-STOCK. 
        const available = data[i].DATAPAYLOAD.search('OUTOF') === -1 ? true : false
        map.set(data[i].id.toLowerCase(), available)
    }

    manufacturerMap.set(manufacturer, map)
}

//Adds given category and data to map. 
const addCategory = (category, data) => {

    categoryMap.set(category, data)

}

module.exports = {
    addManufacturer, 
    addCategory, 
    manufacturerMap, 
    categoryMap
}