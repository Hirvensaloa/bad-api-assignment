import React from 'react'

import './../css/category.css'

//Component for displaying a single item. 
const Item = ({name, manufacturer, available}) => {

    //Checks if item is in stock. Return corresponding circle colour. 
    const circleColour = () => {
        let circle
    
        switch(available) {
            case 'instock': 
                circle = 'green-circle'
                break;
            case 'less than 10':
                circle = 'yellow-circle'
                break;
            default:
                circle = 'red-circle'
        }

        return circle
    } 

    return(
        <div className='infinite-item'>

            <div className='infinite-item--info'>
                <div> <b>Name: </b>{name.toLowerCase()} </div>
                <div> <b>Manufacturer: </b>{manufacturer} </div>
            </div>

            <div className='infinite-item--stock'>
                {available}
                <div className={circleColour()}></div>
            </div>
            
        </div>
    )
}

export default Item