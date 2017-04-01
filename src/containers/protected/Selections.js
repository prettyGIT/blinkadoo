import React, { Component } from 'react';
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import _ from 'lodash'
import { email, uid } from '../../helpers/auth'
import Firebase from '../../helpers/Firebase'
import { BLINK_NUMBER } from '../../config/constants'

import Container from '../../components/layout/Container'

import PageHeader from '../../components/controls/PageHeader'

import MaterialButton from '../../components/controls/MaterialButton'

import Symbol from '../../components/controls/Symbol'

class Selections extends Component {
    state = {
        myDigit: 0,
        guessed: false,
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentDidMount() {
        let opponentEmail = this.props.opponentEmail
        if (!opponentEmail) {
            this.props.history.replace('/welcome');
        } else {
            let index = _.findIndex(this.props.pendingSessions, (session) => {
                return (session.host === email() && session.guest === opponentEmail) || (session.host === opponentEmail && session.guest === email())
            })

            if (index !== -1) {
                var host = true
                let session = this.props.pendingSessions[index]
                if (session.guest === email()) host = false
                this.setState({
                    host: host,
                    myDigit: this.getRandomInt(0, 1),
                    currSessionKey: session.key
                })
                Firebase.subscribeToEvent(`pendingSessions/${session.key}/stats`, 'value', (ref, data) => {
                    if (!data) return
                    var obj = data
                    obj.turn = data.turn || 1
                    this.setState({ currentTurn: obj.turn })
                    if (obj.turn <= BLINK_NUMBER) {
                        let turnStats = obj.turnStats
                        if (!turnStats) return
                        if (turnStats.host_guess != undefined && turnStats.guest_guess != undefined) {
                            if (turnStats.host == turnStats.guest_guess) {
                                obj.cumGuest = data.cumGuest || 0
                                obj.cumGuest++
                            }

                            if (turnStats.guest == turnStats.host_guess) {
                                obj.cumHost = data.cumHost || 0
                                obj.cumHost++
                            }

                            obj.turn = obj.turn + 1
                            obj.lastStats = turnStats
                            obj.turnStats = null

                            Firebase.set(`pendingSessions/${session.key}/stats`, obj, () => {
                                this.props.history.replace(`/feedback/${this.props.match.params.mode}/${session.key}`)
                            })
                        }
                    }
                })
            }
        }
    }
    
    componentWillUnmount() {
        if (this.state.currSessionKey) {
            Firebase.off(`pendingSessions/${this.state.currSessionKey}/stats`)
        }
    }
    
    _handleSame = (e) => {
        e.preventDefault();
        if (this.state.myDigit == 0) {
            this.playTurn(0)
        } else {
            this.playTurn(1)
        }
    }

    _handleDifferent = (e) => {
        e.preventDefault();
        if (this.state.myDigit == 0) {
            this.playTurn(1)
        } else {
            this.playTurn(0)
        }
    }

    _handleBot = (e) => {
        e.preventDefault();
        this.playTurn(this.getRandomInt(0,1))
    }

    getRandomInt(min, max) {
        if (Math.random() < 0.5) return 0
        return 1
    }

    playTurn(digit) {
        let key = this.state.host ? 'host' : 'guest'
        this.setState({ guessed: true })

        let mode = this.props.match.params.mode
        var data = {
            [key]: this.state.myDigit,
            [key + '_guess']: digit
        }

        if (mode === 'alone') {
            data.guest = this.getRandomInt(0, 1)
            data.guest_guess = this.getRandomInt(0, 1)
        }

        Firebase.update(`pendingSessions/${this.state.currSessionKey}/stats/turnStats`, data)
    }

    render() {
        return (
            <Container category="setting-wrp">
                <PageHeader/>
                <form className="form-horizontal" method="" action="">
                    <div className="content">
                        <table width="100%" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}><h2>You have:</h2></td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}>
                                        <Symbol digit={this.state.myDigit}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}><h2>They have:</h2></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'center'}}>
                                        <Symbol digit={this.state.myDigit == 0 ? 0 : 1}/>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <Symbol digit={this.state.myDigit == 0 ? 1 : 0}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>
                                        <MaterialButton title="Same" info block disabled={this.state.guessed}
                                            handleClick={this._handleSame}/>
                                    </td>
                                    <td style={{textAlign: 'right'}}>
                                        <MaterialButton title="Different" info disabled={this.state.guessed}
                                            handleClick={this._handleDifferent}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}>
                                        <MaterialButton title="Computer Selects" success disabled={this.state.guessed}
                                            handleClick={this._handleBot}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}> Blink Number <b>{this.state.currentTurn || 1} of {BLINK_NUMBER}</b>
                                        <div style={{textAlign: 'center'}}><small>(do not forget the period at the end.)</small></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{textAlign: 'center'}}> Waiting on: <b>BOTH</b></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </Container>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        pendingSessions: state.pendingSessions,
        opponentEmail: state.opponentEmail,
        gameStarted: state.gameStarted,
        gameOption: state.gameOption
    }
}

export default connect(mapStateToProps)(Selections);