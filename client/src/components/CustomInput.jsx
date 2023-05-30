import { useField } from 'formik'
import { tailWindCss } from '../../tailwindcss'

import React from 'react'

const CustomInput = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    return (
        <>
            <label>{label}</label>
            <input
                {...field}
                {...props}
                className={` ${tailWindCss} ${
                    meta.touched && meta.error
                        ? ' focus:ring-red-500 border-red-500'
                        : ''
                }`}
            />
        </>
    )
}

export default CustomInput
