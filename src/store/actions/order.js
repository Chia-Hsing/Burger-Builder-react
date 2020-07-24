import * as actionTypes from './actionTypes'
import axios from '../../axios-orders.js'

// action creator
export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData,
    }
}

// action creator
export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error,
    }
}

// action creator
export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START,
    }
}

// middleware
export const purchaseBurger = (orderData, token) => {
    return (dispatch) => {
        dispatch(purchaseBurgerStart())
        axios
            .post('/orders.json?auth=' + token, orderData)
            .then((response) => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            })
            .catch((error) => dispatch(purchaseBurgerFail(error)))
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT,
    }
}

export const fetchOrderSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDER_SUCCESS,
        orders: orders,
    }
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDER_FAIL,
        error: error,
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDER_START,
    }
}

export const fetchOrders = (token, userId) => {
    return (dispatch) => {
        dispatch(fetchOrderStart())
        const queryParam = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'
        axios
            .get('/orders.json' + queryParam)
            .then((res) => {
                const fetchedOrders = []
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key,
                    })
                }
                dispatch(fetchOrderSuccess(fetchedOrders))
            })
            .catch((err) => {
                dispatch(fetchOrderFail(err))
            })
    }
}
