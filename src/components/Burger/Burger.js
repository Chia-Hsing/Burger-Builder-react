import React from 'react'
import classes from './Burger.module.css'
import BurgerIngredients from '../Burger/BurgerIngredients/BurgerIngredients'
import { withRouter } from 'react-router-dom'
//! withRouter helps us to get access to object’s properties and the closest <Route>'s match.
//! withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.

const burger = (props) => {
    let transformIngredients = Object.keys(props.ingredients) // [meat, cheese, bacon, salad ...]
        .map((igKey) => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                // _ means I don't care about the first argument of the map method.
                // just need the index of that array
                // [0, 1, 2], [0]...
                return <BurgerIngredients key={igKey + i} type={igKey} />
                // return the 'component BurgerIngredients' with the key of the 'ingredients Object' plus the 'index of the new array'.
                // key=cheese0 type=cheese ...
                // return how many <BurgerIngredients /> by the amount of the array's item(index)'s
            })
        })

        .reduce((arr, el) => {
            return arr.concat(el)
        }, [])

    // transformIngredients is a array

    if (transformIngredients.length === 0) {
        transformIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
            {transformIngredients}
            <BurgerIngredients type="bread-bottom" />
        </div>
    )
}

export default withRouter(burger)
