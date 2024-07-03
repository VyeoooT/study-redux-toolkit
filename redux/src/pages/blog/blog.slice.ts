import { PayloadAction, createSlice, current, nanoid } from "@reduxjs/toolkit"
import { initialPostList } from "../../constants/blog"
import { PostType } from "types/blog.type"

interface BlogStateType {
    postList: PostType[]
    editingPost: PostType | null
}

const initialState: BlogStateType= {
    postList: initialPostList,
    editingPost: null
}

// createSlice
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        // add post
        addPost: {
            reducer: (state, action: PayloadAction<PostType>) => {
                // immerjs giup chung ta mustate mot cach an toan
                const post = action.payload
                state.postList.push(post)
            },

            // `Omit` skip a field
            prepare: (post: Omit<PostType, 'id'>) => ({
                payload: {
                    ...post,

                    // su dung nanoid cua redux
                    id: nanoid()
                }
            })
        },

        // delete
        deletePost: (state, action: PayloadAction<string>) => {
            // dung `current` log xem truoc va sau khi xoa
            console.log('start', current(state))

            const postId = action.payload
            const foundPostIndex = state.postList.findIndex((post) => post.id === postId)

            if (foundPostIndex != -1) {
                state.postList.splice(foundPostIndex, 1)
            }

            console.log('end', current(state))
        },

        // start edit
        startEditingPost: (state, action: PayloadAction<string>) => {
            const postId = action.payload
            const foundPost = state.postList.find((post) => post.id === postId) || null

            state.editingPost = foundPost
        },

        // cancel edit
        cancelEditingPost: (state) => {
            state.editingPost = null
        },

        finishEditingPost: (state, action: PayloadAction<PostType>) => {
            const postId = action.payload.id
            console.log(postId)

            state.postList.some((post, idx) => {
                if (post.id === postId) {
                    state.postList[idx] = action.payload
                    return true
                }

                return false
            })

            state.editingPost = null
        }
    },

    // neu su dung `addMatcher` or `addCaseDefault` thi phai su dung trong `extraReducers` builder callback
    extraReducers(builder) {
        builder
            .addMatcher(
                (action) => action.type.includes('cancel'),
                (state, action) => {
                    console.log(current(state))
                }
            )
            .addDefaultCase((state, action) => {
                console.log(`action type default: ${action.type}`, current(state))
            })
    },
})

export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
