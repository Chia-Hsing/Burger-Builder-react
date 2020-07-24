import React, { Component } from 'react'
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummarry/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorhandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'

export class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        // This state provides the control of the modal UI.
    }

    componentDidMount() {
        this.props.onInitIngredients()
        // Get the ingredients from database.
    }

    // *This method will determine whether the order button is purchasable or not.
    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            // Build a new arry which includes all the keys of the ingredients Object.
            .map((igKey) => ingredients[igKey])
            // Get all value in that array.
            .reduce((sum, el) => {
                // Calculate the sum of all items in that array.
                return sum + el
            }, 0)
        return sum > 0
        // return true of false
    }

    //* Add ingredients to burger.
    /* addIngredientHandler = ( type ) => {  
        const oldCount = this.state.ingredients[type]  
        // the amount of the designated item.
        let updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients  
            // build a new object including the ingredient items.
        }
        updatedIngredients[type] = updatedCount  
        // update the number of each ingredient

        const priceAddition = INGREDIENT_PRICES[type]
        // the price of the designated item.
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition  
        // updating the total price.

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients) 
        // Must pass the updated Object to make the order button work properly.
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
        updatedIngredients[type] = updatedCount  
        // updating the number of each ingredient

        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction  
        // updating the total price.

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)  
        // must pass the updated Object to make it work properly.
    } */

    //* By changing the purchasing state to start or end the purchasing process (modal and backdrop).
    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ purchasing: true }) // press the order bottom.
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            // change the authRedirectPath state form / to /checkout
            this.props.history.push('/auth')
        }
    }

    //* When press the cancel bottom at order summary modal.
    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    //* Once press the continue button at order summary.
    purchaseContinueHandler = () => {
        this.props.onInitPurchase()
        this.props.history.push('/checkout')
        /* const queryParams = []
         for (let i in this.props.ings) {
             queryParams.push( encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]) )
         }) ////[ cheese = 1, bacon = 2 ...]
         }
         queryParams.push( 'price=' + this.props.price )
         const queryString = queryParams.join('&')
         //// cheese=1&bacon=2 ...&price=20
         this.props.history.push({
             pathname: '/checkout',
             search: '?' + queryString */
        ////.../checkout?cheese=1&bacon=2 ...&price=20
    }

    render() {
        const disabledInfo = {
            ...this.props.ings,
        }
        for (let key in disabledInfo) {
            // extract all the keys in the new ingredients object.
            disabledInfo[key] = disabledInfo[key] <= 0
            // determine every item is true or false in that object.[salad: true, meat: false, and so on...]
        }

        let orderSummary = null
        let burger = this.props.error ? <p>Something went wrong!</p> : <Spinner />

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        // control is the order button purchasable.
                        ordered={this.purchaseHandler}
                        // control the purchasing process.
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        // {salad: true, meat: false ...}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            )

            orderSummary = (
                //* this component is controlling the order summary modal.
                <OrderSummary
                    ingredients={this.props.ings}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.props.price}
                />
            )

            if (this.state.loading) {
                orderSummary = <Spinner />
            }
        }

        return (
            <Aux>
                <div>
                    <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                        {orderSummary}
                    </Modal>
                    {burger}
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorhandler(BurgerBuilder, axios))
