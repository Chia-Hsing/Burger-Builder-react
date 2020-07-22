import React, { Component } from 'react'
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummarry/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler'
import { connect } from 'react-redux'
import * as actions from '../../store/actions/index'


export class BurgerBuilder extends Component {
    
    state = {
        purchasing: false,
    }

    componentDidMount () {
        this.props.onInitIngredients() // get the ingredients from database.
    }

    // This method will determine if the order bottom is purchasable 
    updatePurchaseState = (ingredients) => {  
        const sum = Object.keys(ingredients)  // Making a new arry which includes all the keys of the ingredients Object.
        .map( igKey => ingredients[igKey] )  // Get all value in that array. 
        .reduce(( sum, el ) => {  // Calculating the amount of all items in that array. 
            return sum + el
        }, 0) 
        return  sum > 0   // determine purchasable is true or false. 
    }

    /* // add ingredient to the burger.
    addIngredientHandler = ( type ) => {  
        const oldCount = this.state.ingredients[type]  // the amount of the designated item.
        let updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients  // make a new object.
        }
        updatedIngredients[type] = updatedCount  // updating the number of each ingredient

        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition  // updating the total price.

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients) // must pass the updated Object to make it work properly.
    }

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) {  
            return
        }
        let updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount  // updating the number of each ingredient

        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction  // updating the total price.

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)  // must pass the updated Object to make it work properly.
    } */

    purchaseHandler = () => {
            if (this.props.isAuthenticated) {
                this.setState({purchasing: true}) // press the order bottom.
            } else {
                this.props.onSetAuthRedirectPath('/checkout')
                this.props.history.push('/auth')
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false}) // press the cancel bottom at order summary.

    }

    // Once we press the continue button, the ingredients will be encoded to the search part of url.
    // press the continue bottom at order summary.
    purchaseContinueHandler = () => {  

        // const queryParams = []
        // for (let i in this.props.ings) {
        //     queryParams.push( encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]) )
        // }
        // queryParams.push( 'price=' + this.props.price )
        // const queryString = queryParams.join('&')
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // })
        this.props.onInitPurchase()
        this.props.history.push('/checkout')
    }

    render () {

        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {  // extract all the keys in the new ingredients object.
            disabledInfo[key] = disabledInfo[key] <= 0  // determine every item is true or false in that object.[salad: true, meat: false, ....and so on]
        }

        let orderSummary = null
        let burger = this.props.error ? <p>Something went wrong!</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = { this.props.ings }/>
                    <BuildControls 
                    ingredientAdded = { this.props.onIngredientAdded }
                    ingredientRemoved = { this.props.onIngredientRemoved }
                    disabled = { disabledInfo }
                    price = { this.props.price }
                    purchasable = { this.updatePurchaseState(this.props.ings) }
                    ordered = { this.purchaseHandler }
                    isAuth = { this.props.isAuthenticated }
                    />
                </Aux>    
            )
            
            orderSummary = <OrderSummary 
            ingredients = { this.props.ings }
            purchaseCancelled = { this.purchaseCancelHandler }
            purchaseContinued = { this.purchaseContinueHandler }
            price = { this.props.price }
            />
            
            if(this.state.loading) {
                orderSummary = <Spinner />
            }
        }


        return (
            <Aux>
                <div>
                    <Modal 
                    show = { this.state.purchasing }
                    modalClosed = { this.purchaseCancelHandler}
                    >
                    { orderSummary }
                    </Modal>
                    { burger }
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !==null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorhandler(BurgerBuilder, axios))
