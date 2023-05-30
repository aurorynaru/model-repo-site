import React, { useState } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { tailWindCss } from '../../tailwindcss'
import PreviewFile from '../components/PreviewFile'
import Navbar from '../components/Navbar'

import { renderUploadButton } from '../functions/renderImgUpload.jsx'
import { isValidFileType } from '../functions/functions.js'

const Registration = () => {
    const navigate = useNavigate()
    const initialValues = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        image: '',
        doc: '',
        video: null,
        zip: ''
    }

    const MAX_FILE_SIZE = 5120000

    const handleSubmit = async (values, onSubmitProps) => {
        const formData = new FormData()

        for (let value in values) {
            formData.append(value, values[value])
        }

        const savedUserResponse = await fetch(
            'http://localhost:7777/register',
            {
                method: 'POST',
                body: formData
            }
        )

        const savedUser = await savedUserResponse.json()
        onSubmitProps.resetForm()
        if (savedUser) {
            navigate('/')
        }
    }

    const Schema = yup.object().shape({
        username: yup.string().min(3).required('required'),
        password: yup.string().min(7).required('required'),
        email: yup
            .string()
            .email('please enter a valid email')
            .required('required'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('required'),
        image: yup
            .mixed()
            .nullable()
            .test('is-valid-type', 'Not a valid image type', (value) =>
                isValidFileType(value && value.name.toLowerCase(), 'image')
            )
            .test(
                'is-valid-size',
                'Max allowed size is 5mb',
                (value) => !value || value.size <= MAX_FILE_SIZE
            )
    })

    return (
        <>
            <Navbar />
            <Formik
                initialValues={initialValues}
                validationSchema={Schema}
                onSubmit={handleSubmit}
            >
                {({
                    errors,
                    handleChange,
                    handleSubmit,
                    touched,
                    values,
                    setFieldValue,
                    handleBlur
                }) => (
                    <Form
                        autoComplete='off'
                        onSubmit={handleSubmit}
                        className='flex flex-col gap-5 pt-5  mt-10 w-1/3 mx-auto shadow-lg rounded-md bg-neutral-800'
                    >
                        {console.log(errors)}
                        <div className='px-2 gap-3 flex flex-col '>
                            <div className='flex flex-col '>
                                <label
                                    className='text-sm font-semibold'
                                    htmlFor='username'
                                >
                                    Username
                                </label>

                                <input
                                    className={`${tailWindCss} ${
                                        errors.username && touched.username
                                            ? ` focus:ring-red-500 border-red-500`
                                            : ''
                                    }`}
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='username'
                                    placeholder='Enter Username'
                                ></input>
                            </div>

                            <div className='flex flex-col '>
                                <label
                                    className='text-sm font-semibold'
                                    htmlFor='email'
                                >
                                    Email
                                </label>

                                <input
                                    className={`${tailWindCss} ${
                                        errors.email && touched.email
                                            ? ` focus:ring-red-500 border-red-500`
                                            : ''
                                    }`}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='email'
                                    placeholder='Enter email'
                                ></input>
                            </div>

                            <div className='flex flex-col '>
                                <label
                                    className='text-sm font-semibold'
                                    htmlFor='password'
                                >
                                    Password
                                </label>

                                <input
                                    className={`${tailWindCss} ${
                                        errors.password && touched.password
                                            ? ' focus:ring-red-500 border-red-500'
                                            : ''
                                    } `}
                                    value={values.password}
                                    onChange={handleChange}
                                    id='password'
                                    placeholder='Password'
                                    type='password'
                                    onBlur={handleBlur}
                                ></input>
                            </div>

                            <div className='flex flex-col '>
                                <label
                                    className='text-sm font-semibold'
                                    htmlFor='confirmPassword'
                                >
                                    Confirm Password
                                </label>

                                <input
                                    className={`${tailWindCss} ${
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                            ? ' focus:ring-red-500 border-red-500'
                                            : ''
                                    } `}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    id='confirmPassword'
                                    placeholder='Confirm Password'
                                    type='password'
                                    onBlur={handleBlur}
                                ></input>
                            </div>

                            {renderUploadButton(
                                values,
                                setFieldValue,
                                errors,
                                'image',
                                touched
                            )}
                        </div>

                        <button
                            className='btn2 py-4  relative rounded-br-md rounded-bl-md border-opacity-50  uppercase font-semibold tracking-wider leading-none overflow-hidden '
                            type='submit'
                        >
                            <span className='absolute inset-0 bg-green-light '></span>
                            <span className='absolute inset-0 flex justify-center  items-center'>
                                Submit
                            </span>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Registration
