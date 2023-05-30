import React, { useEffect } from 'react'
import { setModels } from '../state'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
const Home = () => {
    const dispatch = useDispatch()
    const models = useSelector((state) => state.models)
    const getModels = async () => {
        const response = await fetch('http://localhost:7777/Home', {
            method: 'GET'
        })

        const data = await response.json()

        dispatch(setModels({ models: data.reverse() }))
    }
    useEffect(() => {
        getModels()
    }, [])

    //  console.log(models)
    return (
        <main className='h-[calc(100vh-75.99px)]'>
            <Navbar />
            <div className='flex h-full'></div>
        </main>
    )
}
export default Home
