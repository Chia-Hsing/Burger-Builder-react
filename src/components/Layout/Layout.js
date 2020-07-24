import React, { Component } from 'react'
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux'
import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'

class Layout extends Component {
    state = {
        showSideDrawer: false,
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false })
    }

    drawerToggleHandler = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer } // when the value of state is going to use the previous state,  use the function with argument prevState to avoid problems.
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.drawerToggleHandler} isAuth={this.props.isAuthenticated} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                    isAuth={this.props.isAuthenticated}
                />
                <main className={classes.content}>{this.props.children}</main>
            </Aux>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
    }
}

export default connect(mapStateToProps)(Layout)
