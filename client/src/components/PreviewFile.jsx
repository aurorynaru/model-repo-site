import React from 'react'

const PreviewFile = ({ file, width, height }) => {
    const [preview, setPreview] = React.useState(null)

    const reader = new FileReader()

    reader.readAsDataURL(file)

    function isFileImage(file) {
        return file && file['type'].split('/')[0] === 'image'
    }

    reader.onload = () => {
        setPreview(isFileImage(file) ? reader.result : '')
    }
    const styles = {
        circle: {
            borderRadius: '50%',
            objectFit: 'cover',
            overflow: 'hidden'
        },
        spanText: {
            maxWidth: 'calc(100% - 90px)',
            display: 'inline-block',
            verticalAlign: 'middle',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }

    return (
        <>
            <div className='flex items-center flex-col mt-2 min-h-[95px] min-w-[250px] max-h-full h-full justify-center  border-2 border-dark border-opacity-30 w-1/3  p-2 mx-auto rounded-md hover:border-opacity-70'>
                <img
                    src={preview}
                    className={`object-scale-down overflow-hidden rounded-sm `}
                    alt='Preview'
                    height={height}
                    width={width}
                />
            </div>
        </>
    )
}

export default PreviewFile
