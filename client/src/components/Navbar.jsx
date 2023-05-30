import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setLogOut } from '../state/index.js'
const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isHovered, setIsHovered] = useState(false)
    const [isRadiance, setIsRadiance] = useState(false)

    const isAuth = Boolean(useSelector((state) => state.token))
    return (
        <div className='flex items-center justify-between py-5 px-5 drop-shadow-lg bg-dark shadow-md shadow-dark/50 '>
            <div
                className='flex items-center px-5 '
                onClick={() => navigate('/')}
            >
                <h1
                    className={`text-3xl animation-glowing font-medium text-green-light cursor-pointer m-0 tracking-[0.005em]  `}
                    onMouseEnter={() => setIsRadiance(true)}
                    onMouseLeave={() => setIsRadiance(false)}
                >
                    RESONANCE
                </h1>
                <span className='text-3xl animation-glowing dot font-medium text-green-light cursor-pointer m-0 tracking-[0.005em] '>
                    .
                </span>
                <span className='text-3xl animation-glowing ai font-medium text-green-light cursor-pointer m-0 tracking-[0.005em] '>
                    ai
                </span>
            </div>
            <div className='flex items-center group relative '>
                <h2
                    className='m-0 cursor-pointer text-white-green font-medium mr-1  text-base border-2 border-green-light px-2 py-[0.05em] rounded-md shadow-lg  shadow-green-light/50'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    How to use / Tutorials{' '}
                </h2>
                <span
                    className={`opacity-0 text-sm tracking-wider text-gray-400 ${
                        isHovered && 'opacity-100'
                    }   duration-700`}
                >
                    (coming soon)
                </span>
            </div>
            <div className='transform hover:translate-y-[-5px] duration-500 px-5'>
                {isAuth ? (
                    <div className='flex gap-4'>
                        <button
                            className='border-transparent text-dark bg-green-light hover:bg-white-green text-sm py-1 px-3 border-none rounded-2xl'
                            onClick={() => navigate('/models/post')}
                        >
                            Upload Model
                        </button>
                        <button
                            className='border-transparent text-dark bg-green-light hover:bg-white-green text-sm py-1 px-3 border-none rounded-2xl'
                            onClick={() => {
                                dispatch(setLogOut())
                            }}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <button
                        className='border-transparent text-dark bg-green-light hover:bg-white-green text-sm py-1 px-3 border-none rounded-2xl'
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar
