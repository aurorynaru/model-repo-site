import { useField } from 'formik'
import { tailWindCss } from '../../tailwindcss'

import React from 'react'

const CustomTextBox = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    return (
        <>
            <label className='block overflow-hidden text-ellipsis whitespace-nowrap '>
                {label}
            </label>
            <textarea
                {...field}
                {...props}
                className={` ${tailWindCss} h-44 resize-none bg-dark border-none rounded-lg text-white-green
                   ${
                       meta.touched && meta.error
                           ? ' focus:ring-red-500 border-red-500'
                           : ''
                   } `}
            />
        </>
    )
}

export default CustomTextBox
