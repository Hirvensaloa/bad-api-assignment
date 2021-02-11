import React, {useEffect, useState} from 'react'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress'
import Alert from '@material-ui/lab/Alert'

import InfiniteList from './infiniteList'

import './../css/category.css'

//Component for displaying items of certain category. Takes category name as a parameter. 
const Category = ({name}) => {

    const [items, setItems] = useState([])

    const [errorMsg, setErrorMsg] = useState('')

    //Attempts to get data from url and set items to data if succesful. 
    useEffect(() => {

        console.log('Fetching data from: /' + name)
    
        axios.get(`/categories/${name}`)
            .then(response => {
                console.log('Succesfully fetched data from: /' + name)
                setItems(response.data)
                setErrorMsg('')
            })
            .catch(error => {
                console.log(error)
                if(typeof(error.response) !== 'undefined' && error.response.status === 503) //Server responds with 503, if it could not reach the APIs or parsing data threw error. 
                    setErrorMsg(error.response.data)
                else
                    setErrorMsg('Failed to get data from: /' + name)
            })  

    }, [name])

    //Returns list of items to render or error/loader depending on the situation.  
    const getList = () => {

        //If there are error messages, render error. Otherwise items (if found) or loader.  
        if(errorMsg !== '') {
            return (
            <Alert className='error' severity='error'>
                {errorMsg + ' - try to refresh the page!'}
            </Alert>
            )
        } else if (items.length !== 0){ 
            return <InfiniteList elements={items} />
        } else { 
            return(
            <LinearProgress className='loader' /> 
        )}
    }

    return(
        <div className='category'>
            {getList()}
        </div>
    )
}

export default Category