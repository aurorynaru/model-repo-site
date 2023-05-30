import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucketNameAvatar = process.env.BUCKET_NAME_AVATAR
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const defaultAvatarSmall = process.env.DEFAULT_AVATAR_SMALL
const defaultAvatarLarge = process.env.DEFAULT_AVATAR_LARGE
const defaultAvatarOriginal = process.env.DEFAULT_AVATAR_ORIGINAL

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
})

//register
export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body

        const salt = await bcrypt.genSalt()
        const hashPass = await bcrypt.hash(password, salt)

        const newUser = await User({
            username,
            password: hashPass,
            email
        })

        if (req.body.img) {
            const { small, large, original } = req.body.img
            newUser.avatar = {
                small: small,
                large: large,
                original: original
            }

            // const getParams = (Key) => {
            //     return {
            //         Bucket: bucketName,
            //         Key
            //     }
            // }

            // const getUrl = async (key) => {
            //     const command = new GetObjectCommand(getParams(key))

            //     return await getSignedUrl(s3, command, {
            //         expiresIn: 3600
            //     })
            // }
            // avatarObj = {
            //     small: await getUrl(small),
            //     large: await getUrl(large),
            //     original: await getUrl(original)
            // }
        } else {
            newUser.avatar = {
                small: defaultAvatarSmall,
                large: defaultAvatarLarge,
                original: defaultAvatarOriginal
            }
        }

        const savedUser = await newUser.save()

        res.status(201).json({ user: savedUser })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user =
            (await User.findOne({ username: username })) ||
            (await User.findOne({ email: username }))

        if (!user) {
            throw new Error('incorrect username / password')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('username / password does not match')
        }

        const token = jwt.sign({ id: username._id }, process.env.JWT_SECRET)

        delete user.password

        // let url
        // if (user.avatar) {
        //     const params = {
        //         Bucket: process.env.BUCKET_NAME,
        //         Key: user.avatar
        //     }

        //     const getAvatar = new GetObjectCommand(params)
        //     url = await getSignedUrl(s3, getAvatar, { expiresIn: 3600 })
        // }

        const getAvatarUrl = async (params) => {
            const getAvatar = new GetObjectCommand(params)
            return await getSignedUrl(s3, getAvatar, { expiresIn: 3600 })
        }

        const getAvatarUrlObj = async (avatar) => {
            let urlObj = {
                small: '',
                large: '',
                original: ''
            }

            for (let key in avatar) {
                let params = {
                    Bucket: bucketNameAvatar,
                    Key: avatar[key]
                }

                if (key === 'small') {
                    urlObj.small = await getAvatarUrl(params)
                } else if (key === 'large') {
                    urlObj.large = await getAvatarUrl(params)
                } else {
                    urlObj.original = await getAvatarUrl(params)
                }
            }

            return urlObj
        }

        const url = await getAvatarUrlObj(user.avatar[0][0])

        const {
            id,
            uploaded_models,
            upVoted_models,
            following,
            followers,
            createdAt,
            updatedAt
        } = user

        const resUser = {
            username_id: id,
            username: user.username,
            avatar: url,
            uploaded_models,
            upVoted_models,
            following,
            followers,
            createdAt,
            updatedAt
        }

        res.status(200).json({ token, resUser })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}
