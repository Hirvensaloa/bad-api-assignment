import React from 'react'
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom'
import './App.css'

import Category from './components/category'

function App() {

  //All the possible categories are listed here. To add a new category, simply add it here. 
  const categories = ['beanies', 'facemasks', 'gloves']

  return (
      <Router>

        <div className='menu'>
          {
          categories.map(category => {
            return <Link key={category} to={'/' + category}>{category}</Link> //Create link to each categorys own "page". 
          })}
        </div>

        <Switch>
          {
          categories.map(category => { //Map categories to routes. 
            return (
            <Route path={'/' + category}>
              <Category name={category}/>
            </Route>)
          })}
        </Switch>
        
      </Router>
  );
}

export default App;
