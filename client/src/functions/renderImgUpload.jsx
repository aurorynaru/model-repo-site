import { getAllowedExt } from '../functions/functions.js'
import PreviewFile from '../components/PreviewFile.jsx'
import PreviewImg from '../components/previewImg.jsx'

export const renderUploadButton = (
    values,
    setFieldValue,
    errors,
    inputName,
    touched
) => {
    let allowedExts = getAllowedExt(inputName)
    return (
        <>
            <div className='flex justify-start flex-col mt-2 max-h-64'>
                <div className='flex text-center max-w-full '>
                    <label
                        className=' text-sm flex items-center '
                        htmlFor={inputName}
                    >
                        <span
                            className={` py-[10px] cursor-pointer px-2 bg-green-light text-dark hover:bg-white-green rounded-tl-md rounded-bl-md ${
                                errors.image && touched.image
                                    ? ' border-red-500 bg-red-500 text-red-300 '
                                    : ''
                            }`}
                        >
                            Upload Picture
                        </span>
                    </label>
                    <input
                        className=''
                        id={inputName}
                        name={inputName}
                        type='file'
                        accept={allowedExts}
                        onChange={(event) => {
                            setFieldValue(
                                inputName,
                                event.currentTarget.files[0]
                            )
                        }}
                        style={{ display: 'none' }}
                    />
                    <label
                        htmlFor={inputName}
                        className=' text-sm flex items-center max-w-full w-[calc(100%-113px)] overflow-ellipsis whitespace-nowrap'
                    >
                        <span
                            className={`py-2 text-sm border-2 border-l-0 px-1 cursor-pointer w-full truncate border-green-light rounded-tr-md rounded-br-md ${
                                errors.image && touched.image
                                    ? ' border-red-500 text-red-300'
                                    : ''
                            } truncate`}
                        >
                            {values[inputName] && values[inputName].name
                                ? values[inputName].name
                                : allowedExts}
                        </span>
                    </label>
                    {values[inputName] ? (
                        <PreviewImg
                            className={{ margin: 'auto' }}
                            width={'auto'}
                            height={'auto'}
                            file={values[inputName]}
                        />
                    ) : null}
                </div>
            </div>
        </>
    )
}

export const renderUploadButtonModel = (
    values,
    setFieldValue,
    errors,
    inputName,
    touched
) => {
    // let allowedExts = getAllowedExt(inputName)
    return (
        <>
            <div className='flex justify-start flex-col'>
                <div className='flex flex-col text-center max-w-full '>
                    <div className='max-h-[352px] max-w-[352px]  mx-auto mb-4  w-[550px] h-[350px] border-2 flex items-center p-1'>
                        {values.files.length > 0 &&
                        values.files.filter((file) =>
                            /^image\/(jpeg|png|jpg)$/i.test(file.mimetype)
                        )
                            ? values.files.map((file, index) => {
                                  if (
                                      /^image\/(jpeg|png|jpg)$/i.test(file.type)
                                  ) {
                                      return (
                                          <div key={index}>
                                              <PreviewImg
                                                  className={{ margin: 'auto' }}
                                                  width={'auto'}
                                                  height={'auto'}
                                                  file={file}
                                              />
                                          </div>
                                      )
                                  }
                              })
                            : null}

                        {/* {values[inputName] ? (
                            <PreviewImg
                                className={{ margin: 'auto' }}
                                width={'auto'}
                                height={'auto'}
                                file={values[inputName]}
                            />
                        ) : null} */}
                    </div>
                    <div className='flex w-full'>
                        <label
                            className=' text-sm flex items-center '
                            htmlFor={inputName}
                        >
                            <span
                                className={` whitespace-nowrap overflow-hidden py-[10px] cursor-pointer px-2 bg-green-light text-dark hover:bg-white-green rounded-tl-md rounded-bl-md ${
                                    errors.image && touched.image
                                        ? ' border-red-500 bg-red-500 text-red-300 '
                                        : ''
                                }`}
                            >
                                Upload Model Picture
                            </span>
                        </label>
                        <input
                            className=''
                            id={inputName}
                            name='image'
                            type='file'
                            onChange={(event) => {
                                const { files } = event.target
                                const fileList = Array.from(files)
                                const currentFiles = values.files || []
                                let filtered = []
                                if (values.files == false) {
                                } else {
                                    filtered = currentFiles.filter((file) => {
                                        if (
                                            /^image\/(jpeg|png|jpg)$/i.test(
                                                file.type
                                            ) === false
                                        ) {
                                            return file
                                        }
                                    })
                                }

                                const updatedFiles = [...filtered, ...fileList]

                                setFieldValue('files', updatedFiles)
                            }}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor={inputName}
                            className=' text-sm flex items-center max-w-full w-full overflow-ellipsis whitespace-nowrap'
                        >
                            <span
                                className={`py-2 text-sm border-2 border-l-0 px-1 cursor-pointer w-full truncate border-green-light rounded-tr-md rounded-br-md ${
                                    errors.files && touched.files
                                        ? ' border-red-500 text-red-300'
                                        : ''
                                } truncate`}
                            >
                                {values[inputName] && values[inputName].name
                                    ? values[inputName].name
                                    : '[350px X 550px]'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}
