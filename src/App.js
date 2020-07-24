import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './components/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions/index'
import asyncComponent from './hoc/asyncComponent/asyncComponent'

const asyncCheckout = asyncComponent(() => {
    return import('./containers/CheckOut/CheckOut')
})

const asyncOrder = asyncComponent(() => {
    return import('./containers/Orders/Orders')
})

const asyncAuth = asyncComponent(() => {
    return import('./containers/Auth/Auth')
})

//! the methods above are lazy loading.

class App extends Component {
    componentDidMount() {
        this.props.onTryAutoSignup()
    }

    render() {
        let routers = (
            <Switch>
                <Route path="/auth" component={asyncAuth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        )

        if (this.props.isAuthenticated) {
            routers = (
                <Switch>
                    <Route path="/checkout" component={asyncCheckout} />
                    <Route path="/orders" component={asyncOrder} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/auth" component={asyncAuth} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            )
        }

        return (
            <div>
                <Layout>{routers}</Layout>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
