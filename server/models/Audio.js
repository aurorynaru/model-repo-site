import mongoose from 'mongoose'

const audioSchema = mongoose.Schema({
    title: { type: String },
    audio: { type: String }
})

export const Audio = mongoose.model('samples', audioSchema)
