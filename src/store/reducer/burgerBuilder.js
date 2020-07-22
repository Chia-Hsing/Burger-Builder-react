import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'


const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false 
}

const INGREDIENT_PRICES = {  // Defining the price of every ingredients.
    meat: 1.3,
    cheese: 0.6,
    bacon: 0.9,
    salad: 1
}

const addIngredient = (state, action) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient)
    const updateState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject(state, updateState)
}

const removeIngredient = (state, action) => {
    const updatedIngredient1 = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
    const updatedIngredients1 = updateObject(state.ingredients, updatedIngredient1)
    const updateState1 = {
        ingredients: updatedIngredients1,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject(state, updateState1)
}

const setIngredient = (state, action) => {
    return updateObject(state, {
        ingredients: {
        salad: action.ingredients.salad,
        cheese: action.ingredients.cheese,
        bacon: action.ingredients.meat,
        meat: action.ingredients.meat
    },
    error: false,
    totalPrice: 4,
    building: false
})}

const fetchIngredientFailed = (state, action) => {
    return updateObject(state, { error: true })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT : return addIngredient(state, action)
        case actionTypes.REMOVE_INGREDIENT : return removeIngredient(state, action)         
        case actionTypes.SET_INGREDIENT : return setIngredient(state, action)
        case actionTypes.FETCH_INGREDIENTS_FAILED : return fetchIngredientFailed(state, action)        
    } return state
} 

export default reducer
