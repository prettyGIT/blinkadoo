import React, { Component } from 'react';
import FacebookProvider, { Share } from 'react-facebook';
import { Share as ShareTwitter } from 'react-twitter-widgets'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import Firebase from '../../helpers/Firebase'
import { reduxSelectOpponent } from '../../actions/app'
import { email } from '../../helpers/auth'
import { BLINK_NUMBER } from '../../config/constants'

import Container from '../../components/layout/Container'

import PageHeader from '../../components/controls/PageHeader'

class Results extends Component {
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
            stats.opponentEmail = data.host === email() ? data.guest : data.host
            stats.youCum = data.host === email() ? data.stats.cumHost : data.stats.cumGuest
            stats.youCum = stats.youCum || 0
            stats.theyCum = data.host === email() ? data.stats.cumGuest : data.stats.cumHost
            stats.theyCum = stats.theyCum || 0
            stats.youScore = parseInt(1.0 * stats.youCum / BLINK_NUMBER * 100)
            stats.theyScore = parseInt(1.0 * stats.theyCum / BLINK_NUMBER * 100)
            stats.cumScore = parseInt((stats.youCum + stats.theyCum) / (2.0 * BLINK_NUMBER) * 100)
            this.setState({ stats: stats })

            if (data.host === email()) {
                Firebase.update(`pendingSessions/${key}`, { archive: true })
            }

            this.props.selectOpponent(null)
        })        
    }
    
    componentDidMount() {
        var $ = require('jquery')
        $('.popup').click(function(event) {
            var width  = 575,
                height = 400,
                left   = ($(window).width()  - width)  / 2,
                top    = ($(window).height() - height) / 2,
                url    = this.href,
                opts   = 'status=1' +
                        ',width='  + width  +
                        ',height=' + height +
                        ',top='    + top    +
                        ',left='   + left;
            
            window.open(url, 'twitter', opts);
        
            return false;
        });        
    }
    
    _handlePostFB = (e) => {
        e.preventDefault();
    }
    _handlePostTwitter = (e) => {
        e.preventDefault();
    }
    _handlePostVisit = (e) => {
        e.preventDefault();
    }
    _handlePostExit = (e) => {
        e.preventDefault();
        this.props.history.replace('/welcome')
    }
    render() {
        return (
            <Container category="setting-wrp">
                <PageHeader/>
                <form className="form-horizontal result-frm" method="" action="">
                    <div className="content">
                        <table width="100%" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td colSpan="3" style={{textAlign: 'center'}}><h4 className="box-title">FINAL RESULTS</h4></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}><label><span className="text-success">{email()}</span> Score:</label></td>
                                    <td style={{textAlign: 'left'}} width="20%"><b>{this.state.stats.youCum}/{BLINK_NUMBER}</b></td>
                                    <td><b>{this.state.stats.youScore}%</b></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}><label><span className="text-success">{this.state.stats.opponentEmail}</span> Score:</label></td>
                                    <td style={{textAlign: 'left'}} width="20%"><b>{this.state.stats.theyCum}/{BLINK_NUMBER}</b></td>
                                    <td><b>{this.state.stats.theyScore}%</b></td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}><label>Commulative Score:</label></td>
                                    <td style={{textAlign: 'left'}} width="20%"><b>{this.state.stats.youCum + this.state.stats.theyCum}/{2 * BLINK_NUMBER}</b></td>
                                    <td><b>{this.state.stats.cumScore}%</b></td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <FacebookProvider appID="718522578310112">
                                            <Share href="http://www.facebook.com">
                                                <button className="btn btn-info fb-btn btn-round btn-full">
                                                    <i className="fa fa-facebook"></i>&nbsp;
                                                    Post to Facebook
                                                </button>
                                            </Share>
                                        </FacebookProvider>                                    
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <a className="twitter popup" href="http://twitter.com/share">
                                            <button className="btn btn-info btn-round btn-full" onClick={this._handlePostTwitter}>
                                                <i className="fa fa-twitter"></i>&nbsp;
                                                Post to Twitter
                                            </button>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <button className="btn btn-success btn-round btn-full" onClick={this._handlePostVisit}>
                                            <i className="fa fa-globe"></i>&nbsp;
                                            Visit Transcender Starship
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3">
                                        <button className="btn btn-default btn-round btn-full" onClick={this._handlePostExit}>
                                            <i className="fa fa-times"></i>&nbsp;
                                            Exit
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

const mapStateToProps = (state, ownProps) => {
    return { }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        selectOpponent: (email) => {
            dispatch(reduxSelectOpponent(email))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results)