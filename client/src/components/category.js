import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Item from './item'

//Component for displaying items of certain category. Takes category name as a parameter. 
const Category = ({name}) => {

    const [items, setItems] = useState([])

    //Attempts to get data from url and set items to data if succesful. 
    useEffect(() => {
        axios.get(name)
            .then(response => {                
                console.log('succesfully fetched data from: /' + name)
                console.log(response)
                setItems(response.data)
        })
            .catch(error => {
                setItems('Failed to get data from: /' + name)
            })
    }, [name])

    return(
        <div className='category'>
            {items.map(item => {
                return <Item key={item.id} name={item.name} manufacturer={item.manufacturer} />
            })}
        </div>
    )
}

export default Category