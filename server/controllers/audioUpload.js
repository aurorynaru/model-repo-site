import Ffmpeg from 'fluent-ffmpeg'
import stream, { Readable } from 'stream'
import { uploadToS3 } from './uploadS3.js'

export const audioConvert = async (data, name) => {
    try {
        const duration = 30

        const dataArray = data
            .filter((file) => /audio/i.test(file.mimetype))
            .map((file) => file.buffer)

        const getAudioBuffer = (audioBuffer) => {
            return new Promise((resolve, reject) => {
                const readableStream = Readable.from(audioBuffer)

                const command = Ffmpeg(readableStream)
                    .audioBitrate('128k')
                    .format('opus')
                    .duration(duration)
                    .pipe()
                const chunks = []
                command.on('data', (chunk) => {
                    chunks.push(chunk)
                })

                command.on('end', () => {
                    const aacBuffer = Buffer.concat(chunks)
                    resolve(aacBuffer)
                })

                command.on('error', (error) => {
                    reject(error)
                })
            })
        }
        let count = 1

        dataArray.forEach(async (buffer) => {
            const newName = `${name}_SAMPLE_${count}.opus`
            const convertedAudioBuffer = await getAudioBuffer(buffer)
            uploadToS3(convertedAudioBuffer, newName, 'audio/ogg', 'audio')
            count++
        })
    } catch (error) {
        return error.message
    }
}
