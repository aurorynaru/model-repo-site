import dotenv from 'dotenv'

dotenv.config()
export const checkFiles = async (req, res, next) => {
    try {
        const modelUpload = req.files.find((file) =>
            /^application\/(zip|octet-stream|x-zip-compressed)$/i.test(
                file.mimetype
            )
        )

        console.log(req.files)
        console.log(req.body)
        const imageUpload = req.files.find((file) =>
            /^image\/(jpeg|png|jpg)$/i.test(file.mimetype)
        )
        let audioCount = 0
        let audioUpload = false

        req.files.forEach((file) => {
            const isAudioFile = /^audio\//i.test(file.mimetype)
            if (isAudioFile) {
                audioCount++
                audioUpload = true
            }

            if (audioCount > 3) {
                throw new Error('Maximum audio upload is 3')
            }
        })

        if (!modelUpload) {
            throw new Error('Invalid model file.')
        }

        req.body.fileUpload = {
            isAudio: audioUpload ? true : false,
            isImage: imageUpload ? true : false
        }

        next()
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
