import dotenv from 'dotenv'
import { getRandomName } from '../functions/randomName.js'
import { uploadToS3 } from './uploadS3.js'
import sharp from 'sharp'
dotenv.config()

export const imgFormat = async (data, name) => {
    try {
        const dataArray = data.filter((file) => {
            const isMatch = /^image\/(jpeg|png|jpg)$/i.test(file.mimetype)
            if (isMatch) {
                return file
            }
        })

        const imgData = dataArray[0]

        const formatImg = async (file, imgSize, fileSize) => {
            const { mimetype, size, originalname } = file

            if (/^image\/(jpeg|png|jpg)$/i.test(mimetype)) {
                // Check if the file size is within the limit
                let buffer
                if (size <= fileSize * 1024 * 1024) {
                    const key =
                        name +
                        '_' +
                        imgSize +
                        '.' +
                        originalname.split('.').pop()

                    buffer = await sharp(file.buffer)
                        .resize({
                            height: imgSize,
                            width: imgSize
                        })
                        .toBuffer()

                    uploadToS3(buffer, key, mimetype, 'image')
                    return key
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
                        name +
                        '_' +
                        width +
                        '_' +
                        height +
                        '.' +
                        originalname.split('.').pop()

                    uploadToS3(file.buffer, key, mimetype, 'image')

                    return key
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

        const large_name = await formatImg(imgData, 400, 10)
        const original_name = await originalImg(imgData, 10)

        return {
            large: large_name,
            original: original_name
        }
    } catch (error) {
        return error.message
    }
}
