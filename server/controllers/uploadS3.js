import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
dotenv.config()

export const uploadToS3 = async (buffer, name, mime, bucket) => {
    try {
        let bucketNameEnv
        if (bucket === 'audio') {
            bucketNameEnv = process.env.BUCKET_NAME_AUDIO
        } else if (bucket === 'model') {
            bucketNameEnv = process.env.BUCKET_NAME_MODEL
        } else {
            bucketNameEnv = process.env.BUCKET_NAME_AVATAR
        }
        const bucketName = bucketNameEnv
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

        const params = {
            Bucket: bucketName,
            Key: name,
            Body: buffer,
            ContentType: mime
        }

        const saveFile = new PutObjectCommand(params)

        const isSave = await s3.send(saveFile)

        if (isSave) {
            return true
        }
    } catch (error) {
        throw error
    }
}
