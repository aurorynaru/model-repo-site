import { useField } from 'formik'
import { tailWindCss } from '../../tailwindcss'

import React from 'react'

const CustomText = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    console.log(field)
    return (
        <>
            <text
                id={field.name}
                {...field}
                {...props}
                className={` w-48 ${
                    meta.touched && meta.error
                        ? ' focus:ring-red-500 border-red-500'
                        : ''
                } `}
            />
        </>
    )
}

export default CustomText
