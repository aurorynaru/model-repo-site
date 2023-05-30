const validFileExtensions = { image: ['jpg', 'jpeg', 'png'] }

export const isValidFileType = (fileName, fileType) => {
    if (!fileName) {
        return true // Allow null values
    }

    return validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
}

export const getAllowedExt = (type) => {
    return validFileExtensions[type].map((e) => `.${e}`).toString()
}
