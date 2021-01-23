import React from 'react'

//Component for displaying a single item. 
const Item = ({name, manufacturer}) => {
    return(
        <div className='item'>
            {name}
            {manufacturer}
        </div>
    )
}

export default Item