import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    mode: 'light',
    user: null,
    token: null,
    models: []
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogOut: (state) => {
            state.user = null
            state.token = null
        },
        setFollowers: (state, action) => {
            if (state.user) {
                state.user.followers = action.payload.followers
            } else {
                console.log('user followers not found')
            }
        },
        setModels: (state, action) => {
            state.models = action.payload.models
        },
        setPost: (state, action) => {
            const updatedPost = state.posts.map((post) => {
                if (post._id === action.payload.post._id)
                    return action.payload.post
                return post
            })
            state.posts = updatedPost
        }
    }
})

export const {
    setMode,
    setLogin,
    setLogOut,
    setFollowers,
    setModels,
    setPost
} = authSlice.actions

export default authSlice.reducer
