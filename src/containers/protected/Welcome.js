import React, { Component } from 'react'
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import { reduxSelectOpponent } from '../../actions/app'
import { email, uid, logout } from '../../helpers/auth'
import { testEmail } from '../../helpers/helpers'
import Firebase from '../../helpers/Firebase'

import Container from '../../components/layout/Container'

import PageHeader from '../../components/controls/PageHeader'

import PageFooter from '../../components/controls/PageFooter'

import MaterialInput from '../../components/controls/MaterialInput'

import MaterialButton from '../../components/controls/MaterialButton'
//smtp.sendgrid.net
// Ports	
// 25, 587	(for unencrypted/TLS connections)
// 465	(for SSL connections)
// Username	apikey
//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
class Welcome extends Component {
    state = {}
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }
    
    componentWillMount() {
        
    }
    
    componentDidMount() {
        window.$material.init()
    }
    
    _handleInputChange = (value) => {
        this.setState({ theirGmail: value })
    }

    _handleInWaiting = (e) => {
        e.preventDefault()
        this.props.history.push('/inwaiting')
    }

    _handlePlay = (e) => {
        e.preventDefault()
        const theirGmail = this.state.theirGmail
        if (!theirGmail) return
        if (email() === theirGmail) return
        if (!testEmail(theirGmail)) return
        let index = _.findIndex(this.props.pendingSessions, (session) => {
            return (session.host === email() && session.guest === theirGmail) || (session.host === theirGmail && session.guest === email())
        })

        if (index === -1) {
            Firebase.push('pendingSessions', {
                host: email(),
                guest: theirGmail
            }, (err) => {
                this.props.selectOpponent(theirGmail)
                this.props.history.push('/selections/online')
            })
        }
    }

    _handlePlayWithCPU = (e) => {
        e.preventDefault()

        let index = _.findIndex(this.props.pendingSessions, (session) => {
            return session.host === email() && session.guest === 'bot'
        })

        if (index === -1) {
            Firebase.push('pendingSessions', {
                host: email(),
                guest: 'bot'
            }, (err) => {
                this.props.selectOpponent('bot')
                this.props.history.push('/selections/alone')
            })
        }
    }

    _handleSettings = (e) => {
        e.preventDefault()
    }
    render() {
        return (
            <Container category="splashwrp">
                <PageHeader/>
                <form className="form" method="" action="">
                    <div className="content splash-wrp">
                        <MaterialInput materialIcon="email" placeholder="Enter Their Gmail Address"
                            handleChange={this._handleInputChange}/>
                        <MaterialButton materialIcon="leak_add" title="In Waiting" danger full
                            handleClick={this._handleInWaiting} disabled={this.props.pendingSessions.length === 0}/>
                        <MaterialButton materialIcon="play_arrow" title="Play" success full
                            handleClick={this._handlePlay}/>
                        <MaterialButton materialIcon="computer" title="Play with Computer" info full
                            handleClick={this._handlePlayWithCPU}/>
                        <MaterialButton materialIcon="settings" title="Settings" default full
                            handleClick={this._handleSettings}/>
                    </div>
                </form>
                <PageFooter/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)