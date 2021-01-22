import React from 'react'
import axios from 'axios'

//Component for displaying items of certain category. Takes category name as a parameter. 
const Category = ({name}) => {

    const url = 'https://bad-api-assignment.reaktor.com/' + name

    //Get items for given category.
    const contents = axios.get(url)
                        .then(response => {
                            return response.data
                        })

    

    return(
        <div className='category'>
            {contents}
        </div>
    )
}

export default Category