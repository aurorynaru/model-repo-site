import { uploadToS3 } from './uploadS3.js'
import AdmZip from 'adm-zip'

export const modelZip = async (data, name) => {
    try {
        const zip = new AdmZip()
        const mime = 'application/zip'
        let zipName = name.replace(/\s/g, '') + '.zip'

        let isMixedFiles = {
            zip: false,
            none_zip: false
        }

        const dataArray = data.filter((file) => {
            const isMatch = /^application\/(zip|octet-stream)$/i.test(
                file.mimetype
            )
            if (isMatch) {
                return file
            }
        })

        if (dataArray.length > 1) {
            dataArray.forEach((file) => {
                if (file.mimetype === 'application/zip') {
                    isMixedFiles.zip = true
                } else if (file.mimetype === 'application/octet-stream') {
                    isMixedFiles.none_zip = true
                }
            })
        }

        if (isMixedFiles.zip === true && isMixedFiles.none_zip === false) {
            dataArray.forEach((file) => {
                if (file.mimetype === 'application/zip') {
                    uploadToS3(file.buffer, zipName, mime, 'model')
                }
            })
        } else {
            dataArray.forEach((file) => {
                zip.addFile(file.originalname, file.buffer)
            })

            const zipBuffer = zip.toBuffer()

            uploadToS3(zipBuffer, zipName, mime, 'model')
        }
    } catch (error) {
        return error.message
    }
}
