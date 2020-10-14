import React from 'react'
import c from './Tablo.module.css'


const Tablo = (props) => {

    return (
        <div className={c.tablo}>
            <div className={c.time}>
                00:00:00
            </div>
            <div className={c.counters}>
                <div className={c.counter}>
                    {props.homeCounter} <br/>
                    Home
                </div>
                <div className={c.counter}>
                    {props.guestsCounter} <br/>
                    Guests
                </div>
            </div>

        </div>

    )
};

export default Tablo;
