import React, { Component } from 'react'
import shallowCompare from 'react-addons-shallow-compare';

export default class MaterialInput extends Component {
    state = {}
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    componentDidMount() {
        window.$material.init();
    }
    _handleChange = (e) => {
        if (this.props.handleChange) {
            this.props.handleChange(e.target.value);
        }
    }

    render() {
        return (
            <div className="input-group">
                <span className="input-group-addon">
                    <i className="material-icons">{this.props.materialIcon}</i>
                </span>
                <input type="text" className="form-control" placeholder={this.props.placeholder}
                    onChange={this._handleChange}/>
            </div>
        )
    }
}
