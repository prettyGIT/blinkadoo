import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

export default class MaterialButton extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    
    render() {
        return (
            this.props.materialIcon ? 
            <div className="input-group text-center">
                <button className={classnames("btn btn-round", {
                    'btn-success': this.props.success,
                    'btn-info': this.props.info,
                    'btn-default': this.props.default,
                    'btn-danger': this.props.danger,
                    'btn-full': this.props.full,
                    'btn-block': this.props.block,
                })} onClick={this.props.handleClick} disabled={this.props.disabled}>
                    <i className="material-icons">{this.props.materialIcon}</i>
                    {this.props.title}
                </button>
            </div> : 
                <input type="button" className={classnames("btn btn-round", {
                    'btn-success': this.props.success,
                    'btn-info': this.props.info,
                    'btn-default': this.props.default,
                    'btn-full': this.props.full,
                    'btn-block': this.props.block,
                })} value={this.props.title} onClick={this.props.handleClick} disabled={this.props.disabled}/>
        );
    }
}
