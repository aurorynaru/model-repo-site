import mongoose, { Schema } from 'mongoose'

const modelSchema = mongoose.Schema(
    {
        model_name: { type: String, required: true },
        title: { type: String, required: true },
        img: { type: Array, required: true },
        uploader: { type: Schema.Types.ObjectId, ref: 'users' },
        tags: {
            type: Array,
            required: true
        },
        model_character: {
            type: String,
            required: true
        },
        model_for: {
            type: String,
            enum: [
                'RVC',
                'So-Vits SVC 4.0',
                'So-Vits SVC 4.0 V2',
                'VEC768 So-Vits SVC'
            ],
            required: true
        },
        epoch: {
            type: Number,
            required: true
        },
        steps: {
            type: Number
        },
        description: String,
        samples: [{ type: Schema.Types.ObjectId, ref: 'samples' }],

        comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
        reviewedBy: [{ type: Schema.Types.ObjectId, ref: 'users' }],
        version_history: [{ type: String }],
        sample_audio: String,
        upVotes: {
            type: Number,
            default: 0
        },
        downVotes: {
            type: Number,
            default: 0
        },
        model_status: {
            type: String
        },
        status: {
            type: String,
            enum: ['Public', 'Hidden', 'Deleted'],
            default: 'Public'
        }
    },
    { timestamps: true }
)

export const Model = mongoose.model('models', modelSchema)
