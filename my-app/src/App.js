import React from 'react';
import './App.css';
import TabloEdit from "./components/ForAdmin/TabloEdit/TabloEdit";
import TeamsParameters from "./components/ForAdmin/Parameters/TeamsParameters";
import Log from "./components/ForAdmin/Log/Log";


function App() {
    return (
        <div className='app'>
            <div className='app__info'>
                блок с информацией
            </div>
            <div className='app__mainPanel'>
                <div>
                    <Log/>
                </div>
                <div>
                    <TabloEdit/>
                </div>
            </div>
            <div className='app__addPanel'>
                <div>
                    <TeamsParameters/>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}


export default App;
