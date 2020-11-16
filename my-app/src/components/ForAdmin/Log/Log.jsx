import React from 'react'
import c from './Log.module.css'
import {useSelector} from "react-redux";
import LogItem from "./LogItem";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {Field, reduxForm} from "redux-form";
import {Input} from "../../../common/FormsControls/FormsControls";


const AddLogForm = (props) => {

    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div className={c.logForm}>
                    <Field placeholder={'Add log'} name={'addLog'}
                           component={Input}/>
                    <div className={c.addLogButton}>
                        +
                    </div>
                </div>
            </form>
        </div>
    )
};

const AddLogReduxForm = reduxForm({form: 'addLog'})(AddLogForm);


const Log = (props) => {

    const gameLog = useSelector(
        state => state.logPage.logData.gameLog
    );

    return (
        <div className={c.log}>
            <div style={{fontSize: "150%", marginBottom: "1%"}}>Log</div>
            <div className={c.logWindow}>
                {gameLog.map(l => <LogItem key={l.id} id={l.id} logItem={l.item}/>)}
            </div>
                <AddLogReduxForm/>
        </div>
    )
};

export default compose(withRouter)(Log);
