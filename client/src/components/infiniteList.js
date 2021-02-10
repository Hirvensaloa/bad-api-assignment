import React, {useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import LinearProgress from '@material-ui/core/LinearProgress'

import Item from './item'

/*List for handling large set of items. Enables the UI to work fast because 
only a small portion of items are rendered at a time. */
const InfiniteList = ({elements}) => {

    /*Determines how many items we take initially from the elements.
    Maximum of 20 items are taken. */ 
    const sliceSize = elements.length > 20 ? 20 : elements.length

    const [items, setItems] = useState(elements.slice(0, sliceSize))

    //When user scrolls down fetch more data. 
    const fetchMoreData = () => {
        const start = items.length
        const end = start + 20

        setItems([...items, ...elements.slice(start, end)])
    }

    return(
        <InfiniteScroll
            className='infinite'
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={true}
            loader={<LinearProgress/>}
        >
            {items.map((item, index) => {
                return(
                    <div key={index}>
                        <Item key={item.id} name={item.name} manufacturer={item.manufacturer} available={item.availability}/>
                    </div>
                )
            })}
        </InfiniteScroll>
    )
}

export default InfiniteList