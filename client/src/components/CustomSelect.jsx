import { useField } from 'formik'
import { tailWindCss } from '../../tailwindcss'

import React from 'react'

const CustomSelect = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    return (
        <>
            <label className='block overflow-hidden text-ellipsis whitespace-nowrap'>
                {label}
            </label>
            <select
                {...field}
                {...props}
                className={` ${tailWindCss}
                   ${
                       meta.touched && meta.error
                           ? ' focus:ring-red-500 border-red-500'
                           : ''
                   } `}
            />
        </>
    )
}

export default CustomSelect
