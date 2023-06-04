import React, { useEffect } from 'react'
import { setModels } from '../state'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Post from '../components/Post'
const Home = () => {
    const dispatch = useDispatch()
    const models = useSelector((state) => state.models)
    const getModels = async () => {
        const response = await fetch('http://localhost:7777/Home', {
            method: 'GET'
        })

        const data = await response.json()

        const modelsData = data.map((model) => {
            if (model.samples.length > 0) {
                model.samples.forEach((sample) => {
                    const decoded = decodeURIComponent(sample.audio)
                    model.samples = decoded
                })
            }

            if (model.model_link) {
                const decoded = decodeURIComponent(model.model_link)
                model.model_link = decoded
            }
            let modelArr = []
            if (model.img.length > 0) {
                model.img.forEach((img) => {
                    for (const key in img) {
                        const decoded = decodeURIComponent(img[key])

                        modelArr.push({ [key]: decodeURIComponent(decoded) })
                    }

                    model.img = modelArr
                })
            }

            return model
        })
        console.log(modelsData)
        dispatch(setModels({ models: data.reverse() }))
    }
    useEffect(() => {
        getModels()
    }, [])

    return (
        <main className='h-[calc(100vh-75.99px)]'>
            <Navbar />
            <div className='flex h-full'>
                <Post models={models} />
            </div>
        </main>
    )
}
export default Home
