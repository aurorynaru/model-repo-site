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
import axios from 'axios'
import { useSelector } from 'react-redux'

const PostModel = () => {
    const token = useSelector((state) => state.token)
    const username_id = useSelector((state) => state.user.username_id)

    const navigate = useNavigate()
    const initialValues = {
        username_id,
        image: '',
        title: '',
        tags: [],
        files: [],
        model_character: 'test',
        model_for: '',
        epoch: '',
        description: '',
        steps: '',
        audioTitle1: '',
        random: ''
    }

    const Schema = yup.object().shape({
        image: yup.string(),
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
        files: yup.array().of(
            yup.mixed().test('fileFormat', 'Invalid file format', (value) => {
                if (!value) return false
                const validExtensions = [
                    '.pth',
                    '.zip',
                    '.index',
                    '.png',
                    '.jpeg',
                    '.jpg',
                    '.mp3',
                    '.wav',
                    '.opus'
                ]
                const fileExtension = '.' + value.name.split('.').pop()

                return validExtensions.includes(fileExtension)
            })
        )
    })

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
            const array = [...selectedTags, tag]
            setFieldValue('tags', array)
        } else {
            const filteredTags = selectedTags.filter(
                (selectedTag) => selectedTag != tag
            )

            setSelectedTags([...filteredTags])
            const array = [...filteredTags]
            setFieldValue('tags', array)
        }

        setInputTag('')
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

    const handleSubmit = async (values, onSubmitProps) => {
        const formData = new FormData()

        for (let value in values) {
            if (value == 'files') {
                values[value].forEach((file) => {
                    formData.append('files', file)
                })
            } else {
                formData.append(value, values[value])
            }
        }

        const savedUserResponse = await axios.post(
            'http://localhost:7777/models/post',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        const saved = await savedUserResponse.json()
        onSubmitProps.resetForm()
        if (saved) {
            navigate('/models/post')
        }
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
                            className='flex flex-col gap-5 pt-5  mt-10 w-1/3 mx-auto shadow-lg rounded-md bg-neutral-800 min-w-[550px]'
                            onSubmit={handleSubmit}
                        >
                            <div className='px-2 gap-4 flex flex-col'>
                                {renderUploadButtonModel(
                                    values,
                                    setFieldValue,
                                    errors,
                                    'image',
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

                                <CustomInput
                                    label='Tags'
                                    type='text'
                                    placeholder='Tags. crepe, crepev2, streamer '
                                    value={inputTag}
                                    onChange={(e) => {
                                        setInputTag(e.target.value)
                                    }}
                                />
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

                                <button
                                    className='py-2 text-sm  disabled:bg-opacity-50 px-1 cursor-pointer w-full truncate rounded-tr-md rounded-md  bg-green-light text-dark hover:bg-white-green'
                                    type='button'
                                    disabled={!inputTag}
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
                                    {inputTag ? (
                                        <div className='flex flex-col justify-center overflow-y-scroll  max-h-[200px] w-auto h-auto absolute bg-neutral-900 '>
                                            {tagsList
                                                .filter((tag) =>
                                                    tag.includes(inputTag)
                                                )
                                                .map((tag) => {
                                                    return (
                                                        <div
                                                            key={tag}
                                                            className='flex items-center cursor-pointer my-[4px]  w-44'
                                                            onClick={() => {
                                                                handleTagSelection(
                                                                    tag,
                                                                    values.tags,
                                                                    setFieldValue
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
                                    <div className='w-full '>
                                        <div className='w-[300px] h-[54px] mb-1'>
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
                                                                  <div
                                                                      key={
                                                                          index
                                                                      }
                                                                  >
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
                                                : ''}
                                        </div>
                                        <div className='flex  flex-col justify-center text-sm'>
                                            <Field
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`${tailWindCss} my-1 ${
                                                    errors.audioTitle1 &&
                                                    touched.audioTitle1
                                                        ? ` focus:ring-red-500 border-red-500`
                                                        : ''
                                                }`}
                                                name='audioTitle1'
                                                type='text'
                                                placeholder='Enter audio sample name'
                                            />
                                            <div className='sat'>
                                                <input
                                                    className='border-none'
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
                                            </div>
                                        </div>
                                    </div>
                                </FieldArray>
                            </div>
                            <Dropzone
                                acceptedFiles='.pth,.index,.zip'
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
                                            className='cursor-pointer py-6 m-1 border-dashed border-[3.5px] border-opacity-70 text-white-green hover:border-opacity-100 border-gray-500  flex justify-center items-center bg-inherit bg-opacity-50'
                                        >
                                            <input {...getInputProps()}></input>
                                            {values.files == false ||
                                            values.files.find((file) => {
                                                if (
                                                    /^application\/(x-zip-compressed|octet-stream|^$)$/i.test(
                                                        file.type
                                                    ) ||
                                                    (file.name
                                                        .split('.')
                                                        .pop() ===
                                                        'pth') |
                                                        (file.name
                                                            .split('.')
                                                            .pop() ===
                                                            'index')
                                                ) {
                                                    return true
                                                } else {
                                                    return undefined
                                                }
                                            }) === undefined ? (
                                                <p className=' font-light text-xs text-slate-200 '>
                                                    Upload model files
                                                </p>
                                            ) : (
                                                <p className=' font-light text-xs text-slate-200'>
                                                    {values.files == false
                                                        ? null
                                                        : values.files.map(
                                                              (file) => {
                                                                  if (
                                                                      /^application\/(x-zip-compressed|octet-stream|^$)$/i.test(
                                                                          file.type
                                                                      ) ||
                                                                      /^$/.test(
                                                                          file.type
                                                                      )
                                                                  ) {
                                                                      return `${file.name} `
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
