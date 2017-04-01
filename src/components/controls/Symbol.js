import React from 'react';

const Symbol = ({digit}) => {
    var digitSrc = process.env.PUBLIC_URL
    var altStr = ""
    if (digit == 1) {
        digitSrc += "/img/one.png"
        altStr = "one"
    } else {
        digitSrc += "/img/zero.png"
        altStr = "zero"
    }

    return (
        <div className="selected-symbol">
            <img src={digitSrc} alt={altStr}/>
        </div>
    )
}

export default Symbol