import React from "react";
import c from "./FormsControls.module.css";


const FormControl = ({input, meta, child, ...props}) => {
    const hasError = meta.touched && meta.error;
    return (
        <div className={c.formControl + " " + (hasError ? c.error : "")}>
            <div className={c.blockArea}>
                {props.children}
                {hasError && <div>{meta.error}</div>}
            </div>
        </div>
    )
};

export const Textarea = (props) => {
    const {input, meta, child, ...restProps} = props;
    return <FormControl {...props}><textarea {...input} {...restProps} /></FormControl>
};

export const Input = (props) => {
    const {input, meta, child, ...restProps} = props;
    return <FormControl {...props}><input {...input} {...restProps} /></FormControl>
};

export const InputImg = (props) => {
    const {input, meta, child, ...restProps} = props;
    return <input type="file"
                  hidden
                  enctype="multipart/form-data" {...input} {...restProps} />
};

export const InputReadOnly = (props) => {
    const {input, meta, child, ...restProps} = props;
    return <FormControl {...props}><input readOnly={true} {...input} {...restProps}/></FormControl>
};

export const InputPassword = (props) => {
    const {input, meta, child, ...restProps} = props;
    return <FormControl {...props}><input type={'password'} {...input} {...restProps} /></FormControl>
};
