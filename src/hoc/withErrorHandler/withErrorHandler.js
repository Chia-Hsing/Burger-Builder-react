import React, { Component } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../../hoc/Aux'

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null,
        }

        componentDidMount() {
            this.reqInterceptor = axios.interceptors.request.use((req) => {
                // every time we sent request to the back-end, the interceptor will set the property error in state to null.
                this.setState({ error: null })
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(
                (res) => res,
                (error) => {
                    // every time we receive response from the back-end, the interceptor will set the property error in state to err. We only care about the err.
                    this.setState({ error: error })
                }
            )
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor)
            // Because this withErrorHandler hoc component is going to wrap around any child component itself. So every time when we export that child component, withErrorHandler will also be called and the interceptors will be set repeatedly. In order to prevent leaking memory the led by set the interceptor over and over again. We have to remove it once we leave the component.
            axios.interceptors.response.eject(this.resInterceptor)
            // in order to eject the interceptor, we have to pass the reference of the interceptor which we set in the beginning.
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null })
        }

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            )
        }
    }
}

export default withErrorHandler
