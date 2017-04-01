import React from 'react'
import classnames from 'classnames';

const Container = ({children, category, ...rest}) => {
    return (
        <div className={classnames("col-sm-5 col-md-4", category, {
            "col-md-offset-5": category === "splashwrp",
            "col-md-offset-4": category === "setting-wrp",
        })}>
            <div className="row">
                <div className="card card-signup">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Container;