import React, { Component } from 'react'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import _ from 'lodash';
import Login from './Login'
import Welcome from './protected/Welcome';
import InWaiting from './protected/InWaiting';
import Selections from './protected/Selections';
import Feedback from './protected/Feedback';
import Results from './protected/Results';
import { firebaseAuth } from '../config/constants'
import Firebase from '../helpers/Firebase'
import {
    reduxAddPendingSession,
    reduxRemoveSession
} from '../actions/app'

function PrivateRoute ({ component: Component, authed, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props}/>
                : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}
        />
    )
}

function PublicRoute ({ component: Component, authed, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props}/>
                : <Redirect to='/welcome'/>}
        />
    )
}

class App extends Component {
    state = {
        authed: false,
        loading: true,
    }
    componentDidMount() {
        
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authed: true,
                    loading: false,
                })

                Firebase.subscribeToQuery1('pendingSessions', 'host', user.email, 'child_added', (ref, data, key) => {
                    if (!data.archive) {
                        this.props.addPendingSession(data);
                    }
                })

                Firebase.subscribeToQuery1('pendingSessions', 'host', user.email, 'child_changed', (ref, data, key) => {
                    if (data.archive) {
                        let index = _.findIndex(this.props.pendingSessions, (session) => {
                            return session.host === user.email && session.guest === data.guest
                        })

                        if (index !== -1) {
                            this.props.removeSession(index);
                        }
                    }
                })

                Firebase.subscribeToQuery1('pendingSessions', 'guest', user.email, 'child_added', (ref, data, key) => {
                    if (!data.archive) {
                        this.props.addPendingSession(data);
                    }
                })

                Firebase.subscribeToQuery1('pendingSessions', 'guest', user.email, 'child_changed', (ref, data, key) => {
                    if (data.archive) {
                        let index = _.findIndex(this.props.pendingSessions, (session) => {
                            return session.guest === user.email && session.host === data.host
                        })

                        if (index !== -1) {
                            this.props.removeSession(index);
                        }
                    }
                })

            } else {
                this.setState({
                    loading: false,
                })
            }
        })
    }
    componentWillUnmount() {
        this.removeListener()
        Firebase.off('pendingSessions');
    }
    render() {
        return this.state.loading === true ? <h1>Loading...</h1> : (
            <BrowserRouter>
                <Switch>
                    <PublicRoute authed={this.state.authed} path='/' exact component={Login}/>
                    <PublicRoute authed={this.state.authed} path='/login' component={Login}/>
                    <PrivateRoute authed={this.state.authed} path='/welcome' component={Welcome}/>
                    <PrivateRoute authed={this.state.authed} path='/inwaiting' component={InWaiting}/>
                    <PrivateRoute authed={this.state.authed} path='/selections/:mode' component={Selections}/>
                    <PrivateRoute authed={this.state.authed} path='/feedback/:mode/:sessionKey' component={Feedback}/>
                    <PrivateRoute authed={this.state.authed} path='/results/:mode/:sessionKey' component={Results}/>
                    <Route render={() => <h3>No Match</h3>}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return { 
        pendingSessions: state.pendingSessions
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addPendingSession: (pendingSession) => {
            dispatch(reduxAddPendingSession(pendingSession))
        },

        removeSession: (index) => {
            dispatch(reduxRemoveSession(index))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)