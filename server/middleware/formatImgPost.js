import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
import sharp from 'sharp'
import { Model } from '../models/Model.js'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const processModelImg = async (req, res, next) => {
    try {
        if (req.file) {
            if (req.file.mimetype.startsWith('image')) {
                const bucketName = process.env.BUCKET_NAME
                const bucketRegion = process.env.BUCKET_REGION
                const accessKey = process.env.ACCESS_KEY
                const secretAccessKey = process.env.SECRET_ACCESS_KEY

                const s3 = new S3Client({
                    credentials: {
                        accessKeyId: accessKey,
                        secretAccessKey: secretAccessKey
                    },
                    region: bucketRegion
                })

                //not working gif implementation
                // const formatGif = async (buffer) => {
                //     const codec = new GifCodec()
                //     const byteEncodingBuffer = buffer

                //     const decodedGif = codec.decodeGif(byteEncodingBuffer)

                //     const newGifData = await decodedGif

                //     const edgeLength = Math.min(newGifData.width, newGifData.height)
                //     newGifData.frames.forEach((frame) => {
                //         const xOffset = (frame.bitmap.width - edgeLength) / 2
                //         const yOffset = (frame.bitmap.height - edgeLength) / 2
                //         frame.reframe(xOffset, yOffset, edgeLength, edgeLength)
                //     })

                //     return newGifData
                // }

                const formatImg = async (file, imgSize, fileSize) => {
                    const { mimetype, size, originalname } = file

                    if (/^image\/(jpeg|png|jpg)$/i.test(mimetype)) {
                        // Check if the file size is within the limit
                        let buffer
                        if (size <= fileSize * 1024 * 1024) {
                            const key =
                                crypto.randomBytes(16).toString('hex') +
                                '_' +
                                imgSize +
                                '.' +
                                originalname.split('.').pop()

                            buffer = await sharp(req.file.buffer)
                                .resize({
                                    height: imgSize,
                                    width: imgSize
                                })
                                .toBuffer()
                            // if (mimetype === 'image/gif') {
                            //     const gif = await formatGif(req.file.buffer)

                            //     buffer = gif.buffer

                            // }

                            return {
                                Bucket: bucketName,
                                Key: key,
                                Body: buffer,
                                ContentType: mimetype
                            }
                        } else {
                            throw new Error(
                                'File size exceeds the maximum limit of 10MB.'
                            )
                        }
                    } else {
                        throw new Error(
                            'Only image files (JPEG, PNG, JPG) are allowed.'
                        )
                    }
                }

                const originalImg = async (file, fileSize) => {
                    const { mimetype, size, originalname } = file

                    const metadata = await sharp(file.buffer).metadata()
                    const { width, height } = metadata

                    if (/^image\/(jpeg|png|gif)$/i.test(mimetype)) {
                        if (size <= fileSize * 1024 * 1024) {
                            const key =
                                crypto.randomBytes(16).toString('hex') +
                                '_' +
                                width +
                                '_' +
                                height +
                                '.' +
                                originalname.split('.').pop()

                            return {
                                Bucket: bucketName,
                                Key: key,
                                Body: req.file.buffer,
                                ContentType: mimetype
                            }
                        } else {
                            throw new Error(
                                'File size exceeds the maximum limit of 10MB.'
                            )
                        }
                    } else {
                        throw new Error(
                            'Only image files (JPEG, PNG, JPG) are allowed.'
                        )
                    }
                }

                const large = await formatImg(req.file, 400, 10)
                const original = await originalImg(req.file, 10)

                const { model_link, title } = req.body

                if (model_link && title) {
                    const isValidLink =
                        model_link.startsWith('https://drive.google.com/') ||
                        model_link.startsWith('https://huggingface.co/')

                    if (isValidLink) {
                        if (title.split('').length <= 100) {
                            const saveLarge = new PutObjectCommand(large)
                            await s3.send(saveLarge)

                            const saveOriginal = new PutObjectCommand(original)
                            await s3.send(saveOriginal)
                        } else {
                            throw new Error(
                                'Try shortening your title to 100 characters'
                            )
                        }
                    } else {
                        throw new Error(
                            'We only accept links from huggingface and google drive.'
                        )
                    }
                } else {
                    throw new Error('invalid model title / model link')
                }

                if (large && original) {
                    req.body.img = {
                        large: large.Key,
                        original: original.Key
                    }

                    next()
                }
            }
        } else {
            next()
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
