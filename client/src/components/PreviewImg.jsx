import React from 'react'

const PreviewImg = ({ file, width, height }) => {
    const [preview, setPreview] = React.useState(null)

    const reader = new FileReader()

    reader.readAsDataURL(file)

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image'
    }

    reader.onload = () => {
        setPreview(isFileImage(file) ? reader.result : '')
    }
    return (
        <div className='flex items-center flex-col max-w-[550px] max-h-[350px] '>
            <img
                src={preview}
                className={`object-cover overflow-hidden rounded-lg `}
                alt='Preview'
                height={height}
                width={width}
            />
        </div>
    )
}

export default PreviewImg
