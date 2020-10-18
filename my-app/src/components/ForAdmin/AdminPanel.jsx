import React from 'react'
import c from './AdminPanel.module.css'
import TeamsParameters from "./Parameters/TeamsParameters";
import TabloEdit from "./TabloEdit/TabloEdit";
import Log from "./Log/Log";
import Info from "./Info/Info";




const AdminPanel = (props) => {

    return (
        <div className={c.adminPanel}>
            <div className={c.adminPanel__info}>
                <Info/>
            </div>
            <div className={c.adminPanel__mainPanel}>
                <div>
                    <Log/>
                </div>
                <div>
                    <TabloEdit/>
                </div>
            </div>
            <div className={c.adminPanel__addPanel}>
                <div>
                    <TeamsParameters/>
                </div>
                <div>

                </div>
            </div>
        </div>

    )
};

export default AdminPanel;
