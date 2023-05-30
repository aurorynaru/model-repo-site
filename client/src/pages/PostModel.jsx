import React, { useState } from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { tailWindCss } from '../../tailwindcss'
import PreviewFile from '../components/PreviewFile'
import Navbar from '../components/Navbar'
import { isValidFileType } from '../functions/functions.js'
import { renderUploadButtonModel } from '../functions/renderImgUpload.jsx'
import CustomInput from '../components/customInput'
import CustomSelect from '../components/customSelect'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CustomTextBox from '../components/CustomTextBox'
import CustomText from '../components/CustomText'

const PostModel = () => {
    const navigate = useNavigate()
    const initialValues = {
        title: '',
        tags: [],
        files: [],
        model_character: '',
        model_for: '',
        epoch: '',
        description: '',
        steps: '',
        audioTitle1: ''
    }
    const SUPPORTED_FILE_TYPES = [
        'png',
        'jpeg',
        'jpg',
        'pth',
        'index',
        'zip',
        'audio'
    ]
    const MAX_FILE_SIZE = 1000 * 1024 * 1024

    const Schema = yup.object().shape({
        title: yup.string().min(3).max(100).required('required'),
        model_character: yup.string(),
        model_for: yup
            .string()
            .oneOf(
                [
                    'RVC',
                    'So-Vits SVC 4.0',
                    'So-Vits SVC 4.0 V2',
                    'VEC768 So-Vits SVC'
                ],
                'Please select one'
            )
            .required('required'),
        audioTitle1: yup.string().max(10),
        epoch: yup
            .number()
            .positive('Number must be positive')
            .required('required'),
        description: yup.string().max(1000),
        steps: yup
            .number()
            .min(7)
            .positive('Number must be positive')
            .required('required'),
        audioFiles: yup.array().of(
            yup.object().shape({
                title: yup.string().required('Please enter a title')
            })
        ),
        tags: yup.array().min(1).max(10),
        files: yup.array().required('Please upload model files')
    })

    const handleSubmit = async (values) => {
        console.log(values)
    }

    const tagsList = [
        'tag1',
        'tag2',
        'tag3',
        'tag4',
        'tag5',
        'sat',
        'kek',
        'crepe v2',
        'crepe',
        'keek',
        'keeek',
        'keeeeeek',
        'anime',
        'lul',
        'omegalyl',
        'gekw',
        'lels',
        'luls'
    ]

    const [selectedTags, setSelectedTags] = useState([])
    const [inputTag, setInputTag] = useState('')
    const [isFocus, setIsFocus] = useState(false)

    const handleTagSelection = (tag, valuesTag, setFieldValue) => {
        const isMatch = selectedTags.find((selectedTag) => selectedTag === tag)

        if (!isMatch) {
            setSelectedTags([...selectedTags, tag])
            setFieldValue('tags', [...selectedTags, tag])
        } else {
            const filteredTags = selectedTags.filter(
                (selectedTag) => selectedTag != tag
            )

            setSelectedTags([...filteredTags])
            setFieldValue('tags', [...filteredTags])
        }
    }

    const handleUpload = (formikFiles, event, setFieldValue) => {
        const { files } = event.target
        const fileList = Array.from(files)

        const currentFiles = formikFiles || []

        let filtered = []

        if (formikFiles == false) {
        } else {
            filtered = currentFiles.filter((file) => {
                if (/^audio\//i.test(file.type) === false) {
                    return file
                }
            })
        }

        const updatedFiles = [...filtered, ...fileList]

        setFieldValue('files', updatedFiles)
    }

    const handleUploadDropzone = (formikFiles, event, setFieldValue) => {
        const files = event

        const fileList = Array.from(files)

        const currentFiles = formikFiles || []

        const updatedFiles = [...currentFiles, ...fileList]

        setFieldValue('files', updatedFiles)
    }

    return (
        <>
            <Navbar />
            <div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Schema}
                    onSubmit={handleSubmit}
                >
                    {({
                        errors,
                        handleChange,
                        handleSubmit,
                        touched,
                        values,
                        setFieldValue,
                        handleBlur
                    }) => (
                        <Form
                            autoComplete='off'
                            className='flex flex-col gap-5 pt-5  mt-10 w-1/3 mx-auto shadow-lg rounded-md bg-neutral-800'
                            onSubmit={handleSubmit}
                        >
                            <div className='px-2 gap-4 flex flex-col'>
                                {renderUploadButtonModel(
                                    values,
                                    setFieldValue,
                                    errors,
                                    'files',
                                    touched
                                )}

                                <CustomInput
                                    label='Model Title'
                                    name='title'
                                    type='text'
                                    placeholder='Enter model title'
                                />
                                <div className='flex flex-col  '>
                                    <div className='flex justify-evenly '>
                                        <div className='flex flex-col w-full  whitespace-nowrap overflow-hidden text-overflow-ellipsis'>
                                            <label className='pl-1'>
                                                Select your model
                                            </label>
                                            <CustomSelect
                                                name='model_for'
                                                placeholder='Please select one'
                                            >
                                                <option value=''>
                                                    Please select one
                                                </option>
                                                <option value='RVC'>RVC</option>
                                                <option value='So-Vits SVC 4.0'>
                                                    So-Vits SVC 4.0
                                                </option>
                                                <option value='So-Vits SVC 4.0 V2'>
                                                    So-Vits SVC 4.0 V2
                                                </option>
                                                <option value='VEC768 So-Vits SVC'>
                                                    VEC768 So-Vits SVC
                                                </option>
                                            </CustomSelect>
                                        </div>
                                        <div className='mx-2 w-full flex flex-col  whitespace-nowrap overflow-hidden text-overflow-ellipsis'>
                                            <label className='pl-1'>
                                                Enter Epoch
                                            </label>
                                            <CustomInput
                                                name='epoch'
                                                type='number'
                                                placeholder='Enter Epoch count'
                                            />
                                        </div>
                                        <div className='flex flex-col w-full  whitespace-nowrap overflow-hidden text-overflow-ellipsis'>
                                            <label className='pl-1'>
                                                Enter Steps
                                            </label>
                                            <CustomInput
                                                name='steps'
                                                type='number'
                                                placeholder='Enter steps'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='flex gap-2 overflow-x-auto relative'>
                                    {selectedTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className=' flex text-xs p-1 bg-green-light text-dark hover:bg-white-green rounded-md cursor-pointer'
                                            onClick={(e) =>
                                                handleTagSelection(tag)
                                            }
                                        >
                                            {tag}
                                            <XMarkIcon className='pl-[3px] pb-[3px] w-3 h-3 ' />
                                        </span>
                                    ))}
                                </div>
                                <label htmlFor='tags'>Tags:</label>
                                <Field
                                    className='text-dark px-2 text-sm'
                                    type='text'
                                    id='tags'
                                    name='tags'
                                    component='input'
                                    placeholder='Enter tags'
                                    onChange={(event) => {
                                        setInputTag(event.target.value.trim())
                                        const inputTag =
                                            event.target.value.trim()
                                        setFieldValue('tags', inputTag)
                                    }}
                                />
                                <button
                                    className='py-2 text-sm   px-1 cursor-pointer w-full truncate rounded-tr-md rounded-md  bg-green-light text-dark hover:bg-white-green'
                                    type='button'
                                    onClick={() => {
                                        handleTagSelection(
                                            inputTag,
                                            values.tags,
                                            setFieldValue
                                        )
                                    }}
                                >
                                    Add tag
                                </button>

                                <div className='relative top-[-10px] '>
                                    {values.tags && inputTag ? (
                                        <div className='flex flex-col justify-center overflow-y-scroll  max-h-[200px] w-auto h-auto absolute bg-neutral-900 '>
                                            {tagsList
                                                .filter((tag) =>
                                                    tag.includes(values.tags)
                                                )
                                                .map((tag) => {
                                                    return (
                                                        <div
                                                            key={tag}
                                                            className='flex items-center cursor-pointer my-[4px]  w-44'
                                                            onClick={() => {
                                                                handleTagSelection(
                                                                    tag,
                                                                    values.tags
                                                                )
                                                            }}
                                                        >
                                                            <span className='text-sm pl-1 block  overflow-hidden text-ellipsis cursor-pointer w-1/2 border-2 border-r-0 border-green-light'>
                                                                {tag}
                                                            </span>
                                                            <span className='text-xs w-1/2 py-1 text-center font-medium bg-green-light text-dark hover:bg-white-green '>
                                                                Add tag
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className='w-full '>
                                    <CustomTextBox
                                        label='Description'
                                        name='description'
                                        placeholder='Short description about your model'
                                    />
                                </div>

                                <FieldArray name='files'>
                                    <div className='w-full'>
                                        {values.files.length > 0 &&
                                        values.files.filter((file) =>
                                            /^audio\//i.test(file.type)
                                        )
                                            ? values.files.map(
                                                  (file, index) => {
                                                      if (
                                                          /^audio\//i.test(
                                                              file.type
                                                          )
                                                      ) {
                                                          return (
                                                              <div key={index}>
                                                                  <audio
                                                                      src={URL.createObjectURL(
                                                                          values
                                                                              .files[
                                                                              index
                                                                          ]
                                                                      )}
                                                                      controls
                                                                  />
                                                              </div>
                                                          )
                                                      }
                                                  }
                                              )
                                            : null}
                                        <Field
                                            className='text-dark'
                                            name='audioTitle1'
                                            type='text'
                                            placeholder='Enter audio sample name'
                                        />
                                        <input
                                            name='file'
                                            type='file'
                                            accept='audio/*'
                                            onChange={(event) =>
                                                handleUpload(
                                                    values.files,
                                                    event,
                                                    setFieldValue
                                                )
                                            }
                                        />
                                        <ErrorMessage
                                            name='files'
                                            component='div'
                                            className='text-red-500'
                                        />
                                    </div>
                                </FieldArray>
                            </div>
                            <Dropzone
                                acceptedFiles='.pth,.index,.zip'
                                multiple={false}
                                onDrop={(event) =>
                                    handleUploadDropzone(
                                        values.files,
                                        event,
                                        setFieldValue
                                    )
                                }
                            >
                                {({ getRootProps, getInputProps }) => {
                                    return (
                                        <div
                                            {...getRootProps()}
                                            className='cursor-pointer border-dashed border-2 h-5 hover:opacity-70 flex justify-center items-center'
                                        >
                                            <input {...getInputProps()}></input>
                                            {values.files == false ? (
                                                <p className=' font-light text-xs text-slate-200 '>
                                                    upload model files
                                                </p>
                                            ) : (
                                                <p className=' font-light text-xs text-slate-200'>
                                                    {values.files == false
                                                        ? null
                                                        : values.files.map(
                                                              (file) => {
                                                                  if (
                                                                      /^application\/(x-zip-compressed|octet-stream)$/i.test(
                                                                          file.type
                                                                      ) ||
                                                                      /^$/.test(
                                                                          file.type
                                                                      )
                                                                  ) {
                                                                      return (
                                                                          file.name +
                                                                          ',' +
                                                                          ' '
                                                                      )
                                                                  }
                                                              }
                                                          )}
                                                </p>
                                            )}
                                        </div>
                                    )
                                }}
                            </Dropzone>

                            <button
                                className='btn2 py-4  relative rounded-br-md rounded-bl-md border-opacity-50  uppercase font-semibold tracking-wider leading-none overflow-hidden '
                                type='submit'
                            >
                                <span className='absolute inset-0 bg-green-light '></span>
                                <span className='absolute inset-0 flex justify-center  items-center'>
                                    Submit
                                </span>
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default PostModel