import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
import { firebaseAuth } from '../config/constants'
import { googleLogin, saveUser } from '../helpers/auth'
import './Login.css';

export default class Login extends Component {
    state = {}
    _googleSignin = (googleUser) => {
        googleLogin(googleUser.getAuthResponse().id_token).then((user) => {
            saveUser(user)
        })
    }
    _googleFailure = (err) => {

    }
    render() {
        return (
            <div className="splashwrp col-sm-5 col-md-4 col-md-offset-5">
                <div className="row">
                    <div className="card card-signup">
                        <div className="header header-dark text-center">
                            <img src={process.env.PUBLIC_URL + "img/logo.jpg"} alt=""/>
                        </div>
                        <div className="content splash-wrp">
                            <GoogleLogin className="btn-google-container"
                                    clientId='484428120943-7u0frehn35c39aaqa5uc17smpvnofef4.apps.googleusercontent.com'
                                    onSuccess={this._googleSignin}
                                    onFailure={this._googleFailure}
                                    offline={false}>
                                <img className="btn-google"
                                    src={process.env.PUBLIC_URL + "/img/btn_google_signin_light_normal_web.png"}/>
                            </GoogleLogin>
                        </div>
                        <div className="footer text-center">
                            <span className="text-muted">© 2017 Transcender Starship</span>
                        </div>                            
                    </div>
                </div>
            </div>
        )
    }
}