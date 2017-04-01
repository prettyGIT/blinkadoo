import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare'
import Firebase from '../../helpers/Firebase'
import { email } from '../../helpers/auth'
import { BLINK_NUMBER } from '../../config/constants'

import Container from '../../components/layout/Container'

import PageHeader from '../../components/controls/PageHeader'

import MaterialButton from '../../components/controls/MaterialButton'

export default class Feedback extends Component {
    state = {
        stats: {}
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }
    
    componentWillMount() {
        let key = this.props.match.params.sessionKey
        Firebase.snapshotOf(`pendingSessions/${key}`, (ref, data) => {
            var stats = {}
            stats.currTurn = data.stats.turn - 1
            stats.youHave = data.host === email() ? data.stats.lastStats.host : data.stats.lastStats.guest
            stats.theyHave = data.host === email() ? data.stats.lastStats.guest : data.stats.lastStats.host
            let youGuess = data.host === email() ? data.stats.lastStats.host_guess : data.stats.lastStats.guest_guess
            let theyGuess = data.host === email() ? data.stats.lastStats.guest_guess : data.stats.lastStats.host_guess
            stats.youCorrect = stats.theyHave === youGuess
            stats.theyCorrect = stats.youHave === theyGuess
            stats.youCum = data.host === email() ? data.stats.cumHost : data.stats.cumGuest
            stats.youCum = stats.youCum || 0
            stats.theyCum = data.host === email() ? data.stats.cumGuest : data.stats.cumHost
            stats.theyCum = stats.theyCum || 0
            stats.youScore = parseInt(1.0 * stats.youCum / stats.currTurn * 100)
            stats.theyScore = parseInt(1.0 * stats.theyCum / stats.currTurn * 100)
            stats.totalCum = stats.youCum + stats.theyCum
            stats.cumScore = parseInt((stats.youCum + stats.theyCum) / (2.0 * stats.currTurn) * 100)
            this.setState({ stats: stats })
        })
    }
    
    _handleNext = (e) => {
        e.preventDefault();
        if (this.state.stats.currTurn === BLINK_NUMBER) {
            this.props.history.replace(`/results/${this.props.match.params.mode}/${this.props.match.params.sessionKey}`)
        } else {
            this.props.history.replace(`/selections/${this.props.match.params.mode}`)
        }
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
                                    <td colSpan="2" style={{textAlign: 'center'}}><h4>Result for Blink {this.state.stats.currTurn} of {BLINK_NUMBER}</h4></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'right'}}><label> You had:</label></td>
                                    <td style={{textAlign: 'center'}} width="50%"><b>{this.state.stats.youHave}</b></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'right'}}><label> They had:</label></td>
                                    <td style={{textAlign: 'center'}} width="50%"><b>{this.state.stats.theyHave}</b></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'center'}} colSpan="2">Your Selection was: <b>{this.state.stats.youCorrect ? 'CORRECT' : 'INCORRECT'}</b></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'center'}} colSpan="2">Their Selection was: <b>{this.state.stats.theyCorrect ? 'CORRECT' : 'INCORRECT'}</b></td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <table width="100%" className="table">
                                            <tbody>
                                                <tr>
                                                    <th style={{textAlign: 'left'}}>Your Score:</th>
                                                    <td>{this.state.stats.youCum}</td>
                                                    <td>{this.state.stats.youScore}%</td>
                                                </tr>
                                                <tr>
                                                    <th style={{textAlign: 'left'}}>Their Score:</th>
                                                    <td>{this.state.stats.theyCum}</td>
                                                    <td>{this.state.stats.theyScore}%</td>
                                                </tr>
                                                <tr>
                                                    <th style={{textAlign: 'left'}} width="60%">Commulative Score:</th>
                                                    <td width="10%">{this.state.stats.totalCum}</td>
                                                    <td width="30%">{this.state.stats.cumScore}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <button className="btn btn-default btn-round btn-full" onClick={this._handleNext}>
                                            Next
                                            <i className="fa fa-arrow-circle-right"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </Container>
        )
    }
}