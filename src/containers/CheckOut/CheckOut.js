import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary'
import ContactData from '../CheckOut/ContactData/ContactData'

class CheckOut extends Component {
    /* state = {
        ingredients: null,
        totalPrice: 0
    }
    

    //*get the information from the query search part of url.
    componentWillMount () {
        const query = new URLSearchParams(this.props.location.search)
        const ingredients = {}
        let price = 0
        for ( let param of query.entries() ) {  
            // it will return arrays. [bacon, 1], [salad, 2] and so on.....
            if ( param[0] === 'price') {
                price = param[1]
            } else {
                ingredients[param[0]] = +param[1] 
                // the symbol + make the param[1] exact the number.
            }
        }
        this.setState({ ingredients: ingredients, totalPrice: price })
   } */

    checkoutCanceledHandler = () => {
        this.props.history.goBack()
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data')
    }

    render() {
        //* avoid directly entering the path on url.
        let summary = <Redirect to="/" />

        if (this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckOutSummary
                        ingredients={this.props.ings}
                        checkoutCanceled={this.checkoutCanceledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}

                        /* render = { props => (
                        <ContactData 
                        ingredients = { this.state.ingredients } 
                        price = { this.state.totalPrice }
                        {...props}
                        />
                        ) 
                    } */
                    />
                </div>
            )
        }

        return summary
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased,
    }
}

export default connect(mapStateToProps)(CheckOut)
