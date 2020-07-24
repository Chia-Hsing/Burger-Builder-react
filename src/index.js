import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import './index.css'
import App from './App'
import burgerBuilderReducer from './store/reducer/burgerBuilder'
import orderReducer from './store/reducer/order'
import authReducer from './store/reducer/auth'

const composeEnhancers =
    process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose

const rootReducer = combineReducers({
    order: orderReducer,
    burgerBuilder: burgerBuilderReducer,
    auth: authReducer,
})

//* redux middleware
/* const logger = (store) => {
    return (next) => {
        return (action) => {
            console.log('middleware', action)
            const result = next(action)
            console.log('middleware', store.getState())
            return result
        }
    }
} */

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
