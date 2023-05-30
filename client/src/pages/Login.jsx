import React from 'react'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLogin } from '../state/index.js'
import Navbar from '../components/Navbar.jsx'
import { tailWindCss } from '../../tailwindcss'
import { setLogOut } from '../state/index.js'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const initialValues = {
        username: '',
        password: ''
    }

    const schema = yup.object().shape({
        username: yup.string().required('required'),
        password: yup.string().required('required')
    })

    const handleSubmit = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch('http://localhost:7777/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })

        const loggedIn = await loggedInResponse.json()
        onSubmitProps.resetForm()

        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.resUser,
                    token: loggedIn.token
                })
            )

            navigate('/home')
        }
    }
    return (
        <>
            <Navbar />
            <Formik
                initialValues={initialValues}
                validationSchema={schema}
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
                                    Email / username
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
                                    placeholder='Enter email or Username'
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
                        </div>
                        <button
                            className='btn2 py-4  relative rounded-br-md rounded-bl-md border-opacity-50  uppercase font-semibold tracking-wider leading-none overflow-hidden '
                            type='submit'
                        >
                            <span className='absolute inset-0 bg-green-light '></span>
                            <span className='absolute inset-0 flex justify-center  items-center'>
                                Log in
                            </span>
                            Log in
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Login
