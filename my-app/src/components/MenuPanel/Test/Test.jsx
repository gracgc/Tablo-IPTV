import React, {useEffect, useState} from "react";

import useInterval from 'use-interval'
import Test2 from "./Test2";


const Test = (props) => {

    console.log(1)

    return (
        <div style={{background: 'black'}}>
            <div style={{color: 'white'}}>
                <Test2/>
            </div>

        </div>
    )
}

export default Test;