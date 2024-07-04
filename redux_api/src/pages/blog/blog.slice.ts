import { PayloadAction, createAsyncThunk, createSlice, AsyncThunk } from "@reduxjs/toolkit"
import { PostType } from "types/blog.type"
import http from "../../utils/http"

interface BlogStateType {
    postList: PostType[]
    editingPost: PostType | null
    loading: boolean
    currentRequestId: undefined | string
}

const initialState: BlogStateType= {
    postList: [],
    editingPost: null,
    loading: false,
    currentRequestId: undefined
}

// import type de lam skeleton loading
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

// xu ly getPostList bang ```createAsyncThunk```
export const getPostList = createAsyncThunk('blog/getPostList', async(_, thunkAPI) => {
    const response = await http.get<PostType[]>('posts', {
        signal: thunkAPI.signal
    })

    return response.data
})

// add post
export const addPost = createAsyncThunk('blog/addPost', async(body: Omit<PostType, 'id'>, thunkAPI) => {
    // xu ly hien thi loi tra ve tu server theo y muon
    try {
        const response = await http.post<PostType>('posts', body, {
            signal: thunkAPI.signal
        })
        return response.data

    } catch (error: any) {
        if (error.name === 'AxiosError' && error.response.status === 422) {
            return thunkAPI.rejectWithValue(error.response.data )
        }
        
        // neu khong nam trong loi ma da dinh nghia o server truoc do no se tra ve loi theo kieu mac dinh
        throw error
    }
})

// update post
export const updatePost = createAsyncThunk('blog/updatePost', async({ postId, body }: { postId: string, body: PostType}, thunkAPI) => {
    // xu ly hien thi loi tra ve tu server theo y muon
    try {
        const response = await http.put<PostType>(`posts/${postId}`, body, {
            signal: thunkAPI.signal
        })
        return response.data

    } catch (error: any) {
        if (error.name === 'AxiosError' && error.response.status === 422) {
            return thunkAPI.rejectWithValue(error.response.data )
        }

        // console.log(error)
        // neu khong nam trong loi ma da dinh nghia o server truoc do no se tra ve loi theo kieu mac dinh
        throw error
    }
})

// delete post
export const deletePost = createAsyncThunk('blog/deletePost', async(postId: string, thunkAPI) => {
    const response = await http.delete<PostType>(`posts/${postId}`, {
        signal: thunkAPI.signal
    })

    return response.data
})

// createSlice
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        // start edit
        startEditingPost: (state, action: PayloadAction<string>) => {
            const postId = action.payload
            const foundPost = state.postList.find((post) => post.id === postId) || null

            state.editingPost = foundPost
        },

        // cancel edit
        cancelEditingPost: (state) => {
            state.editingPost = null
        }
    },

    // neu su dung `addMatcher` or `addCaseDefault` thi phai su dung trong `extraReducers` builder callback
    extraReducers(builder) {
        builder
            // get data
            .addCase(getPostList.fulfilled, (state, action) => {
                state.postList = action.payload
            })

            // add post
            .addCase(addPost.fulfilled, (state, action) => {
                // khi nhan data json tu server tra ve thi ta push vao postList
                state.postList.push(action.payload)
            })

            // update post
            .addCase(updatePost.fulfilled, (state, action) => {
                state.postList.find((post, idx) => {
                    if (post.id === action.payload.id) {
                        state.postList[idx] = action.payload
                        return true
                    }
                    return false
                })
                state.editingPost = null
            })

            // delete post
            .addCase(deletePost.fulfilled, (state, action) => {
                // lay id cua post thong qua payload truyen vao
                const postId = action.meta.arg

                // tim id trong data post
                const deletePostIndex = state.postList.findIndex(post => post.id === postId)
                if (deletePostIndex != -1) {
                    state.postList.splice(deletePostIndex, 1)
                }
            })

            // matcher handle loading when pending, rejected, fulfilled
            .addMatcher<PendingAction>(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.loading = true
                    state.currentRequestId = action.meta.requestId
                }
            )
            .addMatcher<RejectedAction | FulfilledAction>(
                (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
                (state, action) => {
                    if (state.loading && state.currentRequestId === action.meta.requestId) {
                        state.loading = false
                        state.currentRequestId = undefined
                    }
                }
            )
    },
})

export const { startEditingPost, cancelEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
