import React from 'react'

const Header = (props) => {
    return (
        <div className="header header-dark text-center">
            <img src={process.env.PUBLIC_URL + "/img/logo.jpg"} alt=""/>
        </div>
    )
}

export default Header
