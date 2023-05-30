import mongoose, { Schema } from 'mongoose'

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        avatar: [
            {
                type: Array,
                default: []
            }
        ],
        uploaded_models: [Schema.Types.ObjectId],
        upVoted_models: [Schema.Types.ObjectId],
        following: { type: Array, required: true, default: [] },
        followers: { type: Array, required: true, default: [] },
        isBanned: {
            type: Boolean,
            default: 0
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export const User = mongoose.model('users', userSchema)
