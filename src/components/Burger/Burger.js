import React from 'react'
import classes from './Burger.module.css'
import BurgerIngredients from '../Burger/BurgerIngredients/BurgerIngredients'
import { withRouter } from 'react-router-dom'

const burger =  props => { 

    let transformIngredients = Object.keys(props.ingredients) // [meat, cheese, bacon, salad ...]
    .map( igKey => {
        return [...Array(props.ingredients[igKey])]
        .map((_, i) => { // _ means I don't care about the first argument of the map method.
           return <BurgerIngredients key = { igKey + i } type = { igKey }/> // return the 'component BurgerIngredients' which key is the key of the 'ingredients Object' plus the 'index of the new array' I mentioned above.
        }) 
    })
    .reduce((arr, el) => {
        return arr.concat(el)
    }, [])

    if ( transformIngredients.length === 0 ) {
        transformIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className = { classes.Burger }>
            <BurgerIngredients type = 'bread-top'/>
            { transformIngredients }
            <BurgerIngredients type = 'bread-bottom'/>
        </div>
    )
} 

export default withRouter(burger)

