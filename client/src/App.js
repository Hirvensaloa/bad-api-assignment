import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import '@fontsource/roboto/300.css'

import './App.css'

import Category from './components/category'
import Header from './components/header'

function App() {

  //All the possible categories are listed here. To add a new category, simply add it here. 
  const categories = ['beanies', 'facemasks', 'gloves']

  return (
    <div className='App'>
      <Router>
        <Header categories={categories} />
        <Switch>
          {
          categories.map((category, index) => { //Map categories to routes. 
            return (
            <Route key={index} path={'/' + category}> 
              <Category name={category}/>
            </Route>)
          })}
        </Switch>
        
      </Router>
    </div>
  );
}

export default App;
