import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility'

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                },
                value: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                },
                value: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code',
                },
                value: '',
                validation: {
                    isRequired: true,
                    minlength: 5,
                    maxlength: 5,
                },
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                },
                value: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'E-mail',
                },
                value: '',
                validation: {
                    isRequired: true,
                },
                valid: false,
                touched: false,
            },
            deliverMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'fastest' },
                        { value: 'cheapest', displayValue: 'cheapest' },
                    ],
                },
                value: 'fastest',
                validation: {},
                valid: true,
            },
        },
        formIsValid: false,
    }

    //* press button, order complete
    orderHandler = (event) => {
        event.preventDefault()
        let formData = {}
        // create a new Object
        for (let formElementIdentifier in this.state.orderForm) {
            // [name, street, zipCode ...]
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId,
        }

        this.props.onBurgerOrder(order, this.props.token)
        // post method
    }

    //* While the input changed.
    inputChangedHandler = (event, identifer) => {
        const updatedFormElement = updateObject(this.state.orderForm[identifer], {
            value: event.target.value,
            // what you key in
            valid: checkValidity(event.target.value, this.state.orderForm[identifer].validation),
            // check is the input empty or not.
            touched: true,
            // make the initial input works properly.
        })

        const updatedOrderForm = updateObject(this.state.orderForm, { [identifer]: updatedFormElement })

        let formIsValid = true
        // decide is the order bottom available or not.
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
            // if there is one input empty, formIsValid will be false, so the order bottom will not be available.
        }
        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid })
    }

    render() {
        let formElementArray = []
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key],
            })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementArray.map((formElement) => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        Invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>
                    ORDER
                </Button>
            </form>
        )

        if (this.props.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onBurgerOrder: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))
