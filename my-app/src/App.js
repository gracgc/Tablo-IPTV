import React from 'react';
import './App.css';
import {Route, withRouter, Switch, Redirect} from "react-router-dom";
import {compose} from "redux";
import AdminPanel from "./components/ForAdmin/AdminPanel";
import Menu from "./components/MenuPanel/Menu/Menu";
import CreateGame from "./components/MenuPanel/CreateGame/CreateGame";
import SavedGames from "./components/MenuPanel/SavedGames/SavedGames";
import Settings00 from "./components/MenuPanel/Settings2/Settings00";
import TabloEditClient from "./components/ForClient/TabloEdit/TabloEditClient";
import socket from "./socket/socket";
import Tablo0 from "./components/ForClient/TabloEdit/Tablo0";
import {ConfirmProvider} from "material-ui-confirm";


function App() {

    socket.on();

    return (
        <ConfirmProvider>
            <div className='app'>
                <Switch>
                    <Route exact path='/'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <Redirect to={"/menu"}/>}/>
                    <Route path='/menu' render={() => <Menu/>}/>
                    <Route path='/createGame' render={() => <CreateGame/>}/>
                    <Route exact path='/adminPanel'
                           render={() => <Menu/>}/>

                    <Route path='/adminPanel/:gameNumber?'
                           render={() => <AdminPanel/>}/>
                    <Route path='/savedGames' render={() => <SavedGames/>}/>
                    <Route path='/settings' render={() => <Settings00/>}/>

                    <Route exact path='/tabloClient'
                           render={() => <Tablo0/>}/>
                    <Route exact path='/tabloClient/0' render={() => <Tablo0/>}/>
                    <Route path='/tabloClient/:gameNumber?' render={() => <TabloEditClient/>}/>
                </Switch>
            </div>
        </ConfirmProvider>
    )
}

export default compose(withRouter)(App);
