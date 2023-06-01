import { getRandomName } from '../functions/randomName.js'
import { Model } from '../models/Model.js'
import { modelZip } from './modelUpload.js'
import { audioConvert } from './audioUpload.js'
import { imgFormat } from './imageUpload.js'
import { Audio } from '../models/Audio.js'
import { User } from '../models/User.js'
import mongoose from 'mongoose'
const defaultLarge = process.env.DEFAULT_LARGE
const defaultOriginal = process.env.DEFAULT_ORIGINAL

// create
export const createModelPost = async (req, res) => {
    try {
        const { username_id, title, tags, epoch, model_for, model_character } =
            req.body

        const modelName = getRandomName('zip')

        const { isAudio, isImage } = req.body.fileUpload
        let description
        let audioTitleArray = []

        if (req.body.audioTitle1) {
            audioTitleArray.push(req.body.audioTitle1)
        } else if (req.body.audioTitle2) {
            audioTitleArray.push(req.body.audioTitle2)
        } else if (req.body.audioTitle3) {
            audioTitleArray.push(req.body.audioTitle3)
        } else {
            audioTitleArray.push('sample audio')
        }

        if (req.body.description) {
            description = req.body.description
        } else {
            description = ''
        }
        const user = await User.findById(username_id)
        const newModel = new Model({
            model_name: modelName,
            title,
            tags,
            uploader: user.id,
            epoch,
            model_for,
            model_character,
            description
        })

        if (req.body.steps) {
            newModel.steps = req.body.steps
        }
        if (isImage) {
            const imgName = getRandomName()
            const imgNames = await imgFormat(req.files, imgName)

            newModel.img = {
                large: imgNames.large,
                original: imgNames.original
            }
        } else {
            newModel.img = {
                large: defaultLarge,
                original: defaultOriginal
            }
        }
        const savedNewModel = await newModel.save()

        const modelDataName = savedNewModel._id.toString()
        let audioCount = 0

        if (isAudio) {
            req.files.forEach(async (file) => {
                const isAudioFile = /^audio\//i.test(file.mimetype)
                if (isAudioFile) {
                    const newAudio = new Audio({
                        title: audioTitleArray[audioCount],
                        audio: `${modelDataName}_SAMPLE_${audioCount}.opus`
                    })

                    const saved = await newAudio.save()

                    if (saved) {
                        await Model.findByIdAndUpdate(
                            savedNewModel._id,
                            {
                                $push: {
                                    samples: saved._id
                                }
                            },
                            { new: true }
                        )
                    }
                    audioCount++
                }
            })
        }

        if (savedNewModel) {
            const isModelSaved = modelZip(req.files, modelDataName)
            let isAudioSaved

            if (isAudio) {
                isAudioSaved = audioConvert(req.files, modelDataName)
            }

            if (isModelSaved) {
                const isModel = user.uploaded_models.find(
                    (modelId) => modelId === savedNewModel._id
                )
                const isModelAndUser =
                    savedNewModel.uploader.toString() === user._id.toString()

                let updatedUser

                if (!isModel && isModelAndUser) {
                    updatedUser = await User.findByIdAndUpdate(
                        { _id: user._id },
                        {
                            $push: {
                                uploaded_models: {
                                    $each: [savedNewModel._id],
                                    $position: 0
                                }
                            }
                        },
                        { new: true }
                    )
                }

                if (isAudioSaved) {
                    res.status(201).json('audio and model success')
                } else {
                    res.status(201).json('model success')
                }
            } else {
                throw new Error(
                    'Internal server error, please refresh and try again'
                )
            }
        } else {
            throw new Error(
                'Internal server error, please refresh and try again'
            )
        }
    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

//get

export const getModels = async (req, res) => {
    try {
        const modelList = await Model.find()

        res.status(200).json(modelList)
    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

export const getUserModelPost = async (req, res) => {
    try {
        const { uploader } = req.params

        const posts = await Model.find({ uploader })
        res.status(200).json(posts)
    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

// update

// export const likePost = async (req, res) => {
//     try {
//         const { modelId } = req.params
//         const { uploader } = req.body

//         const post = await Model.findById({ _id: modelId })
//         //check
//         const isLiked = post.likes.get(uploader)
//         if (isLiked) {
//             post.likes.delete(uploader)
//         } else {
//             post.likes.set(uploader, true)
//         }

//         const updatedPost = await Post.findByIdAndUpdate(
//             id,
//             { likes: post.likes },
//             { new: true }
//         )

//         res.status(200).json(updatedPost)
//     } catch (err) {
//         res.status(409).json({ error: err.message })
//     }
// }
