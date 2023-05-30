import crypto from 'crypto'

export const getRandomName = (extension = null) => {
    const name =
        crypto.randomBytes(16).toString('hex') +
        (extension ? '.' + extension : '')
    return name
}
