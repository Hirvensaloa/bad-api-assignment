import React from 'react'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'

//Header takes in list of categories and makes a list of Buttons that take user to corresponding category page. 
const Header = ({categories}) => {
    return(
        <div className='header'>
          {categories.map((category, index) => { //Create link to each categorys own "page". 
            return <Link key={index} to={'/' + category}>
                      {<Button variant='outlined' size='large' >{category}</Button>}
                   </Link> 
          })}
        </div>
    )
}

export default Header