import React, { Component } from 'react';
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { reduxSelectOpponent } from '../../actions/app'
import { email } from '../../helpers/auth'

import Container from '../../components/layout/Container'

import PageHeader from '../../components/controls/PageHeader'

class InWaiting extends Component {
    state = {}
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }
    _handleSession = (e, email) => {
        e.preventDefault()
        this.props.selectOpponent(email)
        this.props.history.push('/selections/online')
    }
    render() {
        const opponentGmail = (session) => {
            if (session.host === email()) {
                return session.guest
            } else if (session.guest === email()) {
                return session.host
            }
            return null
        }

        return (
            <Container category="setting-wrp">
                <PageHeader/>
                <form className="form-horizontal" method="" action="">
                    <div className="content">
                        <ul>
                        {
                            this.props.pendingSessions.map((session) => {
                                return (
                                    opponentGmail(session) != null &&
                                    <li key={opponentGmail(session)}><a href="#" onClick={(e) => this._handleSession(e, opponentGmail(session))}>{opponentGmail(session)}</a></li>
                                )
                            })
                        }
                        </ul>
                    </div>
                </form>
            </Container>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pendingSessions: state.pendingSessions
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        selectOpponent: (email) => {
            dispatch(reduxSelectOpponent(email))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InWaiting)